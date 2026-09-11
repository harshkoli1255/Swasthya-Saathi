// SwasthyaSaathi Type Definitions (Matches FastAPI schemas)

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: 'DOCTOR' | 'ADMIN';
  facility?: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
  user_id: string;
  full_name: string;
  role: string;
}

export interface Patient {
  id: string;
  full_name: string;
  age?: number;
  sex?: string;
  phone?: string;
  abha_id?: string;
  created_at: string;
}

export interface QueuePatientCard {
  encounter_id: string;
  opd_id: string;
  patient_name: string;
  patient_age?: number;
  patient_sex?: string;
  chief_complaint?: string;
  triage_level: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  status: string;
  wait_minutes: number;
  unresolved_conflicts: number;
  red_flag_count: number;
  created_at: string;
}

export interface RedFlagAlert {
  id: string;
  rule_code: string;
  validation_status: string; // Should be DEMO_PENDING_CLINICAL_REVIEW
  triage_level: 'URGENT' | 'EMERGENCY';
  message: string;
  triggered_at: string;
}

export interface SessionStatusResponse {
  public_token: string;
  state: string;
  patient_name: string;
  patient_age?: number;
  patient_sex?: string;
  language: string;
}

export interface NextQuestionResponse {
  is_complete: boolean;
  question_id?: string;
  text?: string;
  target_slot?: string;
  phase?: string;
}

export interface ClinicalFactValue {
  raw: string;
  snomed_code?: string;
  snomed_display?: string;
  [key: string]: unknown;
}

export interface ExtractedFact {
  slot: string;
  value: ClinicalFactValue;
  status: string;
  source?: string;
}

export interface ReviewSummaryResponse {
  facts: ExtractedFact[];
}

export interface ClinicalFactResponse {
  id: string;
  slot: string;
  value: ClinicalFactValue;
  status: string;
  confidence?: number;
  updated_at: string;
  evidence?: {
    source_type: string;
    media_type?: string;
    extracted_text?: string;
    media_url?: string;
  };
}

export interface TimelineEventResponse {
  fact_id: string;
  slot: string;
  value: ClinicalFactValue;
  status: string;
  event_date: string;
  is_approximate: boolean;
  source_type: string;
  evidence_id?: string;
}

export interface ConflictResponse {
  id: string;
  slot: string;
  fact_id_1: string;
  fact_id_2?: string;
  relationship_status: string;
  resolution_notes?: string;
  fact_1_value?: ClinicalFactValue | Record<string, unknown>;
  fact_2_value?: ClinicalFactValue | Record<string, unknown>;
  fact_1_source?: string;
  fact_2_source?: string;
}

export interface SafetyAlertResponse {
  id: string;
  rule_id: string;
  alert_category: string;
  deterministic_explanation: string;
  status: string;
  matched_fact_ids: string[];
  evidence_ids: string[];
}

export interface StructuredSummaryResult {
  chief_complaint?: string;
  history_of_present_illness?: string;
  past_medical_history?: string;
  ayush_observations?: string;
  medications?: string;
  allergies?: string;
  review_of_systems?: string;
  recommended_actions?: string[];
  sections?: { text: string; evidence_ids: string[] }[];
}

export interface EncounterOverviewResponse {
  id: string;
  opd_id: string;
  status: string;
  triage_level: string;
  specialty: string;
  created_at: string;
  updated_at: string;
  patient: Patient;
  clinical_facts: ClinicalFactResponse[];
  timeline: TimelineEventResponse[];
  conflicts: ConflictResponse[];
  safety_alerts: SafetyAlertResponse[];
  summary?: StructuredSummaryResult;
}

export interface VoiceUploadResponse {
  transcript?: string;
  evidence_id?: string;
}

export interface BlockedResource {
  fact_id: string;
  slot: string;
  reason: string;
}

export interface FHIREligibilityResponse {
  eligible_resources: Record<string, unknown>[];
  blocked_resources: BlockedResource[];
  unresolved_conflicts: number;
  unverified_safety_conditions: number;
  terminology_failures: number;
  error?: string;
}

export interface FHIRExportRecord {
  id: string;
  resourceType: string;
  status: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface FHIRExportResult {
  bundle_id?: string;
  resource_count?: number;
  status?: string;
  reason?: string;
  bundle?: Record<string, unknown>;
  [key: string]: unknown;
}
