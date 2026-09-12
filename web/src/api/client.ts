import { mockQueue } from '@/mocks/queue';
import { 
  QueuePatientCard, 
  AuthResponse, 
  SessionStatusResponse, 
  NextQuestionResponse,
  ReviewSummaryResponse,
  EncounterOverviewResponse,
  ClinicalFactResponse,
  FHIREligibilityResponse,
  FHIRExportResult,
  FHIRExportRecord,
  VoiceUploadResponse,
  ABDMStatusResponse,
  ABDMRequestOTPPayload,
  ABDMRequestOTPResponse,
  ABDMVerifyOTPPayload,
  ABDMVerifyOTPResponse
} from '@/types';

// In Stage 1, we use mock endpoints to allow UI development to proceed
// without waiting for the full backend to be ready.

const USE_MOCKS = false; // Set to false to hit real API

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://swasthya-saathi-5fow.onrender.com') + '/api/v1';

export const apiClient = {
  async login(username: string, password: string): Promise<AuthResponse> {
    if (USE_MOCKS) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'dr.ayush' && password === 'demo_password123') {
            resolve({
              access_token: 'mock-token',
              token_type: 'bearer',
              expires_in_minutes: 480,
              user_id: 'u1-uuid',
              full_name: 'Dr. AYUSH Physician',
              role: 'DOCTOR'
            });
          } else {
            reject(new Error('Invalid demo credentials'));
          }
        }, 500);
      });
    }
    
    // Real API call
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  async getQueue(token: string): Promise<QueuePatientCard[]> {
    if (USE_MOCKS) {
      return new Promise((resolve) => setTimeout(() => resolve(mockQueue), 500));
    }
    
    // Real API call
    const response = await fetch(`${API_BASE}/queue`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch queue');
    }
    return response.json();
  },

  // --- Intake Flow (Patient) ---
  async createDemoSession() {
    const response = await fetch(`${API_BASE}/intake/demo/create`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to create demo session');
    return response.json();
  },

  async getSessionStatus(publicToken: string): Promise<SessionStatusResponse> {
    const response = await fetch(`${API_BASE}/intake/${publicToken}`);
    if (!response.ok) throw new Error('Invalid or expired session');
    return response.json();
  },

  async submitConsent(publicToken: string, scope: string[]) {
    const response = await fetch(`${API_BASE}/intake/${publicToken}/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agreed: true, scope })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit consent');
    }
    return response.json();
  },

  async getNextQuestion(publicToken: string): Promise<NextQuestionResponse> {
    const response = await fetch(`${API_BASE}/intake/${publicToken}/interview/next`, {
      method: 'POST'
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch next question');
    }
    return response.json();
  },

  async submitAnswer(publicToken: string, questionId: string, targetSlot: string, rawText: string, evidenceId?: string): Promise<void> {
    const body: Record<string, unknown> = { question_id: questionId, target_slot: targetSlot, raw_text: rawText };
    if (evidenceId) {
      body.evidence_id = evidenceId;
    }
    const response = await fetch(`${API_BASE}/intake/${publicToken}/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Failed to submit answer');
    return response.json();
  },

  async uploadVoice(publicToken: string, questionId: string, targetSlot: string, audioBlob: Blob): Promise<VoiceUploadResponse> {
    const formData = new FormData();
    formData.append('question_id', questionId);
    formData.append('target_slot', targetSlot);
    formData.append('file', audioBlob, 'recording.webm');
    
    const response = await fetch(`${API_BASE}/intake/${publicToken}/upload/voice`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to process voice');
    }
    return response.json();
  },
  
  async uploadDocument(publicToken: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/intake/${publicToken}/upload/document`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to process document');
    }
    return response.json();
  },

  async getReviewSummary(publicToken: string): Promise<ReviewSummaryResponse> {
    const response = await fetch(`${API_BASE}/intake/${publicToken}/review`);
    if (!response.ok) throw new Error('Failed to fetch review summary');
    return response.json();
  },

  async confirmReview(publicToken: string) {
    const response = await fetch(`${API_BASE}/intake/${publicToken}/confirm`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to confirm review');
    return response.json();
  },

  // --- Doctor Flow ---
  async getEncounterOverview(token: string, encounterId: string): Promise<EncounterOverviewResponse> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch encounter overview');
    return response.json();
  },

  async updateClinicalFact(token: string, encounterId: string, answerId: string, value: Record<string, unknown>): Promise<ClinicalFactResponse> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/answers/${answerId}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ value })
    });
    if (!response.ok) throw new Error('Failed to update clinical fact');
    return response.json();
  },

  async getExportEligibility(token: string, encounterId: string): Promise<FHIREligibilityResponse> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/export-eligibility`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch export eligibility');
    return response.json();
  },

  async exportFHIR(token: string, encounterId: string): Promise<FHIRExportResult> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/export-fhir`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to export FHIR bundle');
    return response.json();
  },

  async getExportRecords(token: string, encounterId: string): Promise<FHIRExportRecord[]> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/export-records`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch export records');
    return response.json();
  },

  async acknowledgeAlert(token: string, encounterId: string, alertId: string, status: string = 'PHYSICIAN_ACKNOWLEDGED'): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to acknowledge safety alert');
    return response.json();
  },

  async resolveConflict(token: string, encounterId: string, conflictId: string, relationshipStatus: string = 'RESOLVED', resolutionNotes?: string): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/encounters/${encounterId}/conflicts/${conflictId}/resolve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        relationship_status: relationshipStatus,
        resolution_notes: resolutionNotes || 'Resolved during clinical review'
      })
    });
    if (!response.ok) throw new Error('Failed to resolve clinical conflict');
    return response.json();
  },

  // --- ABDM Sandbox Patient Verification ---
  async getABDMStatus(): Promise<ABDMStatusResponse> {
    const response = await fetch(`${API_BASE}/abdm/status`);
    if (!response.ok) throw new Error('Failed to fetch ABDM status');
    return response.json();
  },

  async requestABDMOTP(publicToken: string, payload: ABDMRequestOTPPayload): Promise<ABDMRequestOTPResponse> {
    const response = await fetch(`${API_BASE}/abdm/${publicToken}/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to request ABDM OTP');
    }
    return response.json();
  },

  async verifyABDMOTP(publicToken: string, payload: ABDMVerifyOTPPayload): Promise<ABDMVerifyOTPResponse> {
    const response = await fetch(`${API_BASE}/abdm/${publicToken}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'ABDM verification failed');
    }
    return response.json();
  },

  async processScanShare(publicToken: string, qrCodeData: string): Promise<ABDMVerifyOTPResponse> {
    const response = await fetch(`${API_BASE}/abdm/${publicToken}/scan-share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_code_data: qrCodeData })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Scan & Share processing failed');
    }
    return response.json();
  }
};
