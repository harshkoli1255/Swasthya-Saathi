import re

# Fix session_manager.dart
with open('lib/core/network/session_manager.dart', 'r') as f:
    sm = f.read()
sm = sm.replace('class SessionManager extends StateNotifier<String?> {', 'class SessionManager extends Notifier<String?> {')
sm = sm.replace('  SessionManager() : super(null);', '  @override\n  String? build() => null;')
sm = sm.replace('StateNotifierProvider', 'NotifierProvider')
with open('lib/core/network/session_manager.dart', 'w') as f:
    f.write(sm)

# Fix api_client.dart
with open('lib/core/network/api_client.dart', 'r') as f:
    ac = f.read()
ac = ac.replace('ApiClient({required Dio dio, required SessionManager sessionManager})\n      : _dio = dio,\n        _sessionManager = sessionManager;', 'ApiClient({required Dio dio, required SessionManager sessionManager})\n      : _dio = dio,\n        _sessionManager = sessionManager;')
# actually, let's just use initializing formals
ac = ac.replace('ApiClient({required Dio dio, required SessionManager sessionManager})\n      : _dio = dio,\n        _sessionManager = sessionManager;', 'ApiClient({required Dio dio, required SessionManager sessionManager}) : _dio = dio, _sessionManager = sessionManager;')
with open('lib/core/network/api_client.dart', 'w') as f:
    f.write(ac)

# Fix app_theme.dart
with open('lib/core/theme/app_theme.dart', 'r') as f:
    at = f.read()
at = at.replace('CardTheme(', 'CardThemeData(')
at = at.replace('Colors.black.withOpacity(0.05)', 'Colors.black.withValues(alpha: 0.05)')
with open('lib/core/theme/app_theme.dart', 'w') as f:
    f.write(at)

# Fix widget_test.dart
with open('test/widget_test.dart', 'r') as f:
    wt = f.read()
wt = wt.replace('MyApp()', 'SwasthyaSaathiApp()')
with open('test/widget_test.dart', 'w') as f:
    f.write(wt)

