import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryGreen = Color(0xFF2E5E4E); // Forest Sage Green from web
  static const Color secondaryGreen = Color(0xFFE8F0ED);
  static const Color accentOrange = Color(0xFFD97706);
  static const Color errorRed = Color(0xFFDC2626);
  static const Color surfaceWhite = Colors.white;
  static const Color textDark = Color(0xFF1F2937);
  static const Color textLight = Color(0xFF6B7280);

  static ThemeData get lightTheme {
    return ThemeData(
      colorScheme: ColorScheme.light(
        primary: primaryGreen,
        secondary: secondaryGreen,
        error: errorRed,
        surface: surfaceWhite,
        onPrimary: surfaceWhite,
        onSecondary: textDark,
        onSurface: textDark,
        onError: surfaceWhite,
      ),
      scaffoldBackgroundColor: const Color(0xFFF9FAFB),
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryGreen,
        foregroundColor: surfaceWhite,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGreen,
          foregroundColor: surfaceWhite,
          minimumSize: const Size.fromHeight(56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryGreen,
          side: const BorderSide(color: primaryGreen, width: 2),
          minimumSize: const Size.fromHeight(56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceWhite,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryGreen, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      cardTheme: CardThemeData(
        color: surfaceWhite,
        elevation: 2,
        shadowColor: Colors.black.withValues(alpha: 0.05),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        margin: const EdgeInsets.symmetric(vertical: 8),
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textDark, fontSize: 32, fontWeight: FontWeight.bold),
        titleLarge: TextStyle(color: textDark, fontSize: 24, fontWeight: FontWeight.bold),
        titleMedium: TextStyle(color: textDark, fontSize: 18, fontWeight: FontWeight.w600),
        bodyLarge: TextStyle(color: textDark, fontSize: 16),
        bodyMedium: TextStyle(color: textLight, fontSize: 14),
      ),
    );
  }
}
