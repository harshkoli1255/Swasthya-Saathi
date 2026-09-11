import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'session_manager.dart';
import '../models/api_models.dart';

// Provide the Dio instance
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    // Localhost for Android Emulator. Use appropriate URL for production
    baseUrl: const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://192.168.29.20:8000/api/v1/intake'),
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 30),
    headers: {
      'Accept': 'application/json',
    },
  ));

  // Add interceptor to log or handle global errors without exposing tokens
  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      // Intentionally do NOT log headers or Authorization here to prevent token leakage
      handler.next(options);
    },
    onError: (DioException e, handler) {
      // Do NOT log the request headers/tokens on error
      final statusCode = e.response?.statusCode;
      if (statusCode == 401 || statusCode == 403) {
        // Session expired or invalid
      } else if (statusCode == 429) {
        // Rate limit
      }
      handler.next(e);
    },
  ));

  return dio;
});

// Provide the ApiClient
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(
    dio: ref.watch(dioProvider),
    sessionManager: ref.watch(sessionProvider.notifier),
  );
});

class ApiClient {
  final Dio _dio;
  final SessionManager _sessionManager;

  ApiClient({required this._dio, required this._sessionManager});

  String _getToken() {
    final token = _sessionManager.currentToken;
    if (token == null || token.isEmpty) {
      throw Exception('Session expired or invalid public_token');
    }
    return token;
  }

  Future<SessionStatus> getSessionStatus(String token) async {
    final response = await _dio.get('/$token');
    return SessionStatus.fromJson(response.data);
  }

  Future<SessionStatus> submitConsent(ConsentPayload payload) async {
    final token = _getToken();
    final response = await _dio.post('/$token/consent', data: payload.toJson());
    return SessionStatus.fromJson(response.data);
  }

  Future<NextQuestionResponse> getNextQuestion() async {
    final token = _getToken();
    final response = await _dio.post('/$token/interview/next');
    return NextQuestionResponse.fromJson(response.data);
  }

  Future<void> submitAnswer(AnswerPayload payload) async {
    final token = _getToken();
    await _dio.post('/$token/interview/answer', data: payload.toJson());
  }

  Future<Map<String, dynamic>> uploadVoice({
    required String questionId,
    required String targetSlot,
    required File file,
  }) async {
    final token = _getToken();
    final formData = FormData.fromMap({
      'question_id': questionId,
      'target_slot': targetSlot,
      'file': await MultipartFile.fromFile(file.path),
    });

    final response = await _dio.post('/$token/upload/voice', data: formData);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> uploadDocument(File file) async {
    final token = _getToken();
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(file.path),
    });

    final response = await _dio.post('/$token/upload/document', data: formData);
    return response.data as Map<String, dynamic>;
  }

  Future<ReviewSummary> getReviewSummary() async {
    final token = _getToken();
    final response = await _dio.get('/$token/review');
    return ReviewSummary.fromJson(response.data);
  }

  Future<void> confirmReview() async {
    final token = _getToken();
    await _dio.post('/$token/confirm');
  }
}
