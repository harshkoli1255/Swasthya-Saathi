import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';

enum AlertBannerVariant { warning, error, info }

class AlertBanner extends StatelessWidget {
  final String title;
  final String? description;
  final IconData icon;
  final AlertBannerVariant variant;
  final Widget? action;

  const AlertBanner({
    super.key,
    required this.title,
    this.description,
    required this.icon,
    this.variant = AlertBannerVariant.warning,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color border;
    Color iconColor;
    Color titleColor;
    Color descColor;

    switch (variant) {
      case AlertBannerVariant.warning:
        bg = AppTheme.warningLight;
        border = AppTheme.warningBorder;
        iconColor = AppTheme.warningAmber;
        titleColor = AppTheme.warningText;
        descColor = const Color(0xFF78350F);
        break;
      case AlertBannerVariant.error:
        bg = AppTheme.errorLight;
        border = AppTheme.errorBorder;
        iconColor = AppTheme.errorRed;
        titleColor = AppTheme.errorRed;
        descColor = const Color(0xFF991B1B);
        break;
      case AlertBannerVariant.info:
        bg = AppTheme.infoLight;
        border = AppTheme.infoBorder;
        iconColor = AppTheme.infoBlue;
        titleColor = AppTheme.infoBlue;
        descColor = const Color(0xFF1E40AF);
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppTheme.radiusButton),
        border: Border.all(color: border, width: 1.0),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: titleColor,
                  ),
                ),
                if (description != null && description!.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Text(
                    description!,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w500,
                      color: descColor,
                      height: 1.4,
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (action != null) ...[
            const SizedBox(width: 8),
            action!,
          ],
        ],
      ),
    );
  }
}
