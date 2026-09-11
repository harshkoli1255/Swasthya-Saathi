import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/api/client';

export function HomePage() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Interactive Walkthrough State
  const [activeStage, setActiveStage] = useState<'patient' | 'extraction' | 'physician' | 'fhir'>('patient');

  const handleStartDemo = async () => {
    setDemoLoading(true);
    setError('');
    try {
      const res = await apiClient.createDemoSession();
      const token = res.token || res.public_token;
      navigate(`/intake/${token}/welcome`);
    } catch {
      setDemoLoading(false);
      setError('Unable to launch live intake session. Please check backend connection.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      
      {/* ── 1. HERO SECTION: EDITORIAL, GROUNDED, RESTRAINED ── */}
      <section style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-20)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
          
          {/* Left Column: Clear Clinical Introduction */}
          <div>
            <div className="editorial-eyebrow" style={{ marginBottom: 'var(--space-4)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary-600)' }}></span>
              Clinical Pre-Consultation Intelligence
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 4vw, 3rem)',
              fontWeight: '700',
              lineHeight: '1.2',
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-6)'
            }}>
              Care starts before the consultation begins.
            </h1>

            <p style={{
              fontSize: 'var(--font-size-lg)',
              lineHeight: '1.65',
              color: 'var(--color-text-secondary)',
              margin: '0 0 var(--space-8)',
              maxWidth: '520px'
            }}>
              SwasthyaSaathi captures patient history, gathers AYUSH constitutional markers (Agni, Nidra, Satmya), and structures a verified case sheet for the physician — all before the patient walks through the door.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <Button 
                size="lg" 
                onClick={handleStartDemo} 
                isLoading={demoLoading}
                style={{ paddingInline: 'var(--space-6)' }}
              >
                Experience Patient Intake
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate('/doctor/login')}
                style={{ paddingInline: 'var(--space-6)' }}
              >
                Physician Workstation →
              </Button>
            </div>

            {error && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-emergency)', margin: 'var(--space-2) 0 0' }}>
                {error}
              </p>
            )}

            {/* Quiet Credibility Marker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)'
            }}>
              <span><strong>Principle:</strong> AI Assists. Doctor Decides.</span>
              <span>•</span>
              <span>ABDM & NAMASTE Ready</span>
              <span>•</span>
              <span>Full Audit Provenance</span>
            </div>
          </div>

          {/* Right Column: Authentic Live Clinical Workstation Preview */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            {/* Header of Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-surface-subtle)',
              borderBottom: '1px solid var(--color-border)',
              fontSize: 'var(--font-size-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary-600)' }}></span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Live Case Sheet</span>
                <span style={{ color: 'var(--color-text-muted)' }}>• OPD-2026-4081</span>
              </div>
              <Badge variant="success">READY FOR PHYSICIAN</Badge>
            </div>

            {/* Inner Content of Preview */}
            <div style={{ padding: 'var(--space-5)' }}>
              
              {/* Patient Banner in Preview */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                    Meera Devi
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    46y • Female • Ayush Kayachikitsa OPD
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>CHIEF CONCERN</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary-850)' }}>
                    Epigastric Burning & Heaviness
                  </span>
                </div>
              </div>

              {/* Narrative Summary Preview */}
              <div style={{ marginBottom: 'var(--space-4)', background: 'var(--color-surface-subtle)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', display: 'block', marginBottom: '4px' }}>
                  Synthesized Clinical Narrative
                </span>
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                  Patient reports recurring epigastric burning for 3 weeks, aggravated within 45 minutes of post-lunch meals. Accompanied by disturbed sleep and mild morning fatigue. No history of melena or acute dysphagia.
                </p>
              </div>

              {/* AYUSH Constitutional Quad */}
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  AYUSH Constitutional Examination
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                  <div style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#ffffff' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>AGNI (DIGESTION)</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                      Mandagni / Sluggish
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#ffffff' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>NIDRA (SLEEP)</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                      Khandita / Fragmented
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#ffffff' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>SATMYA (WEATHER)</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                      Sheeta Asahyata (Cold Sensitive)
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#ffffff' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>AHARA (DIET)</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                      Irregular Meal Times • Spicy
                    </div>
                  </div>
                </div>
              </div>

              {/* Provenance Footer in Preview */}
              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                <span>Provenance: 4 Voice Turns • 1 Prescription Scan</span>
                <span style={{ color: 'var(--color-primary-850)', fontWeight: 'var(--font-weight-semibold)' }}>Verified Patient Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE CLINICAL REALITY: WHY THE GAP EXISTS ── */}
      <section style={{ paddingBlock: 'var(--space-20)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
              The Clinical Challenge
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: '700',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: '0 0 var(--space-4)'
            }}>
              AYUSH clinical medicine is holistic. OPD encounters are four minutes.
            </h2>
            <p style={{
              fontSize: 'var(--font-size-base)',
              lineHeight: '1.7',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto'
            }}>
              Ayurveda and traditional systems require examining both <em>Roga</em> (the condition) and <em>Rogi</em> (the constitution) — including appetite, sleep, emotional stressors, and daily regimen. In high-volume outpatient clinics, physicians cannot gather all this context while writing notes and examining the patient.
            </p>
          </div>

          {/* Side-by-side Contrast: Without vs With SwasthyaSaathi */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-8)'
          }}>
            {/* The Old Reality */}
            <div style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', color: 'var(--color-emergency-text)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Conventional OPD Intake
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-text-muted)' }}>—</span>
                  Patients feel rushed, forgetting crucial details about sleep, diet, or previous medications.
                </li>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-text-muted)' }}>—</span>
                  Doctors spend up to 70% of the consultation typing or scribbling administrative details.
                </li>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-text-muted)' }}>—</span>
                  Holistic AYUSH markers (Agni, Koshtha, Satmya) are frequently omitted due to sheer time constraints.
                </li>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-text-muted)' }}>—</span>
                  Clinical notes remain trapped on paper with zero interoperability with ABDM or FHIR standards.
                </li>
              </ul>
            </div>

            {/* The SwasthyaSaathi Experience */}
            <div style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-200)',
              background: 'var(--color-surface)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', color: 'var(--color-primary-850)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                With SwasthyaSaathi
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: '1.55' }}>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary-700)' }}>✓</span>
                  Patient speaks or types in their own language in the waiting area at their own relaxed pace.
                </li>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary-700)' }}>✓</span>
                  Structured facts (Agni, Nidra, Satmya, Ahara) are extracted and confirmed by the patient.
                </li>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary-700)' }}>✓</span>
                  Doctor opens a clear, synthesized case sheet with high-priority safety flags already evaluated.
                </li>
                <li style={{ paddingLeft: 'var(--space-4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary-700)' }}>✓</span>
                  One-click export produces dual-coded FHIR R4 Bundles compliant with SNOMED CT and NAMASTE.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE FOUR-STAGE DEMONSTRATION ── */}
      <section style={{ paddingBlock: 'var(--space-20)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
              Interactive Workflow Demonstration
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: '700',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: '0 0 var(--space-4)'
            }}>
              From raw patient voice to dual-coded clinical record.
            </h2>
            <p style={{
              fontSize: 'var(--font-size-base)',
              lineHeight: '1.65',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto'
            }}>
              Follow how an unedited statement from a patient transforms into structured facts, undergoes patient confirmation, and reaches the physician workstation.
            </p>
          </div>

          {/* Workflow Stage Navigation Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-10)'
          }}>
            {([
              { id: 'patient', step: '01', title: 'Patient Voice / Text' },
              { id: 'extraction', step: '02', title: 'Structured Facts' },
              { id: 'physician', step: '03', title: 'Physician Workstation' },
              { id: 'fhir', step: '04', title: 'FHIR & NAMASTE Export' }
            ] as const).map((tab) => {
              const isActive = activeStage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStage(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-5)',
                    background: isActive ? 'var(--color-primary-850)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                    border: `1px solid ${isActive ? 'var(--color-primary-950)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{
                    fontSize: '11px',
                    opacity: isActive ? 0.8 : 0.6,
                    fontWeight: 'var(--font-weight-bold)'
                  }}>
                    {tab.step}
                  </span>
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Stage Content Demonstration Panel */}
          <div style={{
            maxWidth: '860px',
            margin: '0 auto',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-background)',
            overflow: 'hidden'
          }}>
            {activeStage === 'patient' && (
              <div style={{ padding: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Step 01 • Patient Input Experience
                    </span>
                    <h3 style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                      "How is your digestion and daily appetite?"
                    </h3>
                  </div>
                  <Badge variant="default">AYUSH PROTOCOL</Badge>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', color: 'var(--color-primary-850)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    Voice Transcript Captured
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-base)', lineHeight: '1.65', color: 'var(--color-text-primary)' }}>
                    "Doctor sahab, for the last three weeks after lunch, my stomach feels very heavy and starts burning. I feel bloated and get acidic burps. I prefer hot tea and warm water because cold water makes my stomach hurt."
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  <span>Language: Hindi / English Mixed • Audio Duration: 14s</span>
                  <span style={{ color: 'var(--color-primary-850)', fontWeight: 'var(--font-weight-semibold)' }}>Immutable Audio Asset Stored</span>
                </div>
              </div>
            )}

            {activeStage === 'extraction' && (
              <div style={{ padding: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Step 02 • Structured Clinical Information
                    </span>
                    <h3 style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                      Extracted Clinical Slots & Provenance
                    </h3>
                  </div>
                  <Badge variant="success">CONFIRMED BY PATIENT</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase' }}>CHIEF COMPLAINT</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Epigastric burning & post-prandial heaviness</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Turn #1</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase' }}>AGNI (DIGESTIVE CAPACITY)</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Mandagni (Sluggish digestion with Amlapitta symptoms)</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Turn #2</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase' }}>THERMAL SATMYA</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Sheeta Asahyata (Cold aversion, preference for warm beverages)</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Turn #2</span>
                  </div>
                </div>

                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', background: 'var(--color-surface-subtle)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Safety Evaluation:</strong> Evaluated against Deterministic Safety Rules (RF-001 through RF-007). Zero acute red flags detected. Status: Routine OPD Queue.
                </div>
              </div>
            )}

            {activeStage === 'physician' && (
              <div style={{ padding: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Step 03 • Physician Decision & Authority
                    </span>
                    <h3 style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                      Physician Reviews, Edits, and Verifies
                    </h3>
                  </div>
                  <Badge variant="info">AUTHORITY WORKSPACE</Badge>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}>Chief Complaint Fact</span>
                    <Badge variant="success">PHYSICIAN VERIFIED</Badge>
                  </div>
                  <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    "Amlapitta with post-prandial epigastric burning (3 weeks duration)"
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Promoted by Dr. Ayush Sharma • Full clinical audit record stored with timestamp.
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                  The attending physician holds unilateral authority to override, reclassify, or add findings. AI outputs are treated strictly as drafts awaiting medical validation.
                </p>
              </div>
            )}

            {activeStage === 'fhir' && (
              <div style={{ padding: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Step 04 • Interoperable Health Record
                    </span>
                    <h3 style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                      HL7 FHIR R4 & Ministry of Ayush NAMASTE
                    </h3>
                  </div>
                  <Badge variant="success">DUAL CODED BUNDLE</Badge>
                </div>

                <div style={{ background: 'var(--color-neutral-900)', color: '#ffffff', padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.55', overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
                  <span style={{ color: '#a78bfa' }}>"resourceType"</span>: <span style={{ color: '#34d399' }}>"Bundle"</span>,<br/>
                  <span style={{ color: '#a78bfa' }}>"type"</span>: <span style={{ color: '#34d399' }}>"document"</span>,<br/>
                  <span style={{ color: '#a78bfa' }}>"coding"</span>: [<br/>
                  &nbsp;&nbsp;&#123;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#93c5fd' }}>"system"</span>: <span style={{ color: '#fef08a' }}>"http://snomed.info/sct"</span>,<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#93c5fd' }}>"code"</span>: <span style={{ color: '#fef08a' }}>"405729008"</span>,<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#93c5fd' }}>"display"</span>: <span style={{ color: '#fef08a' }}>"Hematemesis / Burning sensation"</span><br/>
                  &nbsp;&nbsp;&#125;,<br/>
                  &nbsp;&nbsp;&#123;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#93c5fd' }}>"system"</span>: <span style={{ color: '#fef08a' }}>"http://namstp.ayush.gov.in"</span>,<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#93c5fd' }}>"code"</span>: <span style={{ color: '#fef08a' }}>"NAMASTE:AYU-DIS-003"</span>,<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#93c5fd' }}>"display"</span>: <span style={{ color: '#fef08a' }}>"Amlapitta (Acid Peptic Disorder)"</span><br/>
                  &nbsp;&nbsp;&#125;<br/>
                  ]
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  <span>Verified 20 Entries in Document Bundle</span>
                  <span style={{ color: 'var(--color-primary-850)', fontWeight: 'var(--font-weight-semibold)' }}>ABDM Gate: Ready for Electronic Dispatch</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. FOUR CORE CLINICAL PILLARS ── */}
      <section style={{ paddingBlock: 'var(--space-20)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
              Engineered for Healthcare
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: '700',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: '0 0 var(--space-4)'
            }}>
              Four foundational architectural principles.
            </h2>
            <p style={{
              fontSize: 'var(--font-size-base)',
              lineHeight: '1.65',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto'
            }}>
              Healthcare software demands a different level of rigor. Every component of SwasthyaSaathi was conceived around safety, provenance, and physician leadership.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-8)'
          }}>
            {/* Pillar 1 */}
            <div style={{
              padding: 'var(--space-6)',
              borderTop: '2px solid var(--color-primary-850)',
              background: 'var(--color-surface)',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              borderInline: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', letterSpacing: '0.05em' }}>
                PILLAR 01
              </span>
              <h3 style={{ margin: 'var(--space-2) 0 var(--space-3)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                The Pre-Consultation Boundary
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                SwasthyaSaathi operates strictly in the pre-consultation interval. It never diagnoses, prescribes, or makes clinical decisions. It serves as an intake assistant that structures patient facts for human review.
              </p>
            </div>

            {/* Pillar 2 */}
            <div style={{
              padding: 'var(--space-6)',
              borderTop: '2px solid var(--color-emergency)',
              background: 'var(--color-surface)',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              borderInline: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-emergency-text)', letterSpacing: '0.05em' }}>
                PILLAR 02
              </span>
              <h3 style={{ margin: 'var(--space-2) 0 var(--space-3)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                Deterministic Red Flag Engine
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                Critical clinical safety rules (RF-001 through RF-007) run deterministically outside the LLM. Red flags immediately escalate in the triage queue and must be acknowledged by the physician before FHIR export.
              </p>
            </div>

            {/* Pillar 3 */}
            <div style={{
              padding: 'var(--space-6)',
              borderTop: '2px solid var(--color-accent-700)',
              background: 'var(--color-surface)',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              borderInline: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-700)', letterSpacing: '0.05em' }}>
                PILLAR 03
              </span>
              <h3 style={{ margin: 'var(--space-2) 0 var(--space-3)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                Cryptographic Evidence Provenance
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                Every clinical fact links directly to its source: the exact voice audio timestamp, uploaded prescription snippet, or patient confirmation. Doctors can inspect origin evidence with a single tap.
              </p>
            </div>

            {/* Pillar 4 */}
            <div style={{
              padding: 'var(--space-6)',
              borderTop: '2px solid var(--color-routine)',
              background: 'var(--color-surface)',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              borderInline: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-routine-text)', letterSpacing: '0.05em' }}>
                PILLAR 04
              </span>
              <h3 style={{ margin: 'var(--space-2) 0 var(--space-3)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                ABDM & NAMASTE Native
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                Fully compliant with India's Ayushman Bharat Digital Mission (ABDM) and Ministry of Ayush NAMASTE morbidity codes. Dual-coded with SNOMED CT for universal clinical interoperability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FINAL INVITATION & CREDENTIALS ── */}
      <section style={{ paddingBlock: 'var(--space-20)', backgroundColor: 'var(--color-surface-subtle)' }}>
        <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
          
          <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
            Experience the System
          </span>
          
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            fontWeight: '700',
            lineHeight: '1.25',
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-4)'
          }}>
            Ready to see how pre-consultation case-taking elevates patient care?
          </h2>

          <p style={{
            fontSize: 'var(--font-size-base)',
            lineHeight: '1.65',
            color: 'var(--color-text-secondary)',
            maxWidth: '580px',
            margin: '0 auto var(--space-8)'
          }}>
            Launch a simulated patient session to experience the adaptive questioning loop, or log into the physician workstation to review live cases and FHIR bundles.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button size="lg" onClick={handleStartDemo} isLoading={demoLoading}>
              Launch Live Intake Session
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/doctor/login')}>
              Sign In to Physician Workstation
            </Button>
          </div>

          <div style={{ marginTop: 'var(--space-10)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Demo credentials for physicians: <code>dr.ayush</code> / <code>demo_password123</code>
          </div>
        </div>
      </section>
    </div>
  );
}
