// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SessionStatus _$SessionStatusFromJson(Map<String, dynamic> json) =>
    _SessionStatus(
      publicToken: json['publicToken'] as String,
      state: json['state'] as String,
      patientName: json['patientName'] as String,
      patientAge: (json['patientAge'] as num).toInt(),
      patientSex: json['patientSex'] as String,
      language: json['language'] as String,
    );

Map<String, dynamic> _$SessionStatusToJson(_SessionStatus instance) =>
    <String, dynamic>{
      'publicToken': instance.publicToken,
      'state': instance.state,
      'patientName': instance.patientName,
      'patientAge': instance.patientAge,
      'patientSex': instance.patientSex,
      'language': instance.language,
    };

_ConsentPayload _$ConsentPayloadFromJson(Map<String, dynamic> json) =>
    _ConsentPayload(
      agreed: json['agreed'] as bool,
      scope: (json['scope'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$ConsentPayloadToJson(_ConsentPayload instance) =>
    <String, dynamic>{'agreed': instance.agreed, 'scope': instance.scope};

_NextQuestionResponse _$NextQuestionResponseFromJson(
  Map<String, dynamic> json,
) => _NextQuestionResponse(
  isComplete: json['isComplete'] as bool,
  questionId: json['questionId'] as String?,
  text: json['text'] as String?,
  targetSlot: json['targetSlot'] as String?,
);

Map<String, dynamic> _$NextQuestionResponseToJson(
  _NextQuestionResponse instance,
) => <String, dynamic>{
  'isComplete': instance.isComplete,
  'questionId': instance.questionId,
  'text': instance.text,
  'targetSlot': instance.targetSlot,
};

_AnswerPayload _$AnswerPayloadFromJson(Map<String, dynamic> json) =>
    _AnswerPayload(
      questionId: json['questionId'] as String,
      targetSlot: json['targetSlot'] as String,
      rawText: json['rawText'] as String,
      evidenceId: json['evidenceId'] as String?,
    );

Map<String, dynamic> _$AnswerPayloadToJson(_AnswerPayload instance) =>
    <String, dynamic>{
      'questionId': instance.questionId,
      'targetSlot': instance.targetSlot,
      'rawText': instance.rawText,
      'evidenceId': instance.evidenceId,
    };

_ExtractedFact _$ExtractedFactFromJson(Map<String, dynamic> json) =>
    _ExtractedFact(
      slot: json['slot'] as String,
      value: json['value'],
      status: json['status'] as String,
    );

Map<String, dynamic> _$ExtractedFactToJson(_ExtractedFact instance) =>
    <String, dynamic>{
      'slot': instance.slot,
      'value': instance.value,
      'status': instance.status,
    };

_ReviewSummary _$ReviewSummaryFromJson(Map<String, dynamic> json) =>
    _ReviewSummary(
      facts: (json['facts'] as List<dynamic>)
          .map((e) => ExtractedFact.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ReviewSummaryToJson(_ReviewSummary instance) =>
    <String, dynamic>{'facts': instance.facts};
