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
import '../../../../shared/widgets/boarding_pass_card.dart';

class CompletionScreen extends ConsumerStatefulWidget {
  final String? token;
  final String? opdId;

  const CompletionScreen({super.key, this.token, this.opdId});

  @override
  ConsumerState<CompletionScreen> createState() => _CompletionScreenState();
}

class _CompletionScreenState extends ConsumerState<CompletionScreen> {
  SessionStatus? _status;
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    _fetchQueueStatus();
  }

  Future<void> _fetchQueueStatus() async {
    final token = widget.token ?? '';
    if (token.isEmpty) return;
    setState(() => _isRefreshing = true);
    try {
      final client = ref.read(apiClientProvider);
      final status = await client.getSessionStatus(token);
      if (mounted) {
        setState(() {
          _status = status;
        });
      }
    } catch (_) {
      // Keep existing displayed state
    } finally {
      if (mounted) {
        setState(() => _isRefreshing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final effectiveOpd = _status?.opdId ?? widget.opdId;
    final displayToken = (effectiveOpd != null && effectiveOpd.isNotEmpty)
        ? effectiveOpd.replaceAll('OPD-DEMO-', 'OPD • ').replaceAll('OPD-', 'OPD • ')
        : 'OPD • A42';

    final callingToken = _status?.callingToken ?? 'Token A-39';
    final queueAhead = _status?.queueAhead != null
        ? '${_status!.queueAhead} ahead'
        : '3 ahead';
    final estWait = _status?.estimatedWaitMinutes != null
        ? '~${_status!.estimatedWaitMinutes} mins'
        : '~12–15 mins';

    return Scaffold(
      backgroundColor: AppTheme.surfaceBackground,
      appBar: const AppHeader(
        title: 'Intake Submitted',
        subtitle: 'Screen 17 • Live OPD Queue',
        showBack: false,
        action: StatusBadge.emerald(label: 'Active', dot: true),
      ),
      body: SafeArea(
        child: Column(
          children: [
            if (_isRefreshing)
              const LinearProgressIndicator(
                minHeight: 2,
                color: AppTheme.primaryEmerald,
                backgroundColor: Colors.transparent,
              ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: _fetchQueueStatus,
                color: AppTheme.primaryEmerald,
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: AppTheme.horizontalPadding, vertical: 20),
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
              // Architectural Dark Boarding Pass Card
              ArchitecturalBoardingPassCard(
                title: 'Official OPD Token',
                tokenCode: displayToken,
                department: 'General AYUSH & Kayachikitsa Dept',
                callingToken: callingToken,
                queueAhead: queueAhead,
                estWait: estWait,
              ),
              const SizedBox(height: 16),

              // Doctor Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppTheme.emeraldLight,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'DA',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.primaryEmerald,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Dr. Ayush Sharma, MD (Ayu)',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Senior Consulting Physician • Room 104',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              color: AppTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: const BoxDecoration(
                                  color: AppTheme.primaryEmerald,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Active in Consultation',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.primaryEmerald,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Consultation Progress Stepper
              Text(
                'CONSULTATION PROGRESS',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.5,
                  color: const Color(0xFF475569),
                ),
              ),
              const SizedBox(height: 10),

              _buildStepRow(
                icon: Icons.check_circle_rounded,
                iconColor: AppTheme.primaryEmerald,
                title: 'Case Intake Submitted & Linked',
                isCurrent: false,
              ),
              const SizedBox(height: 8),
              _buildStepRow(
                icon: Icons.radio_button_checked_rounded,
                iconColor: AppTheme.primarySaffron,
                title: 'Waiting in Room 104 Outer Lobby (Now)',
                isCurrent: true,
              ),
              const SizedBox(height: 8),
              _buildStepRow(
                icon: Icons.circle_outlined,
                iconColor: AppTheme.textTertiary,
                title: 'Pulse & Tongue Clinical Examination',
                isCurrent: false,
                isPending: true,
              ),
              const SizedBox(height: 8),
              _buildStepRow(
                icon: Icons.circle_outlined,
                iconColor: AppTheme.textTertiary,
                title: 'Doctor Examination & Final Prescription',
                isCurrent: false,
                isPending: true,
              ),

              const SizedBox(height: 28),

              Column(
                children: [
                  AppPrimaryButton(
                    text: 'Save Token to Device',
                    icon: const Icon(Icons.bookmark_outline_rounded, color: Colors.white, size: 18),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('OPD Token $displayToken saved to device!'),
                          backgroundColor: AppTheme.primaryEmerald,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 10),
                  AppSecondaryButton(
                    text: 'View Case Summary',
                    icon: const Icon(Icons.description_outlined, size: 18),
                    onPressed: () {
                      context.push('/review?token=${widget.token ?? ''}');
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepRow({
    required IconData icon,
    required Color iconColor,
    required String title,
    required bool isCurrent,
    bool isPending = false,
  }) {
    return Row(
      children: [
        Icon(icon, color: iconColor, size: 18),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12.5,
              fontWeight: isCurrent ? FontWeight.w800 : (isPending ? FontWeight.w500 : FontWeight.w700),
              color: isCurrent ? AppTheme.primarySaffron : (isPending ? AppTheme.textTertiary : AppTheme.textDark),
            ),
          ),
        ),
      ],
    );
  }
}
