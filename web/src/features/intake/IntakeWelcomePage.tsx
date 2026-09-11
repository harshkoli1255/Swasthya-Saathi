import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';

export function IntakeWelcomePage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    async function loadSession() {
      if (!token) {
        setError('Missing intake token');
        setLoading(false);
        return;
      }
      try {
        const status = await apiClient.getSessionStatus(token);
        setPatientName(status.patient_name);
        
        if (status.state === 'INTERVIEW') {
          navigate(`/intake/${token}/interview`, { replace: true });
        } else if (status.state === 'REVIEW') {
          navigate(`/intake/${token}/review`, { replace: true });
        } else if (status.state === 'COMPLETED') {
          navigate(`/intake/${token}/completion`, { replace: true });
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Invalid or expired session link.');
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [token, navigate]);

  const handleStart = () => {
    navigate(`/intake/${token}/consent`);
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-850)', animation: 'spin 0.8s linear infinite' }}></div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Preparing your clinical intake...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-emergency-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-8)',
          textAlign: 'center',
          maxWidth: '440px',
          width: '100%'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--color-emergency-bg)',
            color: 'var(--color-emergency)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
            Session Link Expired
          </h3>
          <p style={{ margin: '0 0 var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {error.includes('expired') ? 'This intake session has expired or was already submitted. Please ask the clinic reception for a new check-in link.' : error}
          </p>
          <Button variant="secondary" onClick={() => window.location.href = '/'} fullWidth>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const firstName = patientName ? patientName.split(' ')[0] : 'Patient';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: 'var(--space-8)' }}>
      
      {/* Editorial Welcome Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
          AYUSH Outpatient Pre-Consultation
        </span>
        
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
          fontWeight: '700',
          lineHeight: '1.25',
          letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-3)'
        }}>
          Namaste, {firstName}.
        </h1>

        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.65',
          margin: '0 auto',
          maxWidth: '480px'
        }}>
          To help your doctor understand your health before you enter the examination room, please take a few moments to share how you are feeling today.
        </p>
      </div>

      {/* 3 Reassuring Steps (Open, Human, No Heavy Cards) */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6) var(--space-8)',
        boxShadow: 'var(--shadow-subtle)',
        marginBottom: 'var(--space-8)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-100)',
              color: 'var(--color-primary-850)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '12px',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              1
            </div>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                Speak or Type Naturally
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
                You can answer using voice or keyboard in your comfortable language. No medical terminology is needed.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-100)',
              color: 'var(--color-primary-850)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '12px',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              2
            </div>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                Holistic Health Inquiry
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
                We will ask about your main concern, digestion (Agni), sleep quality (Nidra), and weather preference (Satmya).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-100)',
              color: 'var(--color-primary-850)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '12px',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              3
            </div>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                Shared Directly with Your Doctor
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
                You will review what we noted down before it is sent securely to the doctor's workstation.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Start Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Button size="lg" onClick={handleStart} fullWidth style={{ fontSize: 'var(--font-size-base)' }}>
          Begin Health Inquiry →
        </Button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', justifyContent: 'center', fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4', textAlign: 'center', maxWidth: '440px', margin: '0 auto' }}>
          <span>If you are experiencing chest pain, severe bleeding, or acute breathlessness, please inform the clinic triage desk immediately.</span>
        </div>
      </div>

    </div>
  );
}
