import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/core/network/session_manager.dart';

void main() {
  test('SessionManager starts with null token', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    final token = container.read(sessionProvider);
    expect(token, isNull);
    expect(container.read(sessionProvider.notifier).hasSession, isFalse);
  });

  test('SessionManager sets and clears token properly', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    final manager = container.read(sessionProvider.notifier);
    manager.setToken('test_token_123');

    expect(container.read(sessionProvider), 'test_token_123');
    expect(manager.hasSession, isTrue);

    manager.clearSession();
    expect(container.read(sessionProvider), isNull);
    expect(manager.hasSession, isFalse);
  });
}
