import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_header.dart';
import '../../../../shared/widgets/status_badge.dart';

// --- Screen 18: NETWORK OFFLINE STATE ---
class OfflineStateScreen extends StatelessWidget {
  final VoidCallback onRetry;

  const OfflineStateScreen({super.key, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'Offline Intake Mode',
        subtitle: 'Screen 18 • Local Secure Storage',
        showBack: false,
        action: StatusBadge.amber(label: 'Offline', dot: true),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Offline banner
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFDE68A)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.wifi_off_rounded, color: Color(0xFFD97706), size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Hospital Wi-Fi Disconnected • Operating in Offline Mode',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF92400E),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFFEE2E2)),
                  ),
                  child: const Icon(Icons.dns_outlined, color: AppTheme.errorRed, size: 40),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'You’re Offline, But Your Intake Is Safe',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 21,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'SwasthyaSaathi stores your case details locally on your device. Your data will auto-sync once clinic network reconnects.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                  height: 1.45,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              // Local Cached Token
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.darkSlate,
                  borderRadius: BorderRadius.circular(28),
                ),
                child: Column(
                  children: [
                    Text(
                      'OFFLINE HOSPITAL TOKEN',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF94A3B8),
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'OPD • A42',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: const Color(0xFFF97316),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Room 104 • Dr. Ayush Sharma',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: const Color(0xFFCBD5E1),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.check_circle_rounded, color: AppTheme.primaryEmerald, size: 14),
                        const SizedBox(width: 6),
                        Text(
                          'Valid for physical queue check-in',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.emeraldVivid,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              AppPrimaryButton(
                text: 'Retry Network Connection',
                icon: const Icon(Icons.refresh_rounded, size: 18, color: Colors.white),
                onPressed: onRetry,
              ),
              const SizedBox(height: 10),
              Center(
                child: Text(
                  'Show Token to OPD Reception Desk',
                  style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- Screen 20: MICROPHONE PERMISSION DENIED ---
class MicrophonePermissionDeniedScreen extends StatelessWidget {
  final VoidCallback onOpenSettings;
  final VoidCallback onSwitchToTyping;

  const MicrophonePermissionDeniedScreen({
    super.key,
    required this.onOpenSettings,
    required this.onSwitchToTyping,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'Microphone Permission',
        subtitle: 'Screen 20 • Audio Intake',
        showBack: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppTheme.horizontalPadding, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.errorLight,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.errorBorder),
                  ),
                  child: const Icon(Icons.mic_off_rounded, color: AppTheme.errorRed, size: 40),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Microphone Access Required',
                style: GoogleFonts.plusJakartaSans(fontSize: 21, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'Needed for Hindi/English voice symptom intake. You can enable it in Android Settings or switch to text typing.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.45),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('How to enable in Android:', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textDark)),
                    const SizedBox(height: 10),
                    _buildStepRow('1', 'Open Android Settings > Apps > SwasthyaSaathi'),
                    const SizedBox(height: 8),
                    _buildStepRow('2', 'Tap Permissions > Microphone'),
                    const SizedBox(height: 8),
                    _buildStepRow('3', 'Select "Allow only while using the app"'),
                  ],
                ),
              ),
              const Spacer(),
              AppPrimaryButton(
                text: 'Open Android App Settings',
                icon: const Icon(Icons.settings_outlined, size: 18, color: Colors.white),
                onPressed: onOpenSettings,
              ),
              const SizedBox(height: 12),
              AppSecondaryButton(
                text: 'Switch to Typing Mode Instead',
                onPressed: onSwitchToTyping,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepRow(String number, String text) {
    return Row(
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(6)),
          alignment: Alignment.center,
          child: Text(number, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: const Color(0xFF475569))),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(text, style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textDark, fontWeight: FontWeight.w500)),
        ),
      ],
    );
  }
}

// --- Screen 22: CAMERA UNAVAILABLE STATE ---
class CameraUnavailableScreen extends StatelessWidget {
  final VoidCallback onPickGallery;
  final VoidCallback onSkip;

  const CameraUnavailableScreen({
    super.key,
    required this.onPickGallery,
    required this.onSkip,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'Camera Device Check',
        subtitle: 'Screen 22 • Hardware Status',
        showBack: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppTheme.horizontalPadding, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.errorLight,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.errorBorder),
                  ),
                  child: const Icon(Icons.no_photography_outlined, color: AppTheme.errorRed, size: 40),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Camera Hardware Unavailable',
                style: GoogleFonts.plusJakartaSans(fontSize: 21, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'The camera could not be initialized. You can choose an existing photo from your gallery or skip document attachment.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.45),
                textAlign: TextAlign.center,
              ),
              const Spacer(),
              AppPrimaryButton(
                text: 'Choose Photo from Gallery',
                icon: const Icon(Icons.photo_library_outlined, size: 18, color: Colors.white),
                onPressed: onPickGallery,
              ),
              const SizedBox(height: 12),
              AppSecondaryButton(
                text: 'Skip Document Step',
                onPressed: onSkip,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- Screen 24: EMPTY HEALTH RECORDS STATE ---
class EmptyHealthRecordsScreen extends StatelessWidget {
  final VoidCallback onScanPaper;
  final VoidCallback onStartFresh;

  const EmptyHealthRecordsScreen({
    super.key,
    required this.onScanPaper,
    required this.onStartFresh,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'Medical History Records',
        subtitle: 'Screen 24 • ABHA Health Records',
        showBack: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),

              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFDBEAFE)),
                  ),
                  child: const Icon(Icons.folder_open_rounded, color: Color(0xFF2563EB), size: 40),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'No Prior Digital Records Found',
                style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'This is your first visit linked with your ABHA ID, or previous clinics haven’t published digital records yet.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.45),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('You can still provide past context:', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textDark)),
                    const SizedBox(height: 6),
                    Text('• Photograph your paper prescription slips', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
                    const SizedBox(height: 3),
                    Text('• Speak your ongoing medications directly to AI intake', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
                  ],
                ),
              ),

              const Spacer(),

              AppPrimaryButton(
                text: 'Scan Paper Prescriptions',
                icon: const Icon(Icons.camera_alt_outlined, size: 18, color: Colors.white),
                onPressed: onScanPaper,
              ),
              const SizedBox(height: 12),
              AppSecondaryButton(
                text: 'Start Fresh Intake with Symptoms',
                onPressed: onStartFresh,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- DIALOGS & BOTTOM SHEETS HELPERS ---
class SystemStateModals {
  // Screen 19: Session Inactivity / Lock State Dialog
  static Future<void> showSessionExpiredDialog(BuildContext context, VoidCallback onUnlock) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        contentPadding: const EdgeInsets.all(24),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppTheme.saffronLight,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.saffronBorder),
              ),
              child: const Icon(Icons.lock_clock_outlined, color: AppTheme.primarySaffron, size: 28),
            ),
            const SizedBox(height: 16),
            Text('Session Paused for Privacy', style: GoogleFonts.plusJakartaSans(fontSize: 17, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
            const SizedBox(height: 6),
            Text(
              'To protect your medical records in a public hospital lobby, sessions lock after 10 minutes of inactivity.',
              style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted, height: 1.4),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            AppPrimaryButton(
              text: 'Unlock Session',
              onPressed: () {
                Navigator.pop(ctx);
                onUnlock();
              },
            ),
          ],
        ),
      ),
    );
  }

  // Screen 25: Exit Confirmation Bottom Sheet
  static Future<bool?> showExitConfirmationSheet(BuildContext context) {
    return showModalBottomSheet<bool>(
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
                  decoration: BoxDecoration(color: AppTheme.saffronLight, borderRadius: BorderRadius.circular(14)),
                  child: const Icon(Icons.pause_circle_outline_rounded, color: AppTheme.primarySaffron, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Pause Symptom Intake?', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w800)),
                      Text('Your progress up to Question 2 is saved as a draft.', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            AppPrimaryButton(
              text: 'Continue Answering (Keep Going)',
              onPressed: () => Navigator.pop(ctx, false),
            ),
            const SizedBox(height: 10),
            AppSecondaryButton(
              text: 'Save Draft & Return to Home',
              onPressed: () => Navigator.pop(ctx, true),
            ),
          ],
        ),
      ),
    );
  }
}
