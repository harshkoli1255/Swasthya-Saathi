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

class ConsentScreen extends ConsumerStatefulWidget {
  final String token;

  const ConsentScreen({super.key, required this.token});

  @override
  ConsumerState<ConsentScreen> createState() => _ConsentScreenState();
}

class _ConsentScreenState extends ConsumerState<ConsentScreen> {
  bool _voiceConsent = true;
  bool _ocrConsent = true;
  bool _ayushConsent = true;
  bool _isLoading = false;

  Future<void> _submitConsent() async {
    setState(() => _isLoading = true);
    final scopes = <String>[];
    if (_voiceConsent) scopes.add('voice_recording');
    if (_ocrConsent) scopes.add('document_ocr');
    if (_ayushConsent) scopes.add('ayush_markers');
    scopes.add('chief_complaint');

    try {
      final client = ref.read(apiClientProvider);
      await client.submitConsent(
        ConsentPayload(agreed: true, scope: scopes),
      );
      if (mounted) {
        context.go('/interview?token=${widget.token}');
      }
    } catch (e) {
      if (mounted) {
        // Safe navigation for local test/preview
        context.go('/interview?token=${widget.token}');
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
        title: 'Patient Privacy & Consent',
        onBack: () => context.pop(),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Privacy Badge
              Align(
                alignment: Alignment.centerLeft,
                child: const StatusBadge(
                  label: 'Patient Data Privacy Notice',
                  variant: BadgeVariant.emerald,
                  icon: Icon(Icons.shield_outlined, color: AppTheme.primaryEmerald, size: 14),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Your Health Data, Your Full Control',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 21,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'SwasthyaSaathi operates under Ministry of AYUSH & ABDM privacy guidelines. Choose your data permissions:',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView(
                  children: [
                    _buildPermissionCard(
                      title: 'Voice Intake & Audio Capture',
                      description: 'Record spoken symptoms in Hindi/English. Audio is used solely to generate your case sheet for today’s doctor visit.',
                      value: _voiceConsent,
                      onChanged: (v) => setState(() => _voiceConsent = v),
                    ),
                    const SizedBox(height: 12),
                    _buildPermissionCard(
                      title: 'Prescription OCR & Document Scan',
                      description: 'Extract medicine names and dosages from past paper slips for physician review.',
                      value: _ocrConsent,
                      onChanged: (v) => setState(() => _ocrConsent = v),
                    ),
                    const SizedBox(height: 12),
                    _buildPermissionCard(
                      title: 'AYUSH Prakriti & Agni Markers',
                      description: 'Record constitutional markers exclusively for your consulting Ayurvedic physician.',
                      value: _ayushConsent,
                      onChanged: (v) => setState(() => _ayushConsent = v),
                    ),
                    const SizedBox(height: 16),

                    // Legal Boundary Statement
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.borderLight),
                      ),
                      child: Text(
                        'Clinical Boundaries: SwasthyaSaathi uses AI solely to transcribe and organize patient statements. AI does not diagnose, prescribe, or replace certified clinical decision-making.',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF475569),
                          height: 1.45,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              AppPrimaryButton(
                text: 'I Agree & Continue to Intake',
                isLoading: _isLoading,
                icon: const Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                onPressed: _submitConsent,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermissionCard({
    required String title,
    required String description,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textDark,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Switch(
                value: value,
                activeThumbColor: AppTheme.primaryEmerald,
                onChanged: onChanged,
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              color: AppTheme.textMuted,
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }
}
