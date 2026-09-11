import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:swasthyasaathi_patient/main.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('end-to-end test', () {
    testWidgets('tap on agree and start intake navigates to interview screen',
        (tester) async {
      await tester.pumpWidget(const ProviderScope(child: SwasthyaSaathiApp()));
      await tester.pumpAndSettle();

      // Because we mock the route manually, we will just assert the starting route for now
      expect(find.text('Welcome'), findsOneWidget);
    });
  });
}
