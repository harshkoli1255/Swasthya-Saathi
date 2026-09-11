import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export function IntakeLayout() {
  const location = useLocation();

  // Progress estimation based on route step
  const getProgress = () => {
    if (location.pathname.includes('/consent')) return 20;
    if (location.pathname.includes('/interview')) return 50;
    if (location.pathname.includes('/documents')) return 75;
    if (location.pathname.includes('/review')) return 90;
    if (location.pathname.includes('/completion') || location.pathname.includes('/confirmation')) return 100;
    return 10; // Welcome
  };

  const getStepLabel = () => {
    if (location.pathname.includes('/consent')) return 'Step 1 of 4 • Consent';
    if (location.pathname.includes('/interview')) return 'Step 2 of 4 • Health Inquiry';
    if (location.pathname.includes('/documents')) return 'Step 3 of 4 • Documents';
    if (location.pathname.includes('/review')) return 'Step 4 of 4 • Final Review';
    if (location.pathname.includes('/completion') || location.pathname.includes('/confirmation')) return 'Completed';
    return 'Introduction';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      
      {/* ── CALM CLINICAL HEADER ── */}
      <header style={{ 
        background: 'var(--color-surface)', 
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ 
          maxWidth: 'var(--max-width-intake)', 
          margin: '0 auto', 
          padding: 'var(--space-3) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand & clinic marker */}
          <Logo size={32} showText={true} subtitle="Pre-Consultation Case Taking" />
          
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-muted)' }}>
            {getStepLabel()}
          </div>
        </div>

        {/* Calm Progress Indicator */}
        <div style={{ width: '100%', height: '3px', background: 'var(--color-border-subtle)' }}>
          <div style={{ 
            height: '100%', 
            background: 'var(--color-primary-850)', 
            width: `${getProgress()}%`,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </header>

      {/* ── INTAKE BODY CONTENT ── */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'var(--max-width-intake)',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-6)'
      }}>
        <Outlet />
      </main>

      {/* ── CALM REASSURING PATIENT FOOTER ── */}
      <footer style={{ 
        borderTop: '1px solid var(--color-border)', 
        padding: 'var(--space-4) var(--space-6)',
        textAlign: 'center',
        background: 'var(--color-surface)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)'
      }}>
        <div style={{ maxWidth: 'var(--max-width-intake)', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Your health responses are encrypted and delivered directly to your attending doctor.</span>
        </div>
      </footer>
    </div>
  );
}
