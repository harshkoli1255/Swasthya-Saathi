import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      
      {/* ── 1. EDITORIAL HEADER ── */}
      <section style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: 'var(--space-4)' }}>
            Clinical Philosophy & Ethical Architecture
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 4vw, 3rem)',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.025em',
            margin: '0 0 var(--space-6)'
          }}>
            Restoring Depth to Traditional Outpatient Medicine.
          </h1>

          <p style={{
            fontSize: 'var(--font-size-lg)',
            lineHeight: '1.7',
            color: 'var(--color-text-secondary)',
            margin: '0 auto',
            maxWidth: '640px'
          }}>
            SwasthyaSaathi was created to solve a profound clinical paradox: traditional medicine requires deep, holistic patient understanding, yet outpatient doctors are forced into four-minute consultations.
          </p>
        </div>
      </section>

      {/* ── 2. ESSAY / CLINICAL STATEMENT ── */}
      <section style={{ paddingBlock: 'var(--space-16)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            
            {/* Chapter 1 */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Section 01
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                margin: 'var(--space-2) 0 var(--space-4)'
              }}>
                The Dilemma of the AYUSH Outpatient Department
              </h2>
              <div style={{ fontSize: 'var(--font-size-base)', lineHeight: '1.75', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p style={{ margin: 0 }}>
                  In Ayurveda, Unani, and Siddha clinical traditions, treating a patient requires understanding two inseparable realities: <em>Roga</em> (the specific disease pathology) and <em>Rogi</em> (the unique constitution, digestive strength, and environmental balance of the individual).
                </p>
                <p style={{ margin: 0 }}>
                  A classical examination explores <em>Agni</em> (the digestive fire), <em>Koshtha</em> (bowel tendencies), <em>Nidra</em> (sleep quality), <em>Satmya</em> (habituation and weather preferences), and <em>Ahara-Vihara</em> (dietary habits and daily regimen).
                </p>
                <p style={{ margin: 0 }}>
                  In today's public and private AYUSH outpatient clinics, a single physician routinely sees 60 to 120 patients in a single morning. A doctor cannot conduct a thorough constitutional inquiry while simultaneously measuring vitals, examining the patient, and writing administrative notes. The result is rushed case-taking and omitted constitutional context.
                </p>
              </div>
            </div>

            {/* Chapter 2 */}
            <div style={{ padding: 'var(--space-8)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-700)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Section 02 • Core Philosophy
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                margin: 'var(--space-2) 0 var(--space-4)'
              }}>
                "AI Assists. Physician Decides."
              </h2>
              <div style={{ fontSize: 'var(--font-size-base)', lineHeight: '1.75', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p style={{ margin: 0 }}>
                  We categorically reject the notion of the "AI doctor." Medical diagnosis and therapeutic prescription are sacred, high-stakes human responsibilities requiring clinical wisdom, empathy, and professional accountability.
                </p>
                <p style={{ margin: 0 }}>
                  SwasthyaSaathi operates strictly in the <strong>pre-consultation gap</strong>: the 15 to 30 minutes a patient spends sitting in the waiting area before their turn. By conducting an adaptive, multi-lingual intake during this idle time, the platform gathers symptom chronology and constitutional markers without consuming one second of the doctor's face-to-face consultation time.
                </p>
                <p style={{ margin: 0 }}>
                  When the patient walks into the examination room, the doctor already has an organized, synthesized case sheet with provenance-linked evidence. The doctor verifies the facts, conducts the physical exam, and makes all therapeutic decisions.
                </p>
              </div>
            </div>

            {/* Chapter 3 */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-700)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Section 03 • Architectural Safeguards
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                margin: 'var(--space-2) 0 var(--space-4)'
              }}>
                Four Architectural Safeguards
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                <div style={{ padding: 'var(--space-5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)' }}>
                  <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                    1. Deterministic Red Flags
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                    Acute clinical safety alerts (chest pain, stroke signs, severe hemorrhage, acute dyspnea) evaluate through deterministic pattern rules outside LLM control.
                  </p>
                </div>

                <div style={{ padding: 'var(--space-5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)' }}>
                  <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                    2. Explicit Patient Review
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                    Patients review all extracted facts in plain language and explicitly confirm accuracy before data transmits to the clinical queue.
                  </p>
                </div>

                <div style={{ padding: 'var(--space-5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)' }}>
                  <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                    3. Physician Verification Gate
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                    Facts remain flagged as unverified drafts until the attending physician reviews, modifies, or confirms them in the patient overview case sheet.
                  </p>
                </div>

                <div style={{ padding: 'var(--space-5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)' }}>
                  <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                    4. Dual-Coded FHIR R4
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                    Produces standards-compliant HL7 FHIR R4 Bundles mapped with SNOMED CT and Ministry of Ayush NAMASTE codes for seamless ABDM dispatch.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. BOTTOM ACTIONS ── */}
      <section style={{ paddingBlock: 'var(--space-16)', textAlign: 'center', backgroundColor: 'var(--color-surface-subtle)' }}>
        <div className="container-narrow">
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '700',
            margin: '0 0 var(--space-4)'
          }}>
            Explore the Clinical Platform
          </h3>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-6)', maxWidth: '480px', marginInline: 'auto' }}>
            Experience the patient intake flow or sign into the physician workstation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button size="lg" onClick={() => navigate('/')}>
              Return to Platform Overview
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/doctor/login')}>
              Physician Workstation
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
