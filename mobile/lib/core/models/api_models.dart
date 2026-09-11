import 'package:freezed_annotation/freezed_annotation.dart';

part 'api_models.freezed.dart';
part 'api_models.g.dart';

@freezed
abstract class SessionStatus with _$SessionStatus {
  const factory SessionStatus({
    required String publicToken,
    required String state,
    required String patientName,
    required int patientAge,
    required String patientSex,
    required String language,
  }) = _SessionStatus;

  factory SessionStatus.fromJson(Map<String, dynamic> json) => _$SessionStatusFromJson(json);
}

@freezed
abstract class ConsentPayload with _$ConsentPayload {
  const factory ConsentPayload({
    required bool agreed,
    required List<String> scope,
  }) = _ConsentPayload;

  factory ConsentPayload.fromJson(Map<String, dynamic> json) => _$ConsentPayloadFromJson(json);
}

@freezed
abstract class NextQuestionResponse with _$NextQuestionResponse {
  const factory NextQuestionResponse({
    required bool isComplete,
    String? questionId,
    String? text,
    String? targetSlot,
  }) = _NextQuestionResponse;

  factory NextQuestionResponse.fromJson(Map<String, dynamic> json) => _$NextQuestionResponseFromJson(json);
}

@freezed
abstract class AnswerPayload with _$AnswerPayload {
  const factory AnswerPayload({
    required String questionId,
    required String targetSlot,
    required String rawText,
    String? evidenceId,
  }) = _AnswerPayload;

  factory AnswerPayload.fromJson(Map<String, dynamic> json) => _$AnswerPayloadFromJson(json);
}

@freezed
abstract class ExtractedFact with _$ExtractedFact {
  const factory ExtractedFact({
    required String slot,
    required dynamic value,
    required String status,
  }) = _ExtractedFact;

  factory ExtractedFact.fromJson(Map<String, dynamic> json) => _$ExtractedFactFromJson(json);
}

@freezed
abstract class ReviewSummary with _$ReviewSummary {
  const factory ReviewSummary({
    required List<ExtractedFact> facts,
  }) = _ReviewSummary;

  factory ReviewSummary.fromJson(Map<String, dynamic> json) => _$ReviewSummaryFromJson(json);
}
