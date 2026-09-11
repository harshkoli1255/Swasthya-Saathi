import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/core/network/api_client.dart';
import 'package:swasthyasaathi_patient/core/network/session_manager.dart';
import 'package:swasthyasaathi_patient/core/models/api_models.dart';
import 'package:swasthyasaathi_patient/features/interview/application/interview_controller.dart';
import 'package:dio/dio.dart';

class MockApiClient extends ApiClient {
  MockApiClient() : super(dio: Dio(), sessionManager: SessionManager());
  
  bool submitAnswerCalled = false;
  
  @override
  Future<NextQuestionResponse> getNextQuestion() async {
    return const NextQuestionResponse(
      isComplete: false,
      questionId: 'q1',
      targetSlot: 'symptom',
    );
  }
  
  @override
  Future<Map<String, dynamic>> uploadVoice({required String questionId, required String targetSlot, required File file}) async {
    return {'transcript': 'I have a headache'};
  }
  
  @override
  Future<Map<String, dynamic>> uploadDocument(File file) async {
    return {'extracted_text': 'Blood pressure 120/80'};
  }
  
  @override
  Future<void> submitAnswer(AnswerPayload payload) async {
    submitAnswerCalled = true;
  }
}

void main() {
  test('Voice transcript is NOT automatically submitted as a clinical fact', () async {
    final mockApiClient = MockApiClient();
    final container = ProviderContainer(
      overrides: [
        apiClientProvider.overrideWithValue(mockApiClient),
      ],
    );
    final controller = container.read(interviewControllerProvider.notifier);
    
    await controller.fetchNextQuestion();
    final transcript = await controller.uploadVoice(File('dummy.m4a'));

    expect(transcript, 'I have a headache');
    expect(mockApiClient.submitAnswerCalled, false);
    
    await controller.submitTextAnswer(transcript!);
    expect(mockApiClient.submitAnswerCalled, true);
    container.dispose();
  });
}
