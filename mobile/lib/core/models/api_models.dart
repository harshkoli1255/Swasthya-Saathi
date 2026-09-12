// Clean, robust clinical API models for SwasthyaSaathi Flutter app

class SessionStatus {
  final String publicToken;
  final String state;
  final String patientName;
  final int patientAge;
  final String patientSex;
  final String language;
  final String? opdId;
  final String? verificationStatus;
  final String? verificationMethod;
  final String? abhaNumber;
  final String? abhaAddress;
  final String? encounterStatus;
  final int? queuePosition;
  final int? queueAhead;
  final int? estimatedWaitMinutes;
  final String? callingToken;

  const SessionStatus({
    required this.publicToken,
    required this.state,
    required this.patientName,
    required this.patientAge,
    required this.patientSex,
    required this.language,
    this.opdId,
    this.verificationStatus,
    this.verificationMethod,
    this.abhaNumber,
    this.abhaAddress,
    this.encounterStatus,
    this.queuePosition,
    this.queueAhead,
    this.estimatedWaitMinutes,
    this.callingToken,
  });

  factory SessionStatus.fromJson(Map<String, dynamic> json) {
    return SessionStatus(
      publicToken: (json['public_token'] ?? json['publicToken'] ?? '') as String,
      state: (json['state'] ?? 'CONSENT_PENDING') as String,
      patientName: (json['patient_name'] ?? json['patientName'] ?? 'Walk-in Patient') as String,
      patientAge: (json['patient_age'] ?? json['patientAge'] ?? 30) as int,
      patientSex: (json['patient_sex'] ?? json['patientSex'] ?? 'M') as String,
      language: (json['language'] ?? 'en') as String,
      opdId: (json['opd_id'] ?? json['opdId']) as String?,
      verificationStatus: (json['verification_status'] ?? json['verificationStatus']) as String?,
      verificationMethod: (json['verification_method'] ?? json['verificationMethod']) as String?,
      abhaNumber: (json['abha_number'] ?? json['abhaNumber']) as String?,
      abhaAddress: (json['abha_address'] ?? json['abhaAddress']) as String?,
      encounterStatus: (json['encounter_status'] ?? json['encounterStatus']) as String?,
      queuePosition: json['queue_position'] as int? ?? json['queuePosition'] as int?,
      queueAhead: json['queue_ahead'] as int? ?? json['queueAhead'] as int?,
      estimatedWaitMinutes: json['estimated_wait_minutes'] as int? ?? json['estimatedWaitMinutes'] as int?,
      callingToken: (json['calling_token'] ?? json['callingToken']) as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'public_token': publicToken,
    'state': state,
    'patient_name': patientName,
    'patient_age': patientAge,
    'patient_sex': patientSex,
    'language': language,
    if (opdId != null) 'opd_id': opdId,
    if (verificationStatus != null) 'verification_status': verificationStatus,
    if (verificationMethod != null) 'verification_method': verificationMethod,
    if (abhaNumber != null) 'abha_number': abhaNumber,
    if (abhaAddress != null) 'abha_address': abhaAddress,
  };
}

class ConsentPayload {
  final bool agreed;
  final List<String> scope;

  const ConsentPayload({required this.agreed, required this.scope});

  Map<String, dynamic> toJson() => {
    'agreed': agreed,
    'scope': scope,
  };

  factory ConsentPayload.fromJson(Map<String, dynamic> json) => ConsentPayload(
    agreed: json['agreed'] as bool? ?? false,
    scope: ((json['scope'] as List<dynamic>?) ?? []).map((e) => e.toString()).toList(),
  );
}

class NextQuestionResponse {
  final bool isComplete;
  final String? questionId;
  final String? text;
  final String? targetSlot;
  final String? phase;

  const NextQuestionResponse({
    required this.isComplete,
    this.questionId,
    this.text,
    this.targetSlot,
    this.phase,
  });

  factory NextQuestionResponse.fromJson(Map<String, dynamic> json) {
    return NextQuestionResponse(
      isComplete: (json['is_complete'] ?? json['isComplete'] ?? false) as bool,
      questionId: (json['question_id'] ?? json['questionId']) as String?,
      text: (json['text']) as String?,
      targetSlot: (json['target_slot'] ?? json['targetSlot']) as String?,
      phase: (json['phase']) as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'is_complete': isComplete,
    if (questionId != null) 'question_id': questionId,
    if (text != null) 'text': text,
    if (targetSlot != null) 'target_slot': targetSlot,
    if (phase != null) 'phase': phase,
  };
}

class AnswerPayload {
  final String questionId;
  final String targetSlot;
  final String rawText;
  final String? evidenceId;

  const AnswerPayload({
    required this.questionId,
    required this.targetSlot,
    required this.rawText,
    this.evidenceId,
  });

  Map<String, dynamic> toJson() => {
    'question_id': questionId,
    'target_slot': targetSlot,
    'raw_text': rawText,
    if (evidenceId != null) 'evidence_id': evidenceId,
  };

  factory AnswerPayload.fromJson(Map<String, dynamic> json) => AnswerPayload(
    questionId: (json['question_id'] ?? json['questionId'] ?? '') as String,
    targetSlot: (json['target_slot'] ?? json['targetSlot'] ?? '') as String,
    rawText: (json['raw_text'] ?? json['rawText'] ?? '') as String,
    evidenceId: (json['evidence_id'] ?? json['evidenceId']) as String?,
  );
}

class ExtractedFact {
  final String slot;
  final dynamic value;
  final String status;

  const ExtractedFact({
    required this.slot,
    required this.value,
    required this.status,
  });

  factory ExtractedFact.fromJson(Map<String, dynamic> json) {
    return ExtractedFact(
      slot: (json['slot'] ?? '') as String,
      value: json['value'],
      status: (json['status'] ?? 'RAW') as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'slot': slot,
    'value': value,
    'status': status,
  };
}

class ReviewSummary {
  final List<ExtractedFact> facts;

  const ReviewSummary({required this.facts});

  factory ReviewSummary.fromJson(Map<String, dynamic> json) {
    final list = json['facts'] as List<dynamic>? ?? [];
    return ReviewSummary(
      facts: list.map((item) => ExtractedFact.fromJson(item as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'facts': facts.map((f) => f.toJson()).toList(),
  };
}

class AbdmRequestOtpResponse {
  final bool success;
  final String? txnId;
  final String message;

  const AbdmRequestOtpResponse({
    required this.success,
    this.txnId,
    required this.message,
  });

  factory AbdmRequestOtpResponse.fromJson(Map<String, dynamic> json) {
    return AbdmRequestOtpResponse(
      success: (json['success'] ?? false) as bool,
      txnId: (json['txn_id'] ?? json['txnId']) as String?,
      message: (json['message'] ?? '') as String,
    );
  }
}

class AbdmVerifyOtpResponse {
  final bool success;
  final String verificationStatus;
  final String patientName;
  final String abhaNumber;
  final String abhaAddress;
  final int? age;
  final String? gender;
  final String message;

  const AbdmVerifyOtpResponse({
    required this.success,
    required this.verificationStatus,
    required this.patientName,
    required this.abhaNumber,
    required this.abhaAddress,
    this.age,
    this.gender,
    required this.message,
  });

  factory AbdmVerifyOtpResponse.fromJson(Map<String, dynamic> json) {
    return AbdmVerifyOtpResponse(
      success: (json['success'] ?? false) as bool,
      verificationStatus: (json['verification_status'] ?? 'UNVERIFIED') as String,
      patientName: (json['patient_name'] ?? 'Patient') as String,
      abhaNumber: (json['abha_number'] ?? '') as String,
      abhaAddress: (json['abha_address'] ?? '') as String,
      age: json['age'] as int?,
      gender: json['gender'] as String?,
      message: (json['message'] ?? '') as String,
    );
  }
}
