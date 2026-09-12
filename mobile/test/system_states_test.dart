import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swasthyasaathi_patient/features/system/presentation/screens/system_states_screens.dart';
import 'package:swasthyasaathi_patient/features/completion/presentation/screens/pharmacy_token_screen.dart';

void main() {
  group('System States and Edge Case Screens', () {
    testWidgets('OfflineStateScreen renders offline banner and retry CTA', (tester) async {
      bool retried = false;
      await tester.pumpWidget(
        MaterialApp(
          home: OfflineStateScreen(onRetry: () => retried = true),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Offline Intake Mode'), findsOneWidget);
      expect(find.text('You’re Offline, But Your Intake Is Safe'), findsOneWidget);
      expect(find.text('Retry Network Connection'), findsOneWidget);

      await tester.tap(find.text('Retry Network Connection'));
      expect(retried, isTrue);
    });

    testWidgets('MicrophonePermissionDeniedScreen renders guidance and settings button', (tester) async {
      bool opened = false;
      bool switched = false;
      await tester.pumpWidget(
        MaterialApp(
          home: MicrophonePermissionDeniedScreen(
            onOpenSettings: () => opened = true,
            onSwitchToTyping: () => switched = true,
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Microphone Access Required'), findsOneWidget);
      expect(find.text('Open Android App Settings'), findsOneWidget);
      expect(find.text('Switch to Typing Mode Instead'), findsOneWidget);

      await tester.tap(find.text('Open Android App Settings'));
      expect(opened, isTrue);

      await tester.tap(find.text('Switch to Typing Mode Instead'));
      expect(switched, isTrue);
    });

    testWidgets('CameraUnavailableScreen renders gallery and skip options', (tester) async {
      bool picked = false;
      bool skipped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: CameraUnavailableScreen(
            onPickGallery: () => picked = true,
            onSkip: () => skipped = true,
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Camera Hardware Unavailable'), findsOneWidget);
      expect(find.text('Choose Photo from Gallery'), findsOneWidget);
      expect(find.text('Skip Document Step'), findsOneWidget);

      await tester.tap(find.text('Choose Photo from Gallery'));
      expect(picked, isTrue);

      await tester.tap(find.text('Skip Document Step'));
      expect(skipped, isTrue);
    });

    testWidgets('EmptyHealthRecordsScreen renders guidance and action CTAs', (tester) async {
      bool scanned = false;
      bool started = false;
      await tester.pumpWidget(
        MaterialApp(
          home: EmptyHealthRecordsScreen(
            onScanPaper: () => scanned = true,
            onStartFresh: () => started = true,
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('No Prior Digital Records Found'), findsOneWidget);
      expect(find.text('Scan Paper Prescriptions'), findsOneWidget);
      expect(find.text('Start Fresh Intake with Symptoms'), findsOneWidget);

      await tester.tap(find.text('Scan Paper Prescriptions'));
      expect(scanned, isTrue);

      await tester.tap(find.text('Start Fresh Intake with Symptoms'));
      expect(started, isTrue);
    });

    testWidgets('PharmacyTokenScreen renders dispensary token and medication checklist', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: PharmacyTokenScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('AYUSH DISPENSARY TOKEN'), findsOneWidget);
      expect(find.text('PHARMACY • P18'), findsOneWidget);
      expect(find.text('Avipattikar Churna (50g jar)'), findsOneWidget);
      expect(find.text('Sutshekhar Ras (30 tablets)'), findsOneWidget);
    });
  });
}
