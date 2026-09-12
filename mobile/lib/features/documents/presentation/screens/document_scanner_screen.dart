import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_header.dart';
import '../../../../shared/widgets/status_badge.dart';

enum DocumentPhase {
  viewfinder, // Screen 13: Camera viewfinder with corner brackets
  processing, // Screen 14: Scanning laser OCR analysis
  extractedReview, // Screen 15: Extracted medicine facts confirmation
  multipage, // Screen 23: Multi-page document carousel
  failure, // Screen 21: Document processing failure
}

class DocumentScannerScreen extends ConsumerStatefulWidget {
  final String? token;

  const DocumentScannerScreen({super.key, this.token});

  @override
  ConsumerState<DocumentScannerScreen> createState() => _DocumentScannerScreenState();
}

class _DocumentScannerScreenState extends ConsumerState<DocumentScannerScreen>
    with SingleTickerProviderStateMixin {
  DocumentPhase _phase = DocumentPhase.viewfinder;
  final ImagePicker _picker = ImagePicker();
  File? _scannedFile;
  String? _extractedOcrText;
  late AnimationController _laserController;

  @override
  void initState() {
    super.initState();
    _laserController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _laserController.dispose();
    super.dispose();
  }

  Future<void> _captureImage(ImageSource source) async {
    try {
      final xFile = await _picker.pickImage(source: source);
      if (xFile != null) {
        setState(() {
          _scannedFile = File(xFile.path);
          _phase = DocumentPhase.processing;
        });
        _uploadAndProcessDoc();
      }
    } catch (e) {
      // Fallback for camera hardware lock or emulator
      _showCameraUnavailableDialog();
    }
  }

  Future<void> _uploadAndProcessDoc() async {
    try {
      final client = ref.read(apiClientProvider);
      if (_scannedFile != null) {
        final res = await client.uploadDocument(_scannedFile!);
        if (res['extracted_text'] != null) {
          _extractedOcrText = res['extracted_text'].toString();
        }
      }
      await Future.delayed(const Duration(milliseconds: 1200));
      if (mounted) {
        setState(() => _phase = DocumentPhase.extractedReview);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _phase = DocumentPhase.failure);
      }
    }
  }

  void _showCameraUnavailableDialog() {
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
              child: Container(width: 48, height: 5, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(10))),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(14)),
                  child: const Icon(Icons.camera_alt_outlined, color: AppTheme.errorRed, size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Camera Currently Unavailable', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w800)),
                      Text('Choose photo from gallery or skip document step.', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            AppPrimaryButton(
              text: 'Choose Photo from Gallery',
              icon: const Icon(Icons.photo_library_outlined, size: 18, color: Colors.white),
              onPressed: () {
                Navigator.pop(ctx);
                _captureImage(ImageSource.gallery);
              },
            ),
            const SizedBox(height: 10),
            Center(
              child: TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  context.push('/review?token=${widget.token ?? ''}');
                },
                child: Text('Skip Prescription Upload →', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (_phase) {
      case DocumentPhase.viewfinder:
        return _buildViewfinder();
      case DocumentPhase.processing:
        return _buildProcessing();
      case DocumentPhase.extractedReview:
        return _buildExtractedReview();
      case DocumentPhase.multipage:
        return _buildMultipage();
      case DocumentPhase.failure:
        return _buildFailure();
    }
  }

  // --- 13. VIEW FINDER ---
  Widget _buildViewfinder() {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: SafeArea(
        child: Column(
          children: [
            // Top Controls
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white, size: 24),
                    onPressed: () => context.pop(),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 7, height: 7, decoration: const BoxDecoration(color: AppTheme.emeraldVivid, shape: BoxShape.circle)),
                        const SizedBox(width: 8),
                        Text('Auto-Document Detection', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.flash_off_rounded, color: Colors.white, size: 22),
                    onPressed: () {},
                  ),
                ],
              ),
            ),

            const Spacer(),

            // Center Viewfinder Target Frame with Glowing Corner Brackets
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Container(
                height: 380,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.emeraldVivid.withValues(alpha: 0.6), width: 1.5),
                  color: Colors.white.withValues(alpha: 0.04),
                ),
                child: Stack(
                  children: [
                    // Corner Brackets
                    Positioned(top: 8, left: 8, child: _buildCorner(true, true)),
                    Positioned(top: 8, right: 8, child: _buildCorner(true, false)),
                    Positioned(bottom: 8, left: 8, child: _buildCorner(false, true)),
                    Positioned(bottom: 8, right: 8, child: _buildCorner(false, false)),

                    Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                            decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.7), borderRadius: BorderRadius.circular(16)),
                            child: Text(
                              'Hold steady • Align prescription inside',
                              style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFF6EE7B7)),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Shree Vishwakarma Ayurvedic Clinic Detected',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.white70),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const Spacer(),

            // Bottom Shutter & Gallery Controls
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.photo_library_rounded, color: Colors.white, size: 28),
                    onPressed: () => _captureImage(ImageSource.gallery),
                  ),

                  // Big Shutter Button
                  InkWell(
                    onTap: () => _captureImage(ImageSource.camera),
                    borderRadius: BorderRadius.circular(45),
                    child: Container(
                      width: 78,
                      height: 78,
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 4),
                      ),
                      child: Container(
                        decoration: const BoxDecoration(
                          color: AppTheme.primarySaffron,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ),

                  // Carousel counter
                  InkWell(
                    onTap: () => setState(() => _phase = DocumentPhase.multipage),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      alignment: Alignment.center,
                      child: Text('2\nPAGES', textAlign: TextAlign.center, style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCorner(bool isTop, bool isLeft) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        border: Border(
          top: isTop ? const BorderSide(color: AppTheme.emeraldVivid, width: 4) : BorderSide.none,
          bottom: !isTop ? const BorderSide(color: AppTheme.emeraldVivid, width: 4) : BorderSide.none,
          left: isLeft ? const BorderSide(color: AppTheme.emeraldVivid, width: 4) : BorderSide.none,
          right: !isLeft ? const BorderSide(color: AppTheme.emeraldVivid, width: 4) : BorderSide.none,
        ),
      ),
    );
  }

  // --- 14. OCR SCANNING ANIMATION ---
  Widget _buildProcessing() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'SwasthyaSaathi',
        subtitle: 'Screen 14 • Document Intelligence',
        showBack: false,
        action: StatusBadge.saffron(label: 'ANALYZING', dot: true),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Document scanning mock graphic
              Container(
                width: 200,
                height: 260,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight, width: 2),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 6)),
                  ],
                ),
                child: Stack(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(width: 80, height: 10, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(4))),
                          const SizedBox(height: 12),
                          Container(width: 140, height: 8, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(4))),
                          const SizedBox(height: 8),
                          Container(width: 110, height: 8, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(4))),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: AppTheme.emeraldLight, borderRadius: BorderRadius.circular(8)),
                            child: Text('✓ Avipattikar Churna 3g BD', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.primaryEmerald)),
                          ),
                        ],
                      ),
                    ),
                    AnimatedBuilder(
                      animation: _laserController,
                      builder: (ctx, child) {
                        return Positioned(
                          top: _laserController.value * 230,
                          left: 0,
                          right: 0,
                          child: Container(
                            height: 3,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(colors: [Colors.transparent, AppTheme.primaryEmerald, Colors.transparent]),
                              boxShadow: [
                                BoxShadow(color: AppTheme.primaryEmerald.withValues(alpha: 0.8), blurRadius: 10, spreadRadius: 1),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              Text('Analyzing Prescription...', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
              const SizedBox(height: 6),
              Text(
                'Extracting AYUSH formulations, dosages, and prescribing clinic details for physician review.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- 15. EXTRACTED DOCUMENT REVIEW ---
  Widget _buildExtractedReview() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppHeader(
        title: 'Review Prescription',
        subtitle: 'Screen 15 • Extracted Facts',
        onBack: () => setState(() => _phase = DocumentPhase.viewfinder),
        action: const StatusBadge.emerald(label: 'OCR READY', dot: true),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Prescribing Clinic Info
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('PRESCRIBING CLINIC', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.textTertiary)),
                    const SizedBox(height: 4),
                    Text('Shree Vishwakarma Ayurvedic Clinic, Pune', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                    const SizedBox(height: 2),
                    Text('Date: 18 August 2025 • Dr. R. K. Joshi (BAMS)', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textMuted)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              if (_extractedOcrText != null && _extractedOcrText!.isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('EXTRACTED OCR TEXT', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.textTertiary)),
                      const SizedBox(height: 4),
                      Text(_extractedOcrText!, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textDark, height: 1.3)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
              ],

              Text('IDENTIFIED MEDICATIONS (2)', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: const Color(0xFF475569))),
              const SizedBox(height: 8),

              Expanded(
                child: ListView(
                  children: [
                    _buildMedicineCard('Avipattikar Churna', 'Dosage: 3g twice daily before food with lukewarm water', 'Indications: Amlapitta (Hyperacidity)'),
                    const SizedBox(height: 10),
                    _buildMedicineCard('Sutshekhar Ras (Gold Coated)', 'Dosage: 1 tablet twice daily after meals', 'Indications: Pitta Samana & Burning sensation'),
                    const SizedBox(height: 16),

                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(color: AppTheme.saffronLight, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.saffronBorder)),
                      child: Text(
                        'Doctor Verification: Dr. Ayush Sharma will cross-examine these previous medications during your OPD consultation.',
                        style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF9A3412), height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),

              AppPrimaryButton(
                text: 'Confirm Medicines & Continue',
                icon: const Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                onPressed: () {
                  context.push('/review?token=${widget.token ?? ''}');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMedicineCard(String name, String dosage, String indication) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: GoogleFonts.plusJakartaSans(fontSize: 13.5, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
              Text('Edit', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.primarySaffron)),
            ],
          ),
          const SizedBox(height: 4),
          Text(dosage, style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
            child: Text(indication, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w600, color: const Color(0xFF475569))),
          ),
        ],
      ),
    );
  }

  // --- 23. MULTIPAGE DOCUMENT CAROUSEL (Screen 23) ---
  Widget _buildMultipage() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: AppHeader(
        title: 'Attached Documents (2)',
        subtitle: 'Screen 23 • Multi-page Scans',
        onBack: () => setState(() => _phase = DocumentPhase.viewfinder),
        action: TextButton.icon(
          onPressed: () => setState(() => _phase = DocumentPhase.viewfinder),
          icon: const Icon(Icons.add_rounded, size: 18, color: AppTheme.primarySaffron),
          label: Text('Add Page', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primarySaffron)),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Prescription & Lab Scans', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
              const SizedBox(height: 4),
              Text('Swipe or tap to review pages captured for Dr. Ayush Sharma.', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted)),
              const SizedBox(height: 20),

              // Page 1
              _buildPageCard('P1', 'Prescription Slip • Page 1', '✓ 2 Medicines Extracted', const Color(0xFFEFF6FF), const Color(0xFF2563EB)),
              const SizedBox(height: 12),

              // Page 2
              _buildPageCard('P2', 'Lab Report • Complete Blood Count', 'Uploaded from Gallery • 18 Aug 2025', const Color(0xFFF0FDF4), const Color(0xFF16A34A)),

              const Spacer(),

              AppPrimaryButton(
                text: 'Continue to Clinical Summary',
                icon: const Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                onPressed: () => setState(() => _phase = DocumentPhase.extractedReview),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPageCard(String badge, String title, String subtitle, Color badgeBg, Color badgeColor) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderLight)),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 52,
            decoration: BoxDecoration(color: badgeBg, borderRadius: BorderRadius.circular(12)),
            alignment: Alignment.center,
            child: Text(badge, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w800, color: badgeColor)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textDark)),
                const SizedBox(height: 2),
                Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.visibility_outlined, size: 20, color: AppTheme.textMuted),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, size: 20, color: AppTheme.errorRed),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  // --- 21. DOCUMENT PROCESSING FAILURE (Screen 21) ---
  Widget _buildFailure() {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'Capture Assistance',
        subtitle: 'Screen 21 • Quality Check',
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppTheme.horizontalPadding, vertical: 20),
          child: Column(
            children: [
              const Spacer(),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppTheme.errorLight,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.errorBorder),
                ),
                child: const Icon(Icons.warning_amber_rounded, size: 40, color: AppTheme.errorRed),
              ),
              const SizedBox(height: 20),
              Text(
                'Document Could Not Be Read',
                style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'पर्चे की लिखावट स्पष्ट नहीं है',
                style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppTheme.radiusCard),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Common reasons:', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textDark)),
                    const SizedBox(height: 10),
                    _buildFailureReasonRow('Photo was blurry or out of focus'),
                    const SizedBox(height: 6),
                    _buildFailureReasonRow('Glare from flash or harsh room light'),
                    const SizedBox(height: 6),
                    _buildFailureReasonRow('Document was partially folded or cropped'),
                  ],
                ),
              ),
              const Spacer(),
              AppPrimaryButton(
                text: 'Retake Photo / दोबारा फोटो लें',
                icon: const Icon(Icons.camera_alt_outlined, size: 18, color: Colors.white),
                onPressed: () {
                  setState(() => _phase = DocumentPhase.viewfinder);
                },
              ),
              const SizedBox(height: 12),
              AppSecondaryButton(
                text: 'Skip & hand physical paper to doctor',
                onPressed: () {
                  context.push('/review?token=${widget.token ?? ''}');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFailureReasonRow(String text) {
    return Row(
      children: [
        Container(width: 5, height: 5, decoration: const BoxDecoration(color: AppTheme.textMuted, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(text, style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textDark, fontWeight: FontWeight.w500)),
        ),
      ],
    );
  }
}
