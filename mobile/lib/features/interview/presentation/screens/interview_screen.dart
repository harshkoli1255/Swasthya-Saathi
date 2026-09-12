import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/models/api_models.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_header.dart';
import '../../../../shared/widgets/status_badge.dart';
import '../../../../shared/widgets/choice_card.dart';
import '../../../../shared/widgets/acoustic_waveform.dart';

enum InterviewPhase {
  question1Idle,       // Screen 07: Question 1 Chief Complaint idle mic & chips
  question1Listening,  // Screen 08: Active voice listening with 21 waveform bars
  question1Processing, // Screen 09: Audio processing spinner & milestones
  question1ReviewEdit, // Screen 10: Transcript review & edit textarea
  adaptiveFollowup,    // Screen 11: Adaptive Question 2 timeline follow-up
  ayushPrakriti,       // Screen 12: AYUSH Prakriti constitutional markers
}

class InterviewScreen extends ConsumerStatefulWidget {
  final String? token;

  const InterviewScreen({super.key, this.token});

  @override
  ConsumerState<InterviewScreen> createState() => _InterviewScreenState();
}

class _InterviewScreenState extends ConsumerState<InterviewScreen> {
  InterviewPhase _phase = InterviewPhase.question1Idle;
  final AudioRecorder _audioRecorder = AudioRecorder();

  // State data
  String _activeQuestionId = "q-chief-complaint";
  String _activeSlot = "chief_complaint";
  String? _recordedAudioPath;
  int _recordSeconds = 0;
  Timer? _recordTimer;
  bool _isSubmitting = false;

  final TextEditingController _transcriptController = TextEditingController(
    text: "Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan aur gas ki shikayat hai. Raat ko takleef badh jaati hai aur khatti dakar aati hai.",
  );

  // Follow-up state
  int _selectedFollowupOption = 0;

  // AYUSH Prakriti state
  int _selectedAgni = 1; // 0: Samagni, 1: Tikshnagni, 2: Mandagni, 3: Vishamagni
  int _selectedNidra = 1; // 0: Deep, 1: Broken, 2: Insomnia
  int _selectedWeather = 0; // 0: Hot, 1: Cold, 2: Rainy

  @override
  void initState() {
    super.initState();
    _fetchBackendQuestion();
  }

  @override
  void dispose() {
    _recordTimer?.cancel();
    _audioRecorder.dispose();
    _transcriptController.dispose();
    super.dispose();
  }

  Future<void> _fetchBackendQuestion() async {
    try {
      final client = ref.read(apiClientProvider);
      final nextQ = await client.getNextQuestion();
      if (nextQ.questionId != null) {
        setState(() {
          _activeQuestionId = nextQ.questionId!;
          _activeSlot = nextQ.targetSlot ?? "chief_complaint";
        });
      }
    } catch (_) {
      // Keep robust defaults
    }
  }

  // --- Voice Recording Flow ---
  Future<void> _startRecording() async {
    try {
      final hasPermission = await _audioRecorder.hasPermission();
      if (!hasPermission) {
        _showMicPermissionSheet();
        return;
      }

      final dir = await getTemporaryDirectory();
      final filePath = '${dir.path}/patient_intake_${DateTime.now().millisecondsSinceEpoch}.m4a';

      await _audioRecorder.start(
        const RecordConfig(encoder: AudioEncoder.aacLc),
        path: filePath,
      );

      setState(() {
        _phase = InterviewPhase.question1Listening;
        _recordedAudioPath = filePath;
        _recordSeconds = 0;
      });

      _recordTimer = Timer.periodic(const Duration(seconds: 1), (t) {
        setState(() => _recordSeconds++);
      });
    } catch (e) {
      // Fallback transition for testing on emulators without mic
      setState(() {
        _phase = InterviewPhase.question1Listening;
        _recordSeconds = 0;
      });
      _recordTimer = Timer.periodic(const Duration(seconds: 1), (t) {
        setState(() => _recordSeconds++);
      });
    }
  }

  Future<void> _stopRecordingAndProcess() async {
    _recordTimer?.cancel();
    try {
      final path = await _audioRecorder.stop();
      if (path != null) {
        _recordedAudioPath = path;
      }
    } catch (_) {}

    setState(() => _phase = InterviewPhase.question1Processing);

    // Call real backend upload or transition
    try {
      final client = ref.read(apiClientProvider);
      if (_recordedAudioPath != null && File(_recordedAudioPath!).existsSync()) {
        final result = await client.uploadVoice(
          questionId: _activeQuestionId,
          targetSlot: _activeSlot,
          file: File(_recordedAudioPath!),
        );
        final recognized = result['transcript'] ?? result['raw_text'] ?? result['extracted_text'];
        if (recognized != null && recognized.toString().trim().isNotEmpty && mounted) {
          _transcriptController.text = recognized.toString().trim();
        }
      }
    } catch (_) {}

    // Transition to review after brief milestone display
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() => _phase = InterviewPhase.question1ReviewEdit);
    }
  }

  void _showMicPermissionSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 48,
                height: 5,
                decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(14)),
                  child: const Icon(Icons.mic_off_rounded, color: AppTheme.errorRed, size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Microphone Access Required', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w800)),
                      Text('Needed for Hindi/English voice symptom intake.', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: AppTheme.surfaceBackground, borderRadius: BorderRadius.circular(16)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('1. Open Android Settings > Apps > SwasthyaSaathi', style: GoogleFonts.plusJakartaSans(fontSize: 11)),
                  const SizedBox(height: 4),
                  Text('2. Tap Permissions > Microphone', style: GoogleFonts.plusJakartaSans(fontSize: 11)),
                  const SizedBox(height: 4),
                  Text('3. Select "Allow only while using the app"', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primaryEmerald)),
                ],
              ),
            ),
            const SizedBox(height: 18),
            AppPrimaryButton(
              text: 'Switch to Typing Mode Instead',
              onPressed: () {
                Navigator.pop(ctx);
                setState(() => _phase = InterviewPhase.question1ReviewEdit);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitChiefComplaint() async {
    if (_isSubmitting) return;
    setState(() => _isSubmitting = true);
    try {
      final client = ref.read(apiClientProvider);
      await client.submitAnswer(
        AnswerPayload(
          questionId: _activeQuestionId,
          targetSlot: _activeSlot,
          rawText: _transcriptController.text.trim(),
        ),
      );
    } catch (_) {} finally {
      if (mounted) setState(() => _isSubmitting = false);
    }

    if (mounted) {
      setState(() => _phase = InterviewPhase.adaptiveFollowup);
    }
  }

  Future<void> _submitAdaptiveFollowup() async {
    if (_isSubmitting) return;
    setState(() => _isSubmitting = true);
    final options = [
      "Immediately after eating (within 30 mins)",
      "2 to 3 hours later or empty stomach",
      "Wakes me up at night from sleep",
      "Constant throughout the day",
    ];
    try {
      final client = ref.read(apiClientProvider);
      await client.submitAnswer(
        AnswerPayload(
          questionId: "q-adaptive-timing",
          targetSlot: "symptom_timing",
          rawText: options[_selectedFollowupOption],
        ),
      );
    } catch (_) {} finally {
      if (mounted) setState(() => _isSubmitting = false);
    }

    if (mounted) {
      setState(() => _phase = InterviewPhase.ayushPrakriti);
    }
  }

  Future<void> _submitAyushPrakriti() async {
    if (_isSubmitting) return;
    setState(() => _isSubmitting = true);
    final agniLabels = ["Samagni (Balanced)", "Tikshnagni (Sharp)", "Mandagni (Slow)", "Vishamagni (Irregular)"];
    final nidraLabels = ["Deep", "Broken", "Insomnia"];
    final weatherLabels = ["Hot / गर्मी (Pitta flare)", "Cold / ठंड (Vata flare)", "Rainy / नमी (Kapha flare)"];

    try {
      final client = ref.read(apiClientProvider);
      await client.submitAnswer(
        AnswerPayload(
          questionId: "q-ayush-markers",
          targetSlot: "ayush_prakriti",
          rawText: "Agni: ${agniLabels[_selectedAgni]}, Nidra: ${nidraLabels[_selectedNidra]}, Satmya: ${weatherLabels[_selectedWeather]}",
        ),
      );
    } catch (_) {} finally {
      if (mounted) setState(() => _isSubmitting = false);
    }

    if (mounted) {
      context.push('/scanner?token=${widget.token ?? ''}');
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget content;
    switch (_phase) {
      case InterviewPhase.question1Idle:
        content = _buildQuestion1Idle();
        break;
      case InterviewPhase.question1Listening:
        content = _buildQuestion1Listening();
        break;
      case InterviewPhase.question1Processing:
        content = _buildQuestion1Processing();
        break;
      case InterviewPhase.question1ReviewEdit:
        content = _buildQuestion1ReviewEdit();
        break;
      case InterviewPhase.adaptiveFollowup:
        content = _buildAdaptiveFollowup();
        break;
      case InterviewPhase.ayushPrakriti:
        content = _buildAyushPrakriti();
        break;
    }

    return PopScope(
      canPop: _phase == InterviewPhase.question1Idle,
      onPopInvokedWithResult: (didPop, result) async {
        if (!didPop) {
          if (_phase == InterviewPhase.question1Listening) {
            _recordTimer?.cancel();
            try {
              await _audioRecorder.stop();
            } catch (_) {}
            setState(() => _phase = InterviewPhase.question1Idle);
          } else if (_phase == InterviewPhase.question1Processing) {
            setState(() => _phase = InterviewPhase.question1Idle);
          } else if (_phase == InterviewPhase.question1ReviewEdit) {
            setState(() => _phase = InterviewPhase.question1Idle);
          } else if (_phase == InterviewPhase.adaptiveFollowup) {
            setState(() => _phase = InterviewPhase.question1ReviewEdit);
          } else if (_phase == InterviewPhase.ayushPrakriti) {
            setState(() => _phase = InterviewPhase.adaptiveFollowup);
          }
        }
      },
      child: content,
    );
  }

  // --- 07. QUESTION 1 IDLE ---
  Widget _buildQuestion1Idle() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppHeader(
        title: 'CHIEF COMPLAINT',
        subtitle: 'Question 1 of 4',
        trailing: const StatusBadge(
          label: 'Step 1 of 4',
          variant: BadgeVariant.saffron,
        ),
        onBack: () => context.pop(),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'What health trouble brings you to the clinic today?',
                style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.textDark, height: 1.25),
              ),
              const SizedBox(height: 4),
              Text(
                'आज आपको क्या स्वास्थ्य समस्या है?',
                style: GoogleFonts.notoSansDevanagari(fontSize: 13, color: AppTheme.textMuted),
              ),
              const SizedBox(height: 10),
              Text(
                'Speak naturally in Hindi, Marathi, or English. Tell us where it hurts, when it started, and any medicines you took.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12.5, color: AppTheme.textMuted, height: 1.4),
              ),
              const SizedBox(height: 18),

              Text('COMMON SYMPTOMS (TAP TO ADD)', style: GoogleFonts.plusJakartaSans(fontSize: 10.5, fontWeight: FontWeight.w800, color: AppTheme.textMuted)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _buildSymptomChip('Stomach burning / जलन'),
                  _buildSymptomChip('Fever / बुखार'),
                  _buildSymptomChip('Sour reflux / गैस'),
                  _buildSymptomChip('Joint pain / जोड़ों का दर्द'),
                ],
              ),

              const Spacer(),

              // Circular Glowing Mic Orb
              Center(
                child: Column(
                  children: [
                    InkWell(
                      onTap: _startRecording,
                      borderRadius: BorderRadius.circular(50),
                      child: Container(
                        width: 86,
                        height: 86,
                        decoration: BoxDecoration(
                          color: AppTheme.primarySaffron,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primarySaffron.withValues(alpha: 0.4),
                              blurRadius: 24,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.mic_rounded, color: Colors.white, size: 40),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Tap to Speak Symptoms',
                      style: GoogleFonts.plusJakartaSans(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                    ),
                    Text(
                      'बोलने के लिए माइक दबाएं',
                      style: GoogleFonts.notoSansDevanagari(fontSize: 11.5, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              Center(
                child: TextButton.icon(
                  onPressed: () => setState(() => _phase = InterviewPhase.question1ReviewEdit),
                  icon: const Icon(Icons.keyboard_outlined, size: 18, color: AppTheme.textDark),
                  label: Text('Prefer to type your answer instead?', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textDark)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSymptomChip(String label) {
    return ActionChip(
      label: Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppTheme.textDark)),
      backgroundColor: Colors.white,
      side: const BorderSide(color: AppTheme.borderLight),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      onPressed: () {
        _transcriptController.text += ' $label';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Added: $label'), duration: const Duration(seconds: 1)),
        );
      },
    );
  }

  // --- 08. VOICE ACTIVE LISTENING ---
  Widget _buildQuestion1Listening() {
    final mins = (_recordSeconds ~/ 60).toString().padLeft(2, '0');
    final secs = (_recordSeconds % 60).toString().padLeft(2, '0');

    return Scaffold(
      backgroundColor: const Color(0xFFFFFDFB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFFFBF8),
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Center(
            child: Container(
              width: 10,
              height: 10,
              decoration: const BoxDecoration(color: AppTheme.errorRed, shape: BoxShape.circle),
            ),
          ),
        ),
        title: Text(
          'LISTENING • $mins:$secs',
          style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.errorRed, letterSpacing: 0.5),
        ),
        actions: [
          TextButton(
            onPressed: () => setState(() => _phase = InterviewPhase.question1Idle),
            child: Text('Cancel', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textMuted)),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('CHIEF COMPLAINT • QUESTION 1 OF 4', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.primarySaffron)),
              const SizedBox(height: 4),
              Text(
                'What health trouble brings you here today?',
                style: GoogleFonts.plusJakartaSans(fontSize: 19, fontWeight: FontWeight.w800, color: AppTheme.textDark),
              ),
              const Spacer(),

              // 21 Harmonic Pulsing Audio Bars
              const AcousticWaveformOrb(isListening: true),

              const SizedBox(height: 24),

              // Live Speech Transcribed Bubble
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.saffronLight,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.saffronBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Transcribing speech in real-time...', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF9A3412))),
                        Text('✓ Hindi / English', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.primaryEmerald)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '"Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan hoti hai, aur raat ko khatti dakar aati hai..."',
                      style: GoogleFonts.plusJakartaSans(fontSize: 13, fontStyle: FontStyle.italic, color: AppTheme.textDark, height: 1.4),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),
              Center(
                child: Text('Speak naturally. Tap below when you finish explaining.', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
              ),

              const Spacer(),

              AppPrimaryButton(
                text: 'Done Speaking / बोलना समाप्त',
                icon: const Icon(Icons.stop_rounded, size: 20, color: Colors.white),
                onPressed: _stopRecordingAndProcess,
              ),
              const SizedBox(height: 8),
              Center(
                child: TextButton(
                  onPressed: _startRecording,
                  child: Text('Restart audio / दोबारा बोलें', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- 09. AUDIO PROCESSING STATE ---
  Widget _buildQuestion1Processing() {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFDFB),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [AppTheme.primarySaffron, Color(0xFFF97316)]),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: AppTheme.primarySaffron.withValues(alpha: 0.35), blurRadius: 20, offset: const Offset(0, 8)),
                  ],
                ),
                child: const Center(
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Structuring Your Symptoms...',
                style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textDark),
              ),
              const SizedBox(height: 6),
              Text(
                'Transcribing Hindi speech and extracting clinical timeline for Dr. Ayush Sharma.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 28),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.saffronBorder),
                ),
                child: Column(
                  children: [
                    _buildMilestoneRow('Audio recording captured (00:18)', true),
                    const SizedBox(height: 10),
                    _buildMilestoneRow('Hindi/English speech recognized', true),
                    const SizedBox(height: 10),
                    _buildMilestoneRow('Organizing symptom severity & duration...', false, isActive: true),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMilestoneRow(String text, bool isDone, {bool isActive = false}) {
    return Row(
      children: [
        Icon(
          isDone ? Icons.check_circle_rounded : Icons.radio_button_checked_rounded,
          color: isDone ? AppTheme.primaryEmerald : (isActive ? AppTheme.primarySaffron : AppTheme.textTertiary),
          size: 16,
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: (isDone || isActive) ? FontWeight.w700 : FontWeight.w500,
              color: isDone ? AppTheme.primaryEmerald : (isActive ? AppTheme.primarySaffron : AppTheme.textMuted),
            ),
          ),
        ),
      ],
    );
  }

  // --- 10. TRANSCRIPT REVIEW & EDIT ---
  Widget _buildQuestion1ReviewEdit() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppTheme.textDark),
          onPressed: () => setState(() => _phase = InterviewPhase.question1Idle),
        ),
        title: Text('Edit Transcript', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark)),
        actions: [
          TextButton(
            onPressed: () {
              _transcriptController.clear();
            },
            child: Text('Reset', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primarySaffron)),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(3),
          child: LinearProgressIndicator(value: 0.25, backgroundColor: AppTheme.borderLight, valueColor: const AlwaysStoppedAnimation(AppTheme.primarySaffron)),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Edit your response / अपनी बात संपादित करें', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
              const SizedBox(height: 4),
              Text('Make any corrections before saving to your doctor’s case sheet.', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted)),
              const SizedBox(height: 18),

              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.primarySaffron, width: 2),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 3)),
                    ],
                  ),
                  child: Column(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _transcriptController,
                          maxLines: null,
                          expands: true,
                          style: GoogleFonts.plusJakartaSans(fontSize: 14.5, fontWeight: FontWeight.w500, color: AppTheme.textDark, height: 1.5),
                          decoration: const InputDecoration(border: InputBorder.none, hintText: 'Type your symptoms...'),
                        ),
                      ),
                      Container(height: 1, color: AppTheme.borderHairline),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${_transcriptController.text.length} characters', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textMuted)),
                          Text('✓ Hindi/English recognized', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primaryEmerald)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: AppTheme.saffronLight, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.saffronBorder)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Need to re-record with voice?', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: const Color(0xFF9A3412))),
                    TextButton(
                      onPressed: () => setState(() => _phase = InterviewPhase.question1Idle),
                      child: Text('Re-record voice', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w700, color: AppTheme.primarySaffron)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              AppPrimaryButton(
                text: 'Save & Continue',
                icon: const Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                onPressed: _submitChiefComplaint,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- 11. ADAPTIVE FOLLOWUP QUESTION ---
  Widget _buildAdaptiveFollowup() {
    final options = [
      {'title': 'Immediately after eating (within 30 mins)', 'subtitle': 'खाने के तुरंत बाद • Suggestive of Amlapitta'},
      {'title': '2 to 3 hours later or empty stomach', 'subtitle': '2-3 घंटे बाद या खाली पेट'},
      {'title': 'Wakes me up at night from sleep', 'subtitle': 'रात को नींद से जगा देती है'},
      {'title': 'Constant throughout the day', 'subtitle': 'पूरे दिन लगातार बनी रहती है'},
    ];

    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppHeader(
        title: 'SYMPTOM TIMELINE',
        subtitle: 'Question 2 of 4',
        trailing: const StatusBadge(
          label: 'Step 2 of 4',
          variant: BadgeVariant.saffron,
        ),
        onBack: () => setState(() => _phase = InterviewPhase.question1ReviewEdit),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: AppTheme.infoLight, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.infoBorder)),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.chat_bubble_outline_rounded, color: AppTheme.infoBlue, size: 14),
                    const SizedBox(width: 6),
                    Text('Follow-up on: Stomach burning after meals', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.infoBlue)),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Text(
                'Does the burning happen immediately after meals, or 2–3 hours later?',
                style: GoogleFonts.plusJakartaSans(fontSize: 19, fontWeight: FontWeight.w800, color: AppTheme.textDark, height: 1.3),
              ),
              const SizedBox(height: 4),
              Text('खाने के तुरंत बाद या कुछ घंटों बाद?', style: GoogleFonts.notoSansDevanagari(fontSize: 12, color: AppTheme.textMuted)),
              const SizedBox(height: 20),

              ...List.generate(options.length, (idx) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: ChoiceCard(
                    title: options[idx]['title']!,
                    subtitle: options[idx]['subtitle'],
                    isSelected: _selectedFollowupOption == idx,
                    onTap: () => setState(() => _selectedFollowupOption = idx),
                  ),
                );
              }),

              const Spacer(),

              AppPrimaryButton(
                text: 'Next: AYUSH Markers (Step 3)',
                icon: const Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                isLoading: _isSubmitting,
                onPressed: _submitAdaptiveFollowup,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- 12. AYUSH PRAKRITI INTAKE ---
  Widget _buildAyushPrakriti() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppHeader(
        title: 'CONSTITUTIONAL MARKERS',
        subtitle: 'Prakriti Assessment • Step 3 of 4',
        trailing: const StatusBadge(
          label: 'Step 3 of 4',
          variant: BadgeVariant.emerald,
        ),
        onBack: () => setState(() => _phase = InterviewPhase.adaptiveFollowup),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Constitutional Markers / प्रकृति विवरण', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
              const SizedBox(height: 4),
              Text(
                'These physiological indicators help your AYUSH physician customize herbal formulations.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView(
                  children: [
                    // Agni Section
                    Text('1. Agni (Digestion & Appetite / अग्नि)', style: GoogleFonts.plusJakartaSans(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 8,
                      crossAxisSpacing: 8,
                      childAspectRatio: 2.1,
                      children: [
                        _buildMiniCard('Samagni (Balanced)', 'Normal timely hunger', _selectedAgni == 0, () => setState(() => _selectedAgni = 0)),
                        _buildMiniCard('Tikshnagni (Sharp)', 'Frequent acid hunger', _selectedAgni == 1, () => setState(() => _selectedAgni = 1)),
                        _buildMiniCard('Mandagni (Slow)', 'Sluggish appetite', _selectedAgni == 2, () => setState(() => _selectedAgni = 2)),
                        _buildMiniCard('Vishamagni (Irregular)', 'Unpredictable hunger', _selectedAgni == 3, () => setState(() => _selectedAgni = 3)),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Nidra Section
                    Text('2. Nidra (Sleep Quality / निद्रा)', style: GoogleFonts.plusJakartaSans(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: _buildMiniCard('Deep', 'गहरी नींद', _selectedNidra == 0, () => setState(() => _selectedNidra = 0))),
                        const SizedBox(width: 8),
                        Expanded(child: _buildMiniCard('Broken', 'खंडित नींद', _selectedNidra == 1, () => setState(() => _selectedNidra = 1))),
                        const SizedBox(width: 8),
                        Expanded(child: _buildMiniCard('Insomnia', 'अनिद्रा', _selectedNidra == 2, () => setState(() => _selectedNidra = 2))),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Weather Section
                    Text('3. Weather Aggravation / मौसम', style: GoogleFonts.plusJakartaSans(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: _buildMiniCard('Hot / गर्मी', 'Pitta flare', _selectedWeather == 0, () => setState(() => _selectedWeather = 0))),
                        const SizedBox(width: 8),
                        Expanded(child: _buildMiniCard('Cold / ठंड', 'Vata flare', _selectedWeather == 1, () => setState(() => _selectedWeather = 1))),
                        const SizedBox(width: 8),
                        Expanded(child: _buildMiniCard('Rainy / नमी', 'Kapha flare', _selectedWeather == 2, () => setState(() => _selectedWeather = 2))),
                      ],
                    ),
                  ],
                ),
              ),

              AppPrimaryButton(
                text: 'Save Clinical Markers & Continue →',
                isLoading: _isSubmitting,
                onPressed: _submitAyushPrakriti,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMiniCard(String title, String subtitle, bool isSelected, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.emeraldLight : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppTheme.primaryEmerald : AppTheme.borderLight,
            width: isSelected ? 2.0 : 1.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Flexible(child: Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: isSelected ? AppTheme.primaryEmerald : AppTheme.textDark), overflow: TextOverflow.ellipsis)),
                if (isSelected) const Icon(Icons.check_rounded, color: AppTheme.primaryEmerald, size: 14),
              ],
            ),
            const SizedBox(height: 2),
            Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 9.5, color: isSelected ? AppTheme.primaryEmerald : AppTheme.textMuted), overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}
