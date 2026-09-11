import React, { useState, useEffect, useRef } from 'react';

interface SlideData {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}

const slides: SlideData[] = [
  {
    id: 'voice',
    tabLabel: '01 Voice Intake',
    badge: 'MULTILINGUAL INTAKE',
    title: 'Voice-to-Clinical Facts in 14+ Indian Languages',
    tagline: 'Bhashini & Indic Whisper ASR • Dialect Adaptation',
    description: 'Patients describe symptoms naturally in their regional language during the waiting room interval. SwasthyaSaathi extracts structured clinical facts while preserving the original voice recording.',
    bullets: [
      'Speaks in colloquial Hindi, Marathi, Bengali, Tamil, Telugu, and other Indian languages',
      'Dual-stream transcription preserves both vernacular audio and clinical English terms',
      'Tamper-evident audio timestamps provide proof of patient statements'
    ],
    image: '/carousel/sih_voice_intake.jpg',
    imageAlt: 'Indian patient speaking with healthcare worker holding intake tablet at clinic'
  },
  {
    id: 'safety',
    tabLabel: '02 Safety Radar',
    badge: 'ZERO-HALLUCINATION TRIAGE',
    title: 'Deterministic Red Flag Triage (RF-001 – RF-007)',
    tagline: 'Hardcoded Python Rules Running Ahead of Any LLM',
    description: 'Life-threatening symptoms bypass generative AI entirely. Hardcoded clinical safety rules immediately escalate urgent cases to the front of the physician queue.',
    bullets: [
      'Strict deterministic rulebook for acute chest pain, rigid abdomen, GI bleeding, and severe dyspnea',
      'Immediate queue escalation for Emergency (<2m) and Urgent (<15m) encounters',
      'Compulsory physician acknowledgment required before chart can be signed or exported'
    ],
    image: '/carousel/sih_safety_radar.jpg',
    imageAlt: 'Indian hospital triage counter with physician reviewing patient alerts'
  },
  {
    id: 'ayush',
    tabLabel: '03 AYUSH Matrix',
    badge: 'HOLISTIC ASSESSMENT',
    title: 'Rogi-Roga Pariksha: Agni, Nidra, Satmya & Koshtha',
    tagline: 'Overcomes the 4-Minute OPD Bottleneck for Classical Practice',
    description: 'Ayurveda requires examining both the condition (Roga) and the patient’s constitutional state (Rogi). SwasthyaSaathi captures foundational Ayurvedic parameters before the doctor consult.',
    bullets: [
      'Systematic assessment of Agni (metabolic fire) and Koshtha (bowel patterns)',
      'Nidra (sleep patterns) and Satmya (climatic and dietary habituation) profiling',
      'Mapped directly to Ministry of Ayush NAMASTE terminology for standardization'
    ],
    image: '/carousel/sih_ayush_analysis.jpg',
    imageAlt: 'Ayurvedic physician examining constitutional markers with patient'
  },
  {
    id: 'fhir',
    tabLabel: '04 ABDM & FHIR',
    badge: 'NATIONAL DIGITAL HEALTH',
    title: 'Dual-Coded FHIR R4 Bundles (NAMASTE + SNOMED CT)',
    tagline: 'NHA & Ayushman Bharat Digital Mission Interoperable',
    description: 'Every confirmed clinical observation receives dual terminology codes: international SNOMED CT / LOINC plus Ministry of Ayush National AYUSH Morbidity Codes (NAMASTE).',
    bullets: [
      '100% compliant HL7 FHIR R4 Document Bundle schema output',
      'Seamless electronic health record exchange across Indian hospital networks',
      'ECDSA-P256 tamper-evident digital signature ensures provenance authenticity'
    ],
    image: '/carousel/sih_abdm_fhir.jpg',
    imageAlt: 'Physician workstation with ABDM verified FHIR digital health record'
  },
  {
    id: 'doctor',
    tabLabel: '05 Doctor Decides',
    badge: 'CLINICAL GOVERNANCE',
    title: 'Physician Decides. AI Only Assists.',
    tagline: 'Doctor-in-the-Loop Authority • Zero Autonomous Diagnosis',
    description: 'The pre-consultation case sheet is presented as an editable clinical draft. Physicians can tap any observation to hear the patient’s exact recorded voice statement before verifying.',
    bullets: [
      'One-tap fact verification, inline reclassification, or clinical slot correction',
      'Audio & document origin evidence accessible with single-tap provenance viewer',
      'Audited clinical action logs compliant with Indian healthcare privacy guidelines'
    ],
    image: '/carousel/sih_doctor_authority.jpg',
    imageAlt: 'Indian physician reviewing verified case sheet on tablet workstation'
  }
];

export function SIHShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const SLIDE_DURATION = 6000; // 6.0s per slide

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
        paddingBlock: 'var(--space-16)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: '#FFFFFF',
        position: 'relative'
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="Core Clinical Innovations Showcase"
    >
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* ── SECTION HEADER (CLEAN & MINIMAL) ── */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(230, 81, 0, 0.08)',
            border: '1px solid rgba(230, 81, 0, 0.22)',
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-2)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary-600)' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-primary-900)', textTransform: 'uppercase' }}>
              Core Innovations
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-2)'
          }}>
            Built for High-Volume Indian Outpatient Clinics
          </h2>

          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            How SwasthyaSaathi bridges the gap between quick outpatient visits and thorough, holistic AYUSH healthcare.
          </p>
        </div>

        {/* ── CLEAN SLIDE NAVIGATION TABS ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
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
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isActive ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                  background: isActive ? 'var(--gradient-primary)' : 'var(--color-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(230, 81, 0, 0.25)' : 'none'
                }}
              >
                {s.tabLabel}
              </button>
            );
          })}
        </div>

        {/* ── MAIN SLIDE CARD ── */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Top Tricolor Progress Bar */}
          <div style={{ width: '100%', height: '3px', background: '#F1F5F9', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF671F 0%, #E65100 60%, #046A38 100%)',
              transition: isAutoPlaying ? 'width 50ms linear' : 'none'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'center',
            padding: 'var(--space-8)'
          }}>

            {/* Left: Clean Framed Photograph */}
            <div>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
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
              </div>

              {/* Single Clean Tagline Under Image */}
              <div style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary-600)' }} />
                <span>{current.tagline}</span>
              </div>
            </div>

            {/* Right: Crisp, High-Contrast Clinical Information */}
            <div>
              <div style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-primary-700)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                {current.badge}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'var(--color-text-primary)',
                margin: '0 0 10px'
              }}>
                {current.title}
              </h3>

              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                margin: '0 0 var(--space-4)'
              }}>
                {current.description}
              </p>

              {/* 3 Punchy Bullets */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {current.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.45 }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(230, 81, 0, 0.1)',
                      color: 'var(--color-primary-700)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
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

              {/* Navigation Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: '#FFFFFF',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: '#FFFFFF',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    →
                  </button>
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: '#FFFFFF',
                      color: 'var(--color-text-secondary)',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {isAutoPlaying ? 'Pause' : 'Auto-play'}
                  </button>
                </div>

                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
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
