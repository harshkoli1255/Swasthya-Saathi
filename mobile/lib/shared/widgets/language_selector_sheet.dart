import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import 'app_button.dart';

class LanguageSelectorBottomSheet extends StatefulWidget {
  final String currentLanguage;
  final ValueChanged<String> onLanguageSelected;

  const LanguageSelectorBottomSheet({
    super.key,
    required this.currentLanguage,
    required this.onLanguageSelected,
  });

  static Future<String?> show(BuildContext context, String currentLanguage) {
    return showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => LanguageSelectorBottomSheet(
        currentLanguage: currentLanguage,
        onLanguageSelected: (lang) => Navigator.pop(ctx, lang),
      ),
    );
  }

  @override
  State<LanguageSelectorBottomSheet> createState() => _LanguageSelectorBottomSheetState();
}

class _LanguageSelectorBottomSheetState extends State<LanguageSelectorBottomSheet> {
  late String _selected;

  final List<Map<String, String>> _languages = [
    {
      'code': 'en',
      'label': 'English',
      'badge': 'EN',
      'subtitle': 'Standard Clinical Terminology',
    },
    {
      'code': 'hi',
      'label': 'हिन्दी (Hindi)',
      'badge': 'हि',
      'subtitle': 'नमस्ते! अपनी समस्या बोलकर बताएं',
    },
    {
      'code': 'mr',
      'label': 'मराठी (Marathi)',
      'badge': 'म',
      'subtitle': 'नमस्कार! आपली तक्रार सांगा',
    },
    {
      'code': 'gu',
      'label': 'ગુજરાતી (Gujarati)',
      'badge': 'ગુ',
      'subtitle': 'નમસ્તે! તમારી તકલીફ જણાવો',
    },
  ];

  @override
  void initState() {
    super.initState();
    _selected = widget.currentLanguage;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 30,
            offset: Offset(0, -6),
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 48,
              height: 5,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              const Icon(Icons.language_rounded, color: AppTheme.primarySaffron, size: 22),
              const SizedBox(width: 8),
              Text(
                'Choose Language / भाषा चुनें',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'You can speak or type in any language during your clinical intake.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 18),
          ..._languages.map((lang) {
            final isSelected = _selected == lang['code'];
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: InkWell(
                onTap: () {
                  setState(() {
                    _selected = lang['code']!;
                  });
                },
                borderRadius: BorderRadius.circular(18),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isSelected ? AppTheme.emeraldLight : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: isSelected ? AppTheme.primaryEmerald : AppTheme.borderLight,
                      width: isSelected ? 2.0 : 1.0,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: isSelected ? AppTheme.primaryEmerald : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: isSelected ? null : Border.all(color: AppTheme.borderLight),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          lang['badge']!,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: isSelected ? Colors.white : AppTheme.textDark,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              lang['label']!,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.textDark,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              lang['subtitle']!,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                                color: isSelected ? AppTheme.primaryEmerald : AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isSelected)
                        const Icon(
                          Icons.check_circle_rounded,
                          color: AppTheme.primaryEmerald,
                          size: 22,
                        ),
                    ],
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 10),
          AppPrimaryButton(
            text: 'Confirm Language / भाषा सुनिश्चित करें',
            onPressed: () {
              widget.onLanguageSelected(_selected);
            },
          ),
        ],
      ),
    );
  }
}
