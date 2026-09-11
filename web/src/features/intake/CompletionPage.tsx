import React from 'react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function CompletionPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBlock: 'var(--space-6)',
      width: '100%'
    }}>
      
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-8)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-subtle)',
        maxWidth: '580px',
        width: '100%'
      }}>
        {/* Dignified Check Emblem */}
        <div style={{ 
          width: '52px', 
          height: '52px', 
          background: 'var(--color-primary-100)', 
          color: 'var(--color-primary-850)',
          borderRadius: '50%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto var(--space-4)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
          Intake Transmitted
        </span>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-3)',
          lineHeight: '1.25'
        }}>
          Your case sheet is ready for your doctor.
        </h1>
        
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          maxWidth: '460px',
          margin: '0 auto var(--space-8)',
          lineHeight: '1.65'
        }}>
          Thank you for taking time to share your symptoms and digestion. When your OPD token is called, your doctor will already have your structured history in front of them.
        </p>

        <div style={{
          background: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-5) var(--space-6)',
          textAlign: 'left',
          marginBottom: 'var(--space-8)'
        }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
            What to do next
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: 'var(--space-4)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            lineHeight: '1.55'
          }}>
            <li>Please take a seat in the waiting lounge outside the examination room.</li>
            <li>Keep your OPD slip or token number ready when the nurse calls your name.</li>
            <li>If you have hard-copy scan reports or previous prescriptions, carry them in with you.</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="md" onClick={() => navigate('/')}>
            Return to Home
          </Button>
          <Button size="md" onClick={() => navigate('/doctor/login')}>
            View Physician Queue (Demo) →
          </Button>
        </div>

      </div>
      
    </div>
  );
}
