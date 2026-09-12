import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/status_badge.dart';
import '../../../../shared/widgets/language_selector_sheet.dart';

class WelcomeScreen extends ConsumerStatefulWidget {
  const WelcomeScreen({super.key});

  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  String _selectedLanguage = 'hi';
  bool _isLoading = false;

  Future<void> _startIntake() async {
    setState(() => _isLoading = true);
    try {
      final client = ref.read(apiClientProvider);
      final result = await client.createDemoSession();
      final token = (result['token'] ?? result['public_token']) as String;
      if (mounted) {
        context.go('/consent?token=$token');
      }
    } catch (e) {
      if (mounted) {
        // Fallback for offline or local preview
        context.go('/consent?token=demo-preview');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _openLanguageSheet() async {
    final chosen = await LanguageSelectorBottomSheet.show(context, _selectedLanguage);
    if (chosen != null && mounted) {
      setState(() {
        _selectedLanguage = chosen;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    AppTheme.setSystemOverlay();

    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight - 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Top Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppTheme.darkSlate,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'SS',
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'SwasthyaSaathi',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                              letterSpacing: -0.2,
                            ),
                          ),
                          Text(
                            'AYUSH Clinical OPD',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  // Language Switcher Pill
                  InkWell(
                    onTap: _openLanguageSheet,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.borderLight),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.04),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.language_rounded, size: 14, color: AppTheme.textMuted),
                          const SizedBox(width: 6),
                          Text(
                            _selectedLanguage == 'hi' ? 'हिन्दी / EN' : 'English / हि',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textDark,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.keyboard_arrow_down_rounded, size: 14, color: AppTheme.textTertiary),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              // Hero Section
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Verification Badge
                  const StatusBadge(
                    label: 'Ministry of AYUSH • Pre-Consultation Intake',
                    variant: BadgeVariant.emerald,
                    showDot: true,
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'Private clinical intake,\nbefore you meet your\ndoctor.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 27,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textDark,
                      letterSpacing: -0.6,
                      height: 1.22,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Speak or type your symptoms in your preferred language. Your physician reviews this summary when your token is called.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w400,
                      color: AppTheme.textMuted,
                      height: 1.45,
                    ),
                  ),
                ],
              ),

              // Action Buttons
              Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  AppPrimaryButton(
                    text: 'Scan Clinic QR Code to Begin',
                    icon: const Icon(Icons.qr_code_scanner_rounded, size: 20, color: Colors.white),
                    isLoading: _isLoading,
                    onPressed: _startIntake,
                  ),
                  const SizedBox(height: 12),
                  AppSecondaryButton(
                    text: 'Check in with 14-Digit ABHA ID',
                    icon: const Icon(Icons.badge_outlined, size: 18, color: AppTheme.textDark),
                    onPressed: () {
                      context.push('/abha/input');
                    },
                  ),
                  const SizedBox(height: 12),
                  Center(
                    child: TextButton(
                      onPressed: _startIntake,
                      child: Text(
                        'Walk-in patient without ABHA? Continue as Guest →',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // Trust Strip
              Padding(
                padding: const EdgeInsets.only(top: 12.0, bottom: 4.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock_outline_rounded, size: 13, color: AppTheme.primaryEmerald),
                        const SizedBox(width: 5),
                        Text(
                          'Encrypted • Local Hospital Session',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'AI assists. Physician decides.',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textDark,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    },
  ),
),
);
  }
}
