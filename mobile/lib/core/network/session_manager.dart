import 'package:flutter_riverpod/flutter_riverpod.dart';

class SessionManager extends Notifier<String?> {
  @override
  String? build() => null;

  void setToken(String token) {
    state = token;
  }

  void setSession(String token) {
    state = token;
  }

  void clearSession() {
    state = null;
  }

  bool get hasSession => state != null;
  String? get currentToken => state;
}

final sessionProvider = NotifierProvider<SessionManager, String?>(() {
  return SessionManager();
});
