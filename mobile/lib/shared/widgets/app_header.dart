import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';

class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? leading;
  final Widget? trailing;
  final bool showBackButton;
  final Color backgroundColor;

  const AppHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.leading,
    Widget? trailing,
    Widget? action,
    bool? showBack,
    bool showBackButton = true,
    this.backgroundColor = Colors.white,
  })  : trailing = action ?? trailing,
        showBackButton = showBack ?? showBackButton;

  @override
  Size get preferredSize => const Size.fromHeight(60.0);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: backgroundColor,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: true,
      leading: leading ??
          (showBackButton
              ? IconButton(
                  icon: const Icon(Icons.arrow_back_rounded, color: AppTheme.textDark),
                  onPressed: onBack ?? () => Navigator.of(context).maybePop(),
                  tooltip: 'Back',
                )
              : null),
      title: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.2,
              color: AppTheme.textDark,
            ),
          ),
          if (subtitle != null && subtitle!.isNotEmpty) ...[
            const SizedBox(height: 1),
            Text(
              subtitle!,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 10.5,
                fontWeight: FontWeight.w500,
                color: AppTheme.textMuted,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ],
      ),
      actions: trailing != null
          ? [
              Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Center(child: trailing!),
              ),
            ]
          : null,
    );
  }
}
