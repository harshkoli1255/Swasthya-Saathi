import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: SwasthyaSaathiApp()));
    await tester.pumpAndSettle();
    expect(find.text('Welcome'), findsNWidgets(2));
  });
}
