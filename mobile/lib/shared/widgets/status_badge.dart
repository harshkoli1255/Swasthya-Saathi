import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';

enum BadgeVariant { emerald, saffron, amber, blue, red, slate }

class StatusBadge extends StatelessWidget {
  final String label;
  final BadgeVariant variant;
  final Widget? icon;
  final bool showDot;

  const StatusBadge({
    super.key,
    required this.label,
    this.variant = BadgeVariant.emerald,
    this.icon,
    this.showDot = false,
  });

  const StatusBadge.emerald({
    super.key,
    required this.label,
    this.icon,
    bool dot = false,
  })  : variant = BadgeVariant.emerald,
        showDot = dot;

  const StatusBadge.saffron({
    super.key,
    required this.label,
    this.icon,
    bool dot = false,
  })  : variant = BadgeVariant.saffron,
        showDot = dot;

  const StatusBadge.amber({
    super.key,
    required this.label,
    this.icon,
    bool dot = false,
  })  : variant = BadgeVariant.amber,
        showDot = dot;

  const StatusBadge.blue({
    super.key,
    required this.label,
    this.icon,
    bool dot = false,
  })  : variant = BadgeVariant.blue,
        showDot = dot;

  const StatusBadge.red({
    super.key,
    required this.label,
    this.icon,
    bool dot = false,
  })  : variant = BadgeVariant.red,
        showDot = dot;

  const StatusBadge.slate({
    super.key,
    required this.label,
    this.icon,
    bool dot = false,
  })  : variant = BadgeVariant.slate,
        showDot = dot;

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color border;
    Color text;
    Color dotColor;

    switch (variant) {
      case BadgeVariant.emerald:
        bg = AppTheme.emeraldLight;
        border = AppTheme.emeraldBorder;
        text = AppTheme.primaryEmerald;
        dotColor = AppTheme.primaryEmerald;
        break;
      case BadgeVariant.saffron:
        bg = AppTheme.saffronLight;
        border = AppTheme.saffronBorder;
        text = AppTheme.primarySaffron;
        dotColor = AppTheme.primarySaffron;
        break;
      case BadgeVariant.amber:
        bg = AppTheme.warningLight;
        border = AppTheme.warningBorder;
        text = AppTheme.warningText;
        dotColor = AppTheme.warningAmber;
        break;
      case BadgeVariant.blue:
        bg = AppTheme.infoLight;
        border = AppTheme.infoBorder;
        text = AppTheme.infoBlue;
        dotColor = AppTheme.infoBlue;
        break;
      case BadgeVariant.red:
        bg = AppTheme.errorLight;
        border = AppTheme.errorBorder;
        text = AppTheme.errorRed;
        dotColor = AppTheme.errorRed;
        break;
      case BadgeVariant.slate:
        bg = AppTheme.surfaceWhite;
        border = AppTheme.borderLight;
        text = AppTheme.textDark;
        dotColor = AppTheme.textMuted;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: border, width: 1.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDot) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: dotColor,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
          ],
          if (icon != null) ...[
            icon!,
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: text,
              letterSpacing: -0.1,
            ),
          ),
        ],
      ),
    );
  }
}
