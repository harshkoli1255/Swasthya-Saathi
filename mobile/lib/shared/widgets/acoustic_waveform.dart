import 'dart:math';
import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AcousticWaveformOrb extends StatefulWidget {
  final bool isListening;

  const AcousticWaveformOrb({super.key, this.isListening = true});

  @override
  State<AcousticWaveformOrb> createState() => _AcousticWaveformOrbState();
}

class _AcousticWaveformOrbState extends State<AcousticWaveformOrb>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  // Base heights for 21 harmonic bars matching approved Flowstep Screen 08
  final List<double> _baseHeights = [
    16, 28, 48, 24, 56, 36, 64, 44, 28, 64, 40,
    56, 32, 60, 36, 48, 24, 52, 32, 40, 20
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return SizedBox(
          height: 80,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: List.generate(_baseHeights.length, (index) {
              final baseH = _baseHeights[index];
              final wave = sin((_controller.value * 2 * pi) + (index * 0.35));
              final dynamicH = widget.isListening
                  ? (baseH * 0.65) + (baseH * 0.35 * wave.abs())
                  : baseH * 0.4;

              final isCenterPeak = index >= 6 && index <= 14;

              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 2.2),
                width: 5.5,
                height: dynamicH.clamp(12.0, 70.0),
                decoration: BoxDecoration(
                  color: AppTheme.primarySaffron.withValues(
                    alpha: isCenterPeak ? 1.0 : 0.75,
                  ),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: isCenterPeak
                      ? [
                          BoxShadow(
                            color: AppTheme.primarySaffron.withValues(alpha: 0.4),
                            blurRadius: 8,
                            spreadRadius: 0.5,
                          ),
                        ]
                      : null,
                ),
              );
            }),
          ),
        );
      },
    );
  }
}
