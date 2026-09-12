import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/main.dart';

void main() {
  testWidgets('App smoke test - Flowstep Welcome Screen renders', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: SwasthyaSaathiApp()));
    await tester.pumpAndSettle();
    expect(find.text('SwasthyaSaathi'), findsOneWidget);
    expect(find.text('Scan Clinic QR Code to Begin'), findsOneWidget);
    expect(find.text('Check in with 14-Digit ABHA ID'), findsOneWidget);
  });
}
