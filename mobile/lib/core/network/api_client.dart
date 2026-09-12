import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'session_manager.dart';
import '../models/api_models.dart';

// Provide the Dio instance
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    // Default to Render live cloud backend
    baseUrl: const String.fromEnvironment('API_BASE_URL', defaultValue: 'https://swasthya-saathi-5fow.onrender.com/api/v1'),
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 30),
    headers: {
      'Accept': 'application/json',
    },
  ));

  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      handler.next(options);
    },
    onError: (DioException e, handler) {
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

  // Create isolated demo session from QR scan CTA
  Future<Map<String, dynamic>> createDemoSession() async {
    final response = await _dio.post('/intake/demo/create');
    final data = response.data as Map<String, dynamic>;
    final token = (data['token'] ?? data['public_token']) as String;
    _sessionManager.setSession(token);
    return data;
  }

  Future<SessionStatus> getSessionStatus(String token) async {
    final response = await _dio.get('/intake/$token');
    _sessionManager.setSession(token);
    return SessionStatus.fromJson(response.data as Map<String, dynamic>);
  }

  Future<SessionStatus> submitConsent(ConsentPayload payload) async {
    final token = _getToken();
    final response = await _dio.post('/intake/$token/consent', data: payload.toJson());
    return SessionStatus.fromJson(response.data as Map<String, dynamic>);
  }

  Future<NextQuestionResponse> getNextQuestion() async {
    final token = _getToken();
    final response = await _dio.post('/intake/$token/interview/next');
    return NextQuestionResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> submitAnswer(AnswerPayload payload) async {
    final token = _getToken();
    await _dio.post('/intake/$token/interview/answer', data: payload.toJson());
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

    final response = await _dio.post('/intake/$token/upload/voice', data: formData);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> uploadDocument(File file) async {
    final token = _getToken();
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(file.path),
    });

    final response = await _dio.post('/intake/$token/upload/document', data: formData);
    return response.data as Map<String, dynamic>;
  }

  Future<ReviewSummary> getReviewSummary() async {
    final token = _getToken();
    final response = await _dio.get('/intake/$token/review');
    return ReviewSummary.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> confirmReview() async {
    final token = _getToken();
    await _dio.post('/intake/$token/confirm');
  }

  // ABDM Integration
  Future<Map<String, dynamic>> getAbdmStatus() async {
    final response = await _dio.get('/abdm/status');
    return response.data as Map<String, dynamic>;
  }

  Future<AbdmRequestOtpResponse> requestAbdmOtp({
    required String identifier,
    String authMode = "MOBILE_OTP",
  }) async {
    final token = _getToken();
    final response = await _dio.post(
      '/abdm/$token/request-otp',
      data: {
        'auth_mode': authMode,
        'identifier': identifier,
      },
    );
    return AbdmRequestOtpResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<AbdmVerifyOtpResponse> verifyAbdmOtp({
    required String txnId,
    required String otp,
    String authMode = "MOBILE_OTP",
  }) async {
    final token = _getToken();
    final response = await _dio.post(
      '/abdm/$token/verify-otp',
      data: {
        'auth_mode': authMode,
        'txn_id': txnId,
        'otp': otp,
      },
    );
    return AbdmVerifyOtpResponse.fromJson(response.data as Map<String, dynamic>);
  }
}
