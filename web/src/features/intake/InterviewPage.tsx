import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { apiClient } from '@/api/client';
import { NextQuestionResponse } from '@/types';

const SLOT_SUGGESTIONS: Record<string, string[]> = {
  chief_complaint: ['Stomach pain & burning', 'Severe headache', 'Joint pain & morning stiffness', 'Chronic cough & cold', 'Acidity & heartburn', 'Fever with fatigue'],
  duration: ['Since 2 days', 'Since 1 week', 'About 2-3 weeks', 'More than a month'],
  severity: ['Mild (manageable)', 'Moderate (interfering with routine)', 'Severe (intense discomfort)'],
  medical_history: ['None / No prior chronic illness', 'Diabetes', 'High Blood Pressure', 'Asthma / Respiratory allergy', 'Thyroid condition'],
  agni_digestion: ['Normal appetite and smooth digestion', 'Sluggish / slow digestion (Mandagni)', 'Acidity & burning in chest (Amlapitta)', 'Frequent gas or bloating', 'Irregular bowel habits / Constipation'],
  sleep_pattern: ['Sound uninterrupted sleep', 'Disturbed sleep / waking frequently', 'Difficulty falling asleep (Insomnia)', 'Wake up feeling fatigued and unrefreshed'],
  thermal_preference: ['Sensitive to cold weather / Prefer warmth', 'Sensitive to heat / Prefer cool environment', 'Comfortable in normal weather'],
  lifestyle_diet: ['Strict vegetarian, regular meal times', 'Non-vegetarian, irregular meal times', 'Frequent spicy / street food', 'Sedentary work with low physical activity']
};

export function InterviewPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [currentQ, setCurrentQ] = useState<NextQuestionResponse | null>(null);
  const [textVal, setTextVal] = useState('');
  const [currentEvidenceId, setCurrentEvidenceId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [error, setError] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const fetchNextQuestion = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.getNextQuestion(token);
      if (res.is_complete) {
        navigate(`/intake/${token}/documents`);
      } else {
        setCurrentQ(res);
        setTextVal('');
        setCurrentEvidenceId(undefined);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load question';
      if (msg.includes('Invalid state for interview: REVIEW')) {
        navigate(`/intake/${token}/review`, { replace: true });
      } else if (msg.includes('Invalid state for interview: COMPLETED')) {
        navigate(`/intake/${token}/completion`, { replace: true });
      } else if (msg.includes('Invalid state for interview: CONSENT_PENDING')) {
        navigate(`/intake/${token}/consent`, { replace: true });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, [token, navigate]);

  const handleNext = async () => {
    if (!token || !currentQ) return;
    setSubmitting(true);
    setError('');
    try {
      await apiClient.submitAnswer(token, currentQ.question_id!, currentQ.target_slot!, textVal, currentEvidenceId);
      setQuestionNumber(prev => prev + 1);
      await fetchNextQuestion();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (token && currentQ) {
          setProcessingVoice(true);
          try {
            const res = await apiClient.uploadVoice(token, currentQ.question_id!, currentQ.target_slot!, audioBlob);
            if (res.transcript) {
              setTextVal(prev => prev ? prev + ' ' + res.transcript : res.transcript!);
            }
            if (res.evidence_id) {
              setCurrentEvidenceId(res.evidence_id);
            }
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Voice processing failed. You can type your answer below.');
          } finally {
            setProcessingVoice(false);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setError('Microphone access unavailable or denied. You can type your response below.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleBack = () => {
    navigate(`/intake/${token}/consent`);
  };

  const canProceed = textVal.trim().length > 1;

  if (loading && !currentQ) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-850)', animation: 'spin 0.8s linear infinite' }}></div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Preparing your next question...</div>
      </div>
    );
  }

  const suggestions = currentQ?.target_slot ? (SLOT_SUGGESTIONS[currentQ.target_slot] || []) : [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: 'var(--space-4)' }}>
      
      {/* Question Context Eyebrow */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
          Question {questionNumber} • {currentQ?.phase === 'AYUSH' ? 'AYUSH Constitutional Inquiry' : 'Clinical Health Inquiry'}
        </span>
        
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3.2vw, 2rem)',
          fontWeight: '700',
          lineHeight: '1.28',
          letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)',
          margin: 0
        }}>
          {currentQ?.text || 'Please describe your symptoms.'}
        </h1>
      </div>

      {/* Helpful Quick Suggestions (Natural prompts, not buttons) */}
      {suggestions.length > 0 && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>
            Common descriptions (tap to select):
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTextVal(prev => prev ? `${prev}, ${sug}` : sug);
                }}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  lineHeight: '1.4',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-850)';
                  e.currentTarget.style.color = 'var(--color-primary-850)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: 'var(--color-emergency-bg)',
          color: 'var(--color-emergency-text)',
          border: '1px solid var(--color-emergency-border)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-3)',
          fontSize: 'var(--font-size-xs)',
          marginBottom: 'var(--space-4)'
        }}>
          {error}
        </div>
      )}

      {/* Answer Input Area */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-subtle)',
        marginBottom: 'var(--space-6)'
      }}>
        <Textarea
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          placeholder="Speak or type your answer here in your comfortable words..."
          rows={4}
          style={{
            border: 'none',
            padding: 0,
            fontSize: 'var(--font-size-base)',
            lineHeight: '1.6',
            resize: 'vertical',
            width: '100%',
            outline: 'none',
            boxShadow: 'none'
          }}
        />

        {/* Input Footer: Voice Assistant & Word Count */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--space-3)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-border-subtle)'
        }}>
          {/* Voice Interaction Button */}
          <div>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={processingVoice}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-primary-850)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                {processingVoice ? 'Transcribing...' : 'Use Voice (Mic)'}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'var(--color-emergency-bg)',
                  border: '1px solid var(--color-emergency-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-emergency-text)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-emergency)', animation: 'pulse 1s infinite' }}></span>
                Recording... Tap when finished
              </button>
            )}
          </div>

          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {textVal.trim().length} characters
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Button 
          variant="secondary" 
          size="md" 
          onClick={handleBack}
        >
          Back
        </Button>
        <Button 
          size="lg" 
          disabled={!canProceed || submitting || isRecording}
          isLoading={submitting}
          onClick={handleNext}
          style={{ paddingInline: 'var(--space-8)' }}
        >
          Save & Next →
        </Button>
      </div>

    </div>
  );
}
