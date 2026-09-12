import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';
import { SIHShowcaseCarousel } from '@/components/home/SIHShowcaseCarousel';

export function HomePage() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

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
        borderBottom: '1px solid var(--color-border)',
        backgroundImage: 'var(--gradient-flag-diagonal)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
          
          {/* Left Column: Clear Clinical Introduction */}
          <div>
            <div className="editorial-eyebrow" style={{ marginBottom: 'var(--space-4)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary-600)', boxShadow: '0 0 6px rgba(255, 103, 31, 0.4)' }}></span>
              Ayush Digital Health Mission • Pre-Consultation Intelligence
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
              
              {import.meta.env.VITE_APP_SURFACE !== 'patient' ? (
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate('/doctor/login')}
                  style={{ paddingInline: 'var(--space-6)' }}
                >
                  Physician Workstation →
                </Button>
              ) : (
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate('/about')}
                  style={{ paddingInline: 'var(--space-6)' }}
                >
                  Clinical Architecture & Ethics →
                </Button>
              )}
            </div>

            {error && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-emergency)', margin: 'var(--space-2) 0 0' }}>
                {error}
              </p>
            )}

            {/* Core Standards Micro-strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              paddingTop: 'var(--space-5)',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              flexWrap: 'wrap'
            }}>
              <span><strong>Standard:</strong> AI Assists. Doctor Decides.</span>
              <span>•</span>
              <span>ABDM & NAMASTE Compliant</span>
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
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Top National Tricolor Micro-Accent */}
            <div style={{
              height: '4px',
              width: '100%',
              background: 'linear-gradient(90deg, #FF671F 0%, #FFA048 35%, #FFFFFF 50%, #138808 65%, #046A38 100%)'
            }} />

            {/* Institutional Clinical Encounter Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
              borderBottom: '1px solid var(--color-border)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {/* Left Encounter Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Live Pulse Indicator */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(22, 163, 74, 0.08)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    boxShadow: '0 0 6px #16A34A'
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#15803D',
                    textTransform: 'uppercase'
                  }}>
                    Live Case Sheet
                  </span>
                </div>

                {/* Encounter Code Badge */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#334155',
                  background: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  OPD-2026-4081
                </div>
              </div>

              {/* Right Side Physician Status Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: 'rgba(255, 103, 31, 0.08)',
                  border: '1px solid rgba(255, 103, 31, 0.25)',
                  color: 'var(--color-primary-900)',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  TOKEN #14
                </span>
                <span style={{
                  background: 'rgba(4, 106, 56, 0.08)',
                  border: '1px solid rgba(4, 106, 56, 0.25)',
                  color: '#046A38',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  READY FOR PHYSICIAN
                </span>
              </div>
            </div>

            {/* Inner Content of Preview */}
            <div style={{ padding: 'var(--space-5)' }}>
              
              {/* Patient Banner in Preview */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-4)',
                paddingBottom: 'var(--space-4)',
                borderBottom: '1px solid var(--color-border-subtle)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                      Meera Devi
                    </h4>
                    <span style={{
                      background: 'rgba(4, 106, 56, 0.08)',
                      border: '1px solid rgba(4, 106, 56, 0.25)',
                      color: '#046A38',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      ABHA VERIFIED
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    46y • Female • Ayush Kayachikitsa OPD • Room 104
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    CHIEF CONCERN
                  </span>
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 700,
                    color: 'var(--color-primary-900)',
                    background: 'rgba(255, 103, 31, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginTop: '2px'
                  }}>
                    Epigastric Burning & Heaviness
                  </span>
                </div>
              </div>

              {/* Narrative Summary Preview */}
              <div style={{
                marginBottom: 'var(--space-4)',
                background: '#FAFBFD',
                border: '1px solid #E2E8F0',
                borderLeft: '3px solid var(--color-primary-600)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    </svg>
                    Synthesized Clinical Narrative
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Hindi Audio • Verified
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                  Patient reports recurring epigastric burning for 3 weeks, aggravated within 45 minutes of post-lunch meals. Accompanied by disturbed sleep and mild morning fatigue. No history of melena, hematemesis, or acute dysphagia.
                </p>
              </div>

              {/* AYUSH Constitutional Quad */}
              <div>
                <span style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  marginBottom: 'var(--space-2)'
                }}>
                  AYUSH Constitutional Examination
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                  <div style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>AGNI (DIGESTION)</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '3px' }}>
                      Mandagni / Sluggish
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }} />
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>NIDRA (SLEEP)</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '3px' }}>
                      Khandita / Fragmented
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284C7' }} />
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>SATMYA (WEATHER)</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '3px' }}>
                      Sheeta Asahyata (Cold Sensitive)
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EA580C' }} />
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>AHARA (DIET)</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginTop: '3px' }}>
                      Irregular Meals • Spicy
                    </div>
                  </div>
                </div>
              </div>

              {/* Provenance Footer in Preview */}
              <div style={{
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: 'var(--color-text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🎙️ 4 Voice Turns</span>
                  <span>•</span>
                  <span>📄 1 Rx Scan</span>
                </span>
                <span style={{ color: 'var(--color-primary-850)', fontWeight: 'var(--font-weight-semibold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Verified Patient Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CORE INNOVATIONS SHOWCASE (CLEAN CAROUSEL) ── */}
      <SIHShowcaseCarousel />

      {/* ── 3. ARCHITECTURAL SAFETY & TRUST STRIP (COMPACT & UNCLUTTERED) ── */}
      <section style={{
        paddingBlock: 'var(--space-12)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {/* Trust Column 1 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(230, 81, 0, 0.1)',
                color: 'var(--color-primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Pre-Consultation Interval Only
                </h4>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                  Operates strictly before consultation. Never makes autonomous diagnoses or prescriptions.
                </p>
              </div>
            </div>

            {/* Trust Column 2 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Deterministic Red Flag Engine
                </h4>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                  Rules (RF-001..007) execute outside the LLM to prioritize emergency triage immediately.
                </p>
              </div>
            </div>

            {/* Trust Column 3 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Cryptographic Provenance
                </h4>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                  Every observation links to original audio timestamps or prescription scans with 1-tap review.
                </p>
              </div>
            </div>

            {/* Trust Column 4 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#F0FDF4',
                color: '#046A38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  ABDM & NAMASTE Native
                </h4>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                  Dual-coded HL7 FHIR R4 bundles compliant with Ministry of Ayush and Ayushman Bharat standards.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. STREAMLINED ACTION & DEMO CTA ── */}
      <section style={{
        paddingBlock: 'var(--space-16)',
        backgroundColor: 'var(--color-surface)',
        backgroundImage: 'var(--gradient-flag-diagonal)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-3)'
          }}>
            Experience SwasthyaSaathi Live
          </h2>

          <p style={{
            fontSize: 'var(--font-size-base)',
            lineHeight: '1.6',
            color: 'var(--color-text-secondary)',
            maxWidth: '520px',
            margin: '0 auto var(--space-6)'
          }}>
            Test the patient pre-consultation intake or sign into the physician workstation to review live triaged case sheets.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button size="lg" onClick={handleStartDemo} isLoading={demoLoading}>
              Launch Patient Intake
            </Button>
            {import.meta.env.VITE_APP_SURFACE !== 'patient' ? (
              <Button variant="secondary" size="lg" onClick={() => navigate('/doctor/login')}>
                Physician Workstation →
              </Button>
            ) : (
              <Button variant="secondary" size="lg" onClick={() => navigate('/about')}>
                Clinical Standards & Ethics →
              </Button>
            )}
          </div>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-secondary)',
              background: '#FFFFFF',
              border: '1px solid var(--color-border)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}>
              Demo Physician Login: <strong>dr.ayush</strong> / <strong>demo_password123</strong>
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
