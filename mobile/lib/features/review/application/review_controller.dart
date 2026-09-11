import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/core/network/api_client.dart';
import 'package:swasthyasaathi_patient/core/models/api_models.dart';

class ReviewState {
  final bool isLoading;
  final bool isSubmitting;
  final ReviewSummary? summary;
  final String? errorMessage;

  const ReviewState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.summary,
    this.errorMessage,
  });

  ReviewState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    ReviewSummary? summary,
    String? errorMessage,
    bool clearError = false,
  }) {
    return ReviewState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      summary: summary ?? this.summary,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class ReviewController extends Notifier<ReviewState> {
  @override
  ReviewState build() {
    return const ReviewState();
  }

  Future<void> fetchSummary() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final client = ref.read(apiClientProvider);
      final summary = await client.getReviewSummary();
      state = state.copyWith(isLoading: false, summary: summary);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Failed to load your summary.');
    }
  }

  Future<bool> confirmFacts() async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final client = ref.read(apiClientProvider);
      await client.confirmReview();
      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: 'Failed to submit confirmation. Please try again.');
      return false;
    }
  }
}

final reviewControllerProvider = NotifierProvider<ReviewController, ReviewState>(() {
  return ReviewController();
});
