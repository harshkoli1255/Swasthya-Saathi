import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/core/network/api_client.dart';
import 'package:swasthyasaathi_patient/core/models/api_models.dart';

class InterviewState {
  final bool isLoading;
  final bool isUploading;
  final NextQuestionResponse? currentQuestion;
  final String? errorMessage;
  final String? processingStatus;

  const InterviewState({
    this.isLoading = false,
    this.isUploading = false,
    this.currentQuestion,
    this.errorMessage,
    this.processingStatus,
  });

  InterviewState copyWith({
    bool? isLoading,
    bool? isUploading,
    NextQuestionResponse? currentQuestion,
    String? errorMessage,
    String? processingStatus,
    bool clearError = false,
  }) {
    return InterviewState(
      isLoading: isLoading ?? this.isLoading,
      isUploading: isUploading ?? this.isUploading,
      currentQuestion: currentQuestion ?? this.currentQuestion,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      processingStatus: processingStatus ?? this.processingStatus,
    );
  }
}

class InterviewController extends Notifier<InterviewState> {
  @override
  InterviewState build() {
    return const InterviewState();
  }

  Future<void> fetchNextQuestion() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final client = ref.read(apiClientProvider);
      final question = await client.getNextQuestion();
      state = state.copyWith(isLoading: false, currentQuestion: question);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Failed to fetch next question. Please check connection.');
    }
  }

  Future<bool> submitTextAnswer(String answerText) async {
    final q = state.currentQuestion;
    if (q == null || q.questionId == null || q.targetSlot == null) return false;

    state = state.copyWith(isUploading: true, processingStatus: 'Submitting answer...', clearError: true);
    try {
      final client = ref.read(apiClientProvider);
      await client.submitAnswer(AnswerPayload(
        questionId: q.questionId!,
        targetSlot: q.targetSlot!,
        rawText: answerText,
      ));
      state = state.copyWith(isUploading: false, processingStatus: null);
      await fetchNextQuestion();
      return true;
    } catch (e) {
      state = state.copyWith(isUploading: false, errorMessage: 'Failed to submit answer. Please try again.', processingStatus: null);
      return false;
    }
  }

  Future<String?> uploadVoice(File audioFile) async {
    final q = state.currentQuestion;
    if (q == null || q.questionId == null || q.targetSlot == null) return null;

    state = state.copyWith(isUploading: true, processingStatus: 'Processing voice...', clearError: true);
    try {
      final client = ref.read(apiClientProvider);
      final result = await client.uploadVoice(
        questionId: q.questionId!,
        targetSlot: q.targetSlot!,
        file: audioFile,
      );
      state = state.copyWith(isUploading: false, processingStatus: null);
      
      // In the voice workflow, we need patient to review the transcript.
      // So we return the transcript to the UI to show to the patient, instead of fetching next question immediately.
      return result['transcript'] as String?;
    } catch (e) {
      state = state.copyWith(isUploading: false, errorMessage: 'Voice processing failed. Please try text input.', processingStatus: null);
      return null;
    }
  }

  Future<String?> uploadDocument(File docFile) async {
    state = state.copyWith(isUploading: true, processingStatus: 'Reading document...', clearError: true);
    try {
      final client = ref.read(apiClientProvider);
      final result = await client.uploadDocument(docFile);
      state = state.copyWith(isUploading: false, processingStatus: null);
      
      return result['extracted_text'] as String?;
    } catch (e) {
      state = state.copyWith(isUploading: false, errorMessage: 'Document upload failed. Please try again.', processingStatus: null);
      return null;
    }
  }
}

final interviewControllerProvider = NotifierProvider<InterviewController, InterviewState>(() {
  return InterviewController();
});
