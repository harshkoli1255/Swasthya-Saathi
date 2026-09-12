import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/models/api_models.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_header.dart';
import '../../../../shared/widgets/status_badge.dart';

class ReviewScreen extends ConsumerStatefulWidget {
  final String? token;

  const ReviewScreen({super.key, this.token});

  @override
  ConsumerState<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends ConsumerState<ReviewScreen> {
  bool _isLoading = false;
  String _patientName = 'Rahul Sharma';
  String _abhaNumber = '91-4829-1029-4820';
  String _opdId = 'OPD-A42';
  String? _chiefComplaint;
  String? _duration;
  String? _agni;
  String? _nidra;
  String? _satmya;
  List<ExtractedFact> _facts = [];

  @override
  void initState() {
    super.initState();
    _loadReviewData();
  }

  Future<void> _loadReviewData() async {
    final client = ref.read(apiClientProvider);
    final token = widget.token ?? '';
    if (token.isNotEmpty) {
      try {
        final status = await client.getSessionStatus(token);
        if (mounted) {
          setState(() {
            _patientName = status.patientName;
            _abhaNumber = status.abhaNumber ?? _abhaNumber;
            _opdId = status.opdId ?? _opdId;
          });
        }
      } catch (_) {}
    }
    try {
      final summary = await client.getReviewSummary();
      if (mounted && summary.facts.isNotEmpty) {
        setState(() {
          _facts = summary.facts;
          for (final f in summary.facts) {
            if (f.slot == 'chief_complaint' && f.value != null) {
              _chiefComplaint = f.value.toString();
            } else if (f.slot == 'duration' && f.value != null) {
              _duration = f.value.toString();
            } else if (f.slot == 'ayush_agni' && f.value != null) {
              _agni = f.value.toString();
            } else if (f.slot == 'ayush_nidra' && f.value != null) {
              _nidra = f.value.toString();
            } else if (f.slot == 'ayush_satmya' && f.value != null) {
              _satmya = f.value.toString();
            }
          }
        });
      }
    } catch (_) {}
  }

  Future<void> _confirmAndSubmit() async {
    setState(() => _isLoading = true);
    try {
      final client = ref.read(apiClientProvider);
      await client.confirmReview();
      if (mounted) {
        context.go('/token?token=${widget.token ?? ''}&opd=$_opdId');
      }
    } catch (e) {
      if (mounted) {
        context.go('/token?token=${widget.token ?? ''}&opd=$_opdId');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppHeader(
        title: 'CASE INTAKE SUMMARY',
        subtitle: 'Screen 16 • OPD Kayachikitsa',
        onBack: () => context.pop(),
        action: const StatusBadge.emerald(label: 'Ready', dot: true),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: ListView(
                  children: [
                    // Patient Header with ABDM Badge
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('$_patientName • Male, 34y', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textDark), overflow: TextOverflow.ellipsis),
                                const SizedBox(height: 2),
                                Text('ABHA: $_abhaNumber', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textMuted)),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          const StatusBadge.emerald(label: 'ABDM Linked', dot: true),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Chief Complaint Section
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('CHIEF COMPLAINT / मुख्य समस्या', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.primarySaffron)),
                              Text('Edit', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primarySaffron)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _chiefComplaint != null ? '"$_chiefComplaint"' : '"Severe burning sensation in stomach after meals for 2 weeks. Worsens at night with sour acid reflux."',
                            style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w500, color: AppTheme.textDark, height: 1.4),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Text('Duration: ${_duration ?? '14 Days'}', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
                              const SizedBox(width: 8),
                              const Text('•', style: TextStyle(color: AppTheme.borderLight)),
                              const SizedBox(width: 8),
                              Text('Severity: Moderate', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // AYUSH Markers Section
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('AYUSH MARKERS / प्रकृति विवरण', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.primaryEmerald)),
                              Text('Edit', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primaryEmerald)),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Agni (Digestion)', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppTheme.textTertiary)),
                                    const SizedBox(height: 2),
                                    Text(_agni ?? 'Tikshnagni (Sharp)', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                                  ],
                                ),
                              ),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Nidra (Sleep)', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppTheme.textTertiary)),
                                    const SizedBox(height: 2),
                                    Text(_nidra ?? 'Broken (खंडित)', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                                  ],
                                ),
                              ),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Satmya', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppTheme.textTertiary)),
                                    const SizedBox(height: 2),
                                    Text(_satmya ?? 'Heat Sensitive', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Attached Prescriptions
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('1 Prescription Attached (OCR Verified)', style: GoogleFonts.plusJakartaSans(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                              const SizedBox(height: 2),
                              Text('Avipattikar Churna, Sutshekhar Ras', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textMuted)),
                            ],
                          ),
                          Text('View', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primarySaffron)),
                        ],
                      ),
                    ),
                    if (_facts.where((f) => !['chief_complaint', 'duration', 'ayush_agni', 'ayush_nidra', 'ayush_satmya'].contains(f.slot)).isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('ADDITIONAL CLINICAL FACTS', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.textTertiary)),
                            const SizedBox(height: 8),
                            ..._facts.where((f) => !['chief_complaint', 'duration', 'ayush_agni', 'ayush_nidra', 'ayush_satmya'].contains(f.slot)).map(
                              (f) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 2.0),
                                child: Text('${f.slot}: ${f.value}', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textDark)),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 16),

                    // Strict Physician Examination Disclaimer
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.borderLight),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Physician Examination Notice:',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'This summary will be handed over to Dr. Ayush Sharma. AI assists in case intake; your doctor independently examines and prescribes.',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF475569), height: 1.45),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              AppPrimaryButton(
                text: 'Submit Case to OPD Queue →',
                isLoading: _isLoading,
                onPressed: _confirmAndSubmit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
