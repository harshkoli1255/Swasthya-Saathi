import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';

export function ConsentPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!agreed || !token) return;
    setSubmitting(true);
    setError('');
    try {
      await apiClient.submitConsent(token, ["data_collection", "ai_processing"]);
      navigate(`/intake/${token}/interview`);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Consent already processed') {
        navigate(`/intake/${token}/interview`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to submit consent.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: 'var(--space-6)' }}>
      
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
          Step 1 of 4 • Patient Privacy & Consent
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)',
          lineHeight: '1.25'
        }}>
          How your health information is cared for.
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          We treat your medical history with complete dignity and confidentiality.
        </p>
      </div>

      {/* Transparent Information Box */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-subtle)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-850)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', fontSize: '11px', fontWeight: 'bold' }}>
            ✓
          </div>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              Strictly for Your Consultation
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
              Your answers are used solely by your attending physician and clinic care team to prepare for today's visit.
            </p>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)' }}></div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-850)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', fontSize: '11px', fontWeight: 'bold' }}>
            ✓
          </div>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              Physician Holds Authority
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
              The software never makes medical diagnoses or prescribes medications. Your doctor conducts the exam and makes all medical decisions.
            </p>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)' }}></div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-850)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', fontSize: '11px', fontWeight: 'bold' }}>
            ✓
          </div>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              Review Before Submission
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
              You will see a summary of all extracted facts and can adjust anything before confirming.
            </p>
          </div>
        </div>
      </div>

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

      {/* Explicit Consent Checkbox */}
      <div style={{
        background: agreed ? 'var(--color-primary-50)' : 'var(--color-surface-subtle)',
        border: `1px solid ${agreed ? 'var(--color-primary-300)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)'
      }} onClick={() => setAgreed(!agreed)}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer', margin: 0 }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-850)', marginTop: '2px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)', lineHeight: '1.5' }}>
            I agree to share my health responses with my attending doctor to help prepare for my consultation.
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/intake/${token}/welcome`)}
          style={{ flex: '0 0 auto' }}
        >
          Back
        </Button>
        <Button 
          fullWidth 
          size="lg" 
          disabled={!agreed} 
          isLoading={submitting} 
          onClick={handleContinue}
          style={{ flex: 1 }}
        >
          Continue to Questions →
        </Button>
      </div>

    </div>
  );
}
