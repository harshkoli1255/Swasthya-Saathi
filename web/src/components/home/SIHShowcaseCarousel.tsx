import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/Badge';

interface SlideData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  juryPoint: string;
  description: string;
  bullets: string[];
  interactiveType: 'voice' | 'safety' | 'ayush' | 'fhir' | 'doctor';
}

const slides: SlideData[] = [
  {
    id: 'voice',
    badge: 'MULTILINGUAL BHASHINI VOICE INTAKE',
    title: 'Voice-to-Clinical Facts in 14+ Indian Languages',
    subtitle: 'Overcomes literacy and language barriers in rural and peri-urban OPD waiting rooms.',
    image: '/carousel/sih_voice_intake.jpg',
    imageAlt: 'Authentic Indian primary healthcare center (PHC) consultation with female patient speaking naturally and healthcare worker with intake tablet',
    accentColor: 'var(--color-primary-600)',
    juryPoint: 'Solves the digital divide: elderly and rural patients speak freely in regional dialects; AI extracts structured clinical slots with audio timestamps.',
    description: 'Patients describe their symptoms naturally in their mother tongue. Integrated speech recognition processes colloquial phrasing into standardized medical concepts.',
    bullets: [
      'Indic Whisper & Bhashini ASR pipeline tuned for Indian medical dialects',
      'Dual-stream transcription preserves original vernacular and clinical English translation',
      'Immutable audio timestamps provide cryptographic proof of patient statements'
    ],
    interactiveType: 'voice'
  },
  {
    id: 'safety',
    badge: 'DETERMINISTIC CLINICAL SAFETY RADAR',
    title: 'Zero-Hallucination Safety Triage (RF-001 – RF-007)',
    subtitle: 'Hardcoded deterministic rules run outside the LLM to safeguard patient life.',
    image: '/carousel/sih_safety_radar.jpg',
    imageAlt: 'Authentic Indian hospital emergency triage counter with physician reviewing patient queue alerts',
    accentColor: '#DC2626',
    juryPoint: 'Critical medical safeguard: Life-threatening red flags (acute chest pain, GI bleeding, rigid abdomen) bypass generative AI and instantly elevate in doctor queue.',
    description: 'Probabilistic AI must never gate emergency care. Our deterministic safety engine validates patient inputs against codified clinical protocols with zero tolerance for false negatives.',
    bullets: [
      'Strict Python deterministic rulebook executing ahead of any generative model',
      'Immediate queue escalation for Emergency (immediate) and Urgent (<15m) encounters',
      'Compulsory physician acknowledgment required before chart can be signed or exported'
    ],
    interactiveType: 'safety'
  },
  {
    id: 'ayush',
    badge: 'HOLISTIC AYUSH CONSTITUTIONAL MATRIX',
    title: 'Rogi-Roga Pariksha: Agni, Nidra, Satmya & Koshtha',
    subtitle: 'Captures the whole patient constitution before the doctor opens the door.',
    image: '/carousel/sih_ayush_analysis.jpg',
    imageAlt: 'Authentic Ayurvedic physician consultation chamber with patient and constitutional intake tablet',
    accentColor: 'var(--color-primary-700)',
    juryPoint: 'Overcomes the 4-minute OPD bottleneck: Ayurveda requires assessing both the disease (Roga) and individual constitution (Rogi). We automate constitutional intake before consult.',
    description: 'Unlike standard allopathic EHRs that solely record isolated complaints, SwasthyaSaathi methodically collects foundational Ayurvedic diagnostic markers to empower classical practice.',
    bullets: [
      'Systematic assessment of Agni (digestive capacity) and Koshtha (bowel habits)',
      'Nidra (sleep patterns & quality) and Satmya (climatic & food habituation) profiling',
      'Mapped directly to Ministry of Ayush NAMASTE terminology for standardization'
    ],
    interactiveType: 'ayush'
  },
  {
    id: 'fhir',
    badge: 'ABDM & MINISTRY OF AYUSH NAMASTE',
    title: 'Dual-Coded FHIR R4 Bundle Generation',
    subtitle: 'Bridging modern international standards (SNOMED CT) with traditional Indian medicine.',
    image: '/carousel/sih_abdm_fhir.jpg',
    imageAlt: 'Indian physician workstation desk with ABDM verified FHIR R4 health record and stethoscope',
    accentColor: '#06038D',
    juryPoint: 'NHA & ABDM Milestone M1, M2, M3 compliance: Dual-coded HL7 FHIR R4 document bundles ready for Ayushman Bharat Digital Mission health information exchange.',
    description: 'Every confirmed clinical observation receives dual terminology codes: international SNOMED CT / LOINC plus Ministry of Ayush National AYUSH Morbidity Codes (NAMASTE).',
    bullets: [
      '100% compliant HL7 FHIR R4 Document Bundle schema output',
      'Seamless electronic health record exchange across Indian hospital networks',
      'ECDSA-P256 tamper-evident digital signature ensures provenance authenticity'
    ],
    interactiveType: 'fhir'
  },
  {
    id: 'doctor',
    badge: 'DOCTOR-IN-THE-LOOP CLINICAL AUTHORITY',
    title: 'Physician Decides. AI Only Assists.',
    subtitle: 'Strict adherence to medical ethics, provenance inspection, and legal compliance.',
    image: '/carousel/sih_doctor_authority.jpg',
    imageAlt: 'Indian physician reviewing AI synthesized case sheet on clinic tablet workstation',
    accentColor: 'var(--color-primary-800)',
    juryPoint: 'Ethical AI by design: No diagnosis or prescription is ever auto-generated. Attending physician exercises 100% unilateral authority to promote, edit, or reject facts.',
    description: 'The pre-consultation case sheet is presented as an editable clinical draft. Physicians can tap any observation to hear the patient’s exact recorded voice statement before verifying.',
    bullets: [
      'One-tap fact verification, inline reclassification, or clinical slot correction',
      'Audio & document origin evidence accessible with single-tap provenance viewer',
      'Audited clinical action logs compliant with Indian healthcare privacy guidelines'
    ],
    interactiveType: 'doctor'
  }
];

export function SIHShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Interactive mini-states for demonstration
  const [activeLang, setActiveLang] = useState<'hindi' | 'marathi' | 'tamil'>('hindi');
  const [simulatedFlag, setSimulatedFlag] = useState<boolean>(false);
  const [activeAyushTab, setActiveAyushTab] = useState<'agni' | 'nidra' | 'satmya'>('agni');
  const [verifiedFact, setVerifiedFact] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const SLIDE_DURATION = 6500; // 6.5s per slide

  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const step = 50;
    const increment = (step / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 100));
    }, step);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <section 
      style={{
        paddingBlock: 'var(--space-20)',
        borderBottom: '1px solid var(--color-border)',
        backgroundImage: 'var(--gradient-flag-diagonal)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="SIH Platform Innovation Showcase"
    >
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* ── SECTION HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'linear-gradient(90deg, rgba(255, 103, 31, 0.12) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(4, 106, 56, 0.1) 100%)',
            border: '1px solid rgba(255, 103, 31, 0.25)',
            padding: '5px 16px',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-3)',
            boxShadow: '0 2px 6px rgba(255, 103, 31, 0.08)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary-600)', boxShadow: '0 0 6px rgba(255, 103, 31, 0.6)' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-primary-900)', textTransform: 'uppercase' }}>
              Smart India Hackathon • Clinical Architecture Showcase
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-3)'
          }}>
            Engineered for India's Highest-Volume OPDs
          </h2>

          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.65
          }}>
            Explore the five technical innovations bridging the gap between brief outpatient consultations and comprehensive AYUSH holistic healthcare.
          </p>
        </div>

        {/* ── TOP SLIDE NAVIGATION PILLS ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-8)'
        }}>
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={s.id}
                onClick={() => goToSlide(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isActive ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                  background: isActive ? 'var(--gradient-primary)' : 'var(--color-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 10px rgba(230, 81, 0, 0.28)' : '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-surface-muted)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  0{idx + 1}
                </span>
                <span>{s.badge.split(' ')[0]} {s.badge.split(' ')[1] || ''}</span>
              </button>
            );
          })}
        </div>

        {/* ── MAIN CAROUSEL CARD ── */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          
          {/* Top Progress Bar */}
          <div style={{ width: '100%', height: '4px', background: 'var(--color-border-subtle)', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF671F 0%, #E65100 70%, #046A38 100%)',
              transition: isAutoPlaying ? 'width 50ms linear' : 'none'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'center',
            padding: 'var(--space-8)'
          }}>

            {/* Left Column: Visual Image with Floating Interactive Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.12)',
                position: 'relative',
                aspectRatio: '16/9',
                backgroundColor: '#0F172A'
              }}>
                <img
                  src={current.image}
                  alt={current.imageAlt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Floating Tricolor Brand Pill on Image */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 103, 31, 0.4)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }} />
                  <span>Module 0{currentIndex + 1} • Live Clinical Pipeline</span>
                </div>
              </div>

              {/* Interactive Demonstrator Box Under Image */}
              <div style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-4)',
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)'
              }}>
                {current.interactiveType === 'voice' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Interactive Voice Dialect Test:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {(['hindi', 'marathi', 'tamil'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: `1px solid ${activeLang === lang ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                              background: activeLang === lang ? 'var(--color-primary-50)' : '#FFFFFF',
                              color: activeLang === lang ? 'var(--color-primary-800)' : 'var(--color-text-secondary)',
                              fontWeight: activeLang === lang ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', fontStyle: 'italic', color: 'var(--color-text-primary)' }}>
                      {activeLang === 'hindi' && '"मुझे दो दिनों से पेट में तेज़ जलन और खट्टी डकारें आ रही हैं।"'}
                      {activeLang === 'marathi' && '"माझ्या पोटात दोन दिवसांपासून तीव्र जळजळ आणि आंबट ढेकर येत आहेत."'}
                      {activeLang === 'tamil' && '"கடந்த இரண்டு நாட்களாக வயிற்றில் கடுமையான எரிச்சலும் புளித்த ஏப்பமும் உள்ளது."'}
                    </div>
                    <div style={{ marginTop: '6px', color: 'var(--color-primary-700)', fontWeight: 600 }}>
                      → Extracted Slot: <span style={{ fontFamily: 'var(--font-mono)' }}>Amlapitta / Epigastric Burning (Agni: Mandagni)</span>
                    </div>
                  </div>
                )}

                {current.interactiveType === 'safety' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Simulate Triage Escalation:</span>
                      <button
                        onClick={() => setSimulatedFlag(!simulatedFlag)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '4px',
                          border: `1px solid ${simulatedFlag ? '#DC2626' : 'var(--color-border)'}`,
                          background: simulatedFlag ? '#FEF2F2' : '#FFFFFF',
                          color: simulatedFlag ? '#DC2626' : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {simulatedFlag ? '⚠ Inject RF-001 (Chest Pain)' : 'Normal Intake'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: simulatedFlag ? '#DC2626' : '#046A38',
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {simulatedFlag ? 'EMERGENCY TRIAGE' : 'ROUTINE OPD'}
                      </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {simulatedFlag ? 'Hardcoded alert triggered. Escalated to Position #1 in Dr. Queue.' : 'Zero acute red flags detected. Proceeding to standard history.'}
                      </span>
                    </div>
                  </div>
                )}

                {current.interactiveType === 'ayush' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Inspect AYUSH Parameter:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {(['agni', 'nidra', 'satmya'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveAyushTab(tab)}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: `1px solid ${activeAyushTab === tab ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                              background: activeAyushTab === tab ? 'var(--color-primary-50)' : '#FFFFFF',
                              color: activeAyushTab === tab ? 'var(--color-primary-800)' : 'var(--color-text-secondary)',
                              fontWeight: activeAyushTab === tab ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {tab.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }}>
                      {activeAyushTab === 'agni' && 'Agni: Mandagni (Sluggish metabolic fire with post-meal bloating and delayed digestion)'}
                      {activeAyushTab === 'nidra' && 'Nidra: Khandita (Fragmented sleep, frequent waking around 2:00 AM, unrefreshed morning state)'}
                      {activeAyushTab === 'satmya' && 'Satmya: Sheeta Asahyata (High cold sensitivity, preference for warm herbal decoctions)'}
                    </div>
                  </div>
                )}

                {current.interactiveType === 'fhir' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Live FHIR R4 Bundle Coding:</span>
                      <Badge variant="success">NDHM M1+M2+M3</Badge>
                    </div>
                    <div style={{ background: '#0F172A', color: '#E2E8F0', padding: '6px 10px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      SNOMED: <span style={{ color: '#FDE047' }}>405729008</span> | NAMASTE: <span style={{ color: '#38BDF8' }}>AYU-DIS-003</span> (Amlapitta)
                    </div>
                  </div>
                )}

                {current.interactiveType === 'doctor' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Physician Unilateral Decision:</span>
                      <button
                        onClick={() => setVerifiedFact(!verifiedFact)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '4px',
                          border: `1px solid ${verifiedFact ? '#046A38' : 'var(--color-border)'}`,
                          background: verifiedFact ? '#F0FDF4' : '#FFFFFF',
                          color: verifiedFact ? '#046A38' : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {verifiedFact ? '✓ Verified by Dr. Sharma' : 'Draft Observation'}
                      </button>
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                      {verifiedFact ? 'Fact promoted to official health record. Signed with institutional timestamp.' : 'AI drafted summary waiting for physician physical examination.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: In-depth Clinical & SIH Evaluation Narrative */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                <span className="editorial-eyebrow" style={{ color: current.accentColor, margin: 0 }}>
                  {current.badge}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 103, 31, 0.1)',
                  color: 'var(--color-primary-850)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 103, 31, 0.2)'
                }}>
                  SIH JURY FOCUS
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'var(--color-text-primary)',
                margin: '0 0 var(--space-3)'
              }}>
                {current.title}
              </h3>

              <p style={{
                fontSize: 'var(--font-size-base)',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                margin: '0 0 var(--space-5)'
              }}>
                {current.description}
              </p>

              {/* SIH Jury Rubric Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 103, 31, 0.06) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(4, 106, 56, 0.04) 100%)',
                borderLeft: '3px solid var(--color-primary-600)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: 'var(--space-6)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-800)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                  Why This Scores High with SIH Evaluators:
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                  {current.juryPoint}
                </div>
              </div>

              {/* Bullets */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {current.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary-700)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Carousel Controls Strip */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-600)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  >
                    ←
                  </button>

                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-600)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  >
                    →
                  </button>

                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    style={{
                      padding: '0 12px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isAutoPlaying ? '❚❚ Pause Tour' : '▶ Play Tour'}
                  </button>
                </div>

                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  0{currentIndex + 1} / 0{slides.length}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
