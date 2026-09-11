import re

# Fix session_manager.dart
with open('lib/core/network/session_manager.dart', 'r') as f:
    sm = f.read()
sm = sm.replace('NotifierProvider<SessionManager, String?>((ref) {', 'NotifierProvider<SessionManager, String?>(() {')
with open('lib/core/network/session_manager.dart', 'w') as f:
    f.write(sm)

# Fix api_client.dart
with open('lib/core/network/api_client.dart', 'r') as f:
    ac = f.read()
ac = ac.replace('ApiClient({required Dio dio, required SessionManager sessionManager}) : _dio = dio, _sessionManager = sessionManager;', 'ApiClient({required this._dio, required this._sessionManager});')
ac = ac.replace('final Dio _dio;', 'final Dio _dio;') # just to check
with open('lib/core/network/api_client.dart', 'w') as f:
    f.write(ac)

