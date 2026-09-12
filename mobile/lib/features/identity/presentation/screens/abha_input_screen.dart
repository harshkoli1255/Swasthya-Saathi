import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_header.dart';
import '../../../../shared/widgets/status_badge.dart';

class AbhaInputScreen extends ConsumerStatefulWidget {
  const AbhaInputScreen({super.key});

  @override
  ConsumerState<AbhaInputScreen> createState() => _AbhaInputScreenState();
}

class _AbhaInputScreenState extends ConsumerState<AbhaInputScreen> {
  final TextEditingController _abhaController = TextEditingController(text: '91-4829-1029-4820');
  bool _isLoading = false;

  Future<void> _sendOtp() async {
    setState(() => _isLoading = true);
    try {
      final client = ref.read(apiClientProvider);
      // Ensure we have an active session token, or create demo session
      final sessionRes = await client.createDemoSession();
      final token = (sessionRes['token'] ?? sessionRes['public_token']) as String;

      final otpRes = await client.requestAbdmOtp(
        identifier: _abhaController.text.trim(),
        authMode: "MOBILE_OTP",
      );

      if (mounted) {
        context.push(
          '/abha/otp?token=$token&txnId=${otpRes.txnId ?? 'mock-txn'}&id=${_abhaController.text.trim()}',
        );
      }
    } catch (e) {
      if (mounted) {
        // Safe mock transition for testing
        context.push('/abha/otp?token=demo-preview&txnId=mock-txn&id=${_abhaController.text.trim()}');
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
        title: 'IDENTITY LINKAGE',
        trailing: const StatusBadge(
          label: 'Step 1 of 3',
          variant: BadgeVariant.emerald,
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
                'Link your ABHA Health ID',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'अपनी 14-अंकों की आभा आईडी या आधार नंबर दर्ज करें',
                style: GoogleFonts.notoSansDevanagari(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                ),
              ),
              const SizedBox(height: 18),

              // Honest Sandbox Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppTheme.emeraldLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.emeraldBorder),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.verified_user_outlined, color: AppTheme.primaryEmerald, size: 18),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'ABDM Mock Sandbox (Local Development) Active',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primaryEmerald,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text(
                '14-Digit ABHA Number',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.primarySaffron, width: 2),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
                child: TextField(
                  controller: _abhaController,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: AppTheme.textDark,
                  ),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: '91-XXXX-XXXX-XXXX',
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'You will receive an OTP on your linked phone',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                ),
              ),

              const Spacer(),

              AppPrimaryButton(
                text: 'Send Verification OTP →',
                isLoading: _isLoading,
                onPressed: _sendOtp,
              ),
              const SizedBox(height: 12),
              Center(
                child: TextButton(
                  onPressed: () => context.go('/consent?token=demo-guest'),
                  child: Text(
                    'Skip for now • Continue as Walk-in Guest →',
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
        ),
      ),
    );
  }
}
