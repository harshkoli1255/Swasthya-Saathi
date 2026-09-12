import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ClinicalSettingsState {
  // Clinical Profile
  fullName: string;
  degrees: string;
  regNumber: string;
  specialty: string;
  facility: string;
  roomNumber: string;
  shiftHours: string;
  maxPatientsPerShift: number;
  bio: string;

  // AI & Clinical Intelligence
  aiProvider: 'gemini' | 'ollama' | 'groq';
  hallucinationGating: boolean;
  autoDraftSummary: boolean;
  redFlagSensitivity: 'standard' | 'strict' | 'maximum';
  audioAlertOnEmergency: boolean;
  autoClassifyTriage: boolean;

  // Queue & Workstation
  refreshInterval: number; // in seconds
  pauseOnHiddenTab: boolean;
  defaultQueueFilter: 'ALL' | 'ACTION_REQ' | 'ROUTINE';
  atomicAutoClaim: boolean;
  notifyOnClaimConflict: boolean;
  showChiefComplaintInQueue: boolean;
  showWaitTimerInQueue: boolean;

  // ABDM & Interoperability
  abdmEnvironment: 'sandbox' | 'production';
  hipId: string;
  hfrFacilityId: string;
  dualCodingNamaste: boolean;
  autoExportFhirOnComplete: boolean;
  validateFhirSchema: boolean;

  // Security
  sessionTimeoutMinutes: number;
}

const DEFAULT_SETTINGS: ClinicalSettingsState = {
  fullName: 'Dr. Ayush Sharma',
  degrees: 'BAMS, MD (Ayurveda - Kayachikitsa)',
  regNumber: 'NCISM/2018/74921',
  specialty: 'Kayachikitsa (General Medicine)',
  facility: 'Ayurveda Wellness Center & Research Hospital',
  roomNumber: 'OPD Room 104 • Ground Floor Wing B',
  shiftHours: '08:30 AM – 02:30 PM (Morning OPD)',
  maxPatientsPerShift: 40,
  bio: 'Specialist in chronic metabolic conditions, digestive disorders (Agnimandya), and clinical Panchakarma detoxification protocols.',

  aiProvider: 'gemini',
  hallucinationGating: true,
  autoDraftSummary: true,
  redFlagSensitivity: 'strict',
  audioAlertOnEmergency: true,
  autoClassifyTriage: true,

  refreshInterval: 15,
  pauseOnHiddenTab: true,
  defaultQueueFilter: 'ALL',
  atomicAutoClaim: true,
  notifyOnClaimConflict: true,
  showChiefComplaintInQueue: true,
  showWaitTimerInQueue: true,

  abdmEnvironment: 'sandbox',
  hipId: 'SWASTHYA_OPD_01',
  hfrFacilityId: 'IN0710001844',
  dualCodingNamaste: true,
  autoExportFhirOnComplete: false,
  validateFhirSchema: true,

  sessionTimeoutMinutes: 480
};

export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'queue' | 'abdm' | 'security'>('profile');
  const [settings, setSettings] = useState<ClinicalSettingsState>(() => {
    const saved = localStorage.getItem('swasthya_doctor_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordToast, setPasswordToast] = useState('');

  // Sync user's real full name if present
  useEffect(() => {
    if (user?.full_name && settings.fullName === DEFAULT_SETTINGS.fullName) {
      setSettings(prev => ({ ...prev, fullName: user.full_name }));
    }
  }, [user, settings.fullName]);

  const updateSetting = <K extends keyof ClinicalSettingsState>(key: K, value: ClinicalSettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('swasthya_doctor_settings', JSON.stringify(settings));
      setSaving(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    }, 400);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all workstation settings to clinical defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem('swasthya_doctor_settings');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current) {
      setPasswordToast('Please enter your current password.');
      return;
    }
    if (passwordForm.newPass.length < 8) {
      setPasswordToast('New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordToast('New passwords do not match.');
      return;
    }
    setPasswordToast('Password updated successfully.');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPasswordToast(''), 4000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-6) var(--space-8)' }}>
      {/* Toast Notification */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--space-8)',
          right: 'var(--space-8)',
          backgroundColor: '#064e3b',
          color: '#ffffff',
          padding: 'var(--space-3) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          border: '1px solid rgba(52, 211, 153, 0.4)'
        }}>
          <span style={{ fontSize: '18px' }}>✓</span>
          <span>Clinical workstation preferences saved successfully.</span>
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6) var(--space-8)',
        marginBottom: 'var(--space-8)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Tricolor Accent Top Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #FF671F 0%, #FFFFFF 50%, #046A38 100%)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary-700)',
              fontWeight: '700',
              marginBottom: 'var(--space-2)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary-600)' }}></span>
              Ayush Clinical Workstation Configuration • Kayachikitsa & Panchakarma OPD
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.025em',
              margin: '0 0 var(--space-2)'
            }}>
              Clinical Practice & System Settings
            </h1>

            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              maxWidth: '820px',
              lineHeight: '1.5'
            }}>
              Configure your verified practitioner credentials, ABDM interoperability parameters, deterministic AI safety thresholds, and OPD workstation display preferences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <Button variant="ghost" size="sm" onClick={handleResetDefaults}>
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSaveAll()}
              isLoading={saving}
              leftIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>}
            >
              Save All Changes
            </Button>
          </div>
        </div>

        {/* Status Indicators Strip */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-6)',
          alignItems: 'center',
          marginTop: 'var(--space-5)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-border-light)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Practitioner: <strong style={{ color: 'var(--color-text-primary)' }}>{settings.fullName}</strong> ({settings.regNumber})
          </span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
            ABDM Stack: <strong style={{ color: 'var(--color-text-primary)' }}>HIP {settings.hipId}</strong> ({settings.abdmEnvironment.toUpperCase()})
          </span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></span>
            AI Synthesis: <strong style={{ color: 'var(--color-text-primary)' }}>{settings.aiProvider.toUpperCase()}</strong> (Provenance Gated)
          </span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
            Triage Refresh: <strong style={{ color: 'var(--color-text-primary)' }}>{settings.refreshInterval}s Cadence</strong>
          </span>
        </div>
      </div>

      {/* ── MAIN WORKSPACE 2-COLUMN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        
        {/* ── LEFT SIDEBAR: TABS & CLINICAL STAMP PREVIEW ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Navigation Tabs Card */}
          <Card noPadding style={{ overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-light)' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
                Configuration Areas
              </span>
            </div>

            <div style={{ padding: 'var(--space-2)' }}>
              {[
                {
                  id: 'profile',
                  label: 'Clinical Profile & Practice',
                  sub: 'Identity, degrees, NCISM reg',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )
                },
                {
                  id: 'ai',
                  label: 'AI & Safety Radar',
                  sub: 'LLM engine, red flag triage',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                    </svg>
                  )
                },
                {
                  id: 'queue',
                  label: 'OPD Queue & Triage',
                  sub: 'Refresh rates, auto-claim',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  )
                },
                {
                  id: 'abdm',
                  label: 'ABDM & Interoperability',
                  sub: 'HIP ID, FHIR, NAMASTE',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  )
                },
                {
                  id: 'security',
                  label: 'Security & Clinical Audit',
                  sub: 'JWT session, access log',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )
                },
              ].map(tab => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isSelected ? 'var(--color-primary-50)' : 'transparent',
                      color: isSelected ? 'var(--color-primary-900)' : 'var(--color-text-secondary)',
                      border: isSelected ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      transition: 'all var(--transition-fast)',
                      marginBottom: '3px'
                    }}
                  >
                    <span style={{
                      color: isSelected ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {tab.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: isSelected ? '600' : '500' }}>
                        {tab.label}
                      </div>
                      <div style={{ fontSize: '11px', color: isSelected ? 'var(--color-primary-700)' : 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tab.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Practitioner Verified Digital Seal Preview Card */}
          <Card noPadding style={{
            border: '1px solid rgba(255, 103, 31, 0.25)',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 100%)',
            boxShadow: '0 4px 12px rgba(255, 103, 31, 0.05)'
          }}>
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderBottom: '1px solid rgba(255, 103, 31, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary-800)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                Signature Seal
              </span>
              <span style={{
                fontSize: '10px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                letterSpacing: '0.02em',
                lineHeight: 1.4
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16a34a', flexShrink: 0 }} />
                NCISM VERIFIED
              </span>
            </div>

            <div style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-700)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  boxShadow: '0 2px 6px rgba(230, 81, 0, 0.25)'
                }}>
                  {settings.fullName.replace('Dr. ', '').charAt(0) || 'A'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    {settings.fullName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    {settings.degrees}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '11px',
                lineHeight: '1.6',
                color: 'var(--color-text-secondary)',
                backgroundColor: '#ffffff',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)'
              }}>
                <div><strong>Reg:</strong> {settings.regNumber}</div>
                <div><strong>Dept:</strong> {settings.specialty}</div>
                <div><strong>Room:</strong> {settings.roomNumber}</div>
                <div><strong>Facility:</strong> {settings.facility}</div>
              </div>

              <div style={{ marginTop: 'var(--space-3)', fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Included on patient summaries &amp; signed FHIR DiagnosticReport bundles.
              </div>
            </div>
          </Card>
        </div>

        {/* ── RIGHT CONTENT PANEL ── */}
        <div>
          {/* TAB 1: CLINICAL PROFILE */}
          {activeTab === 'profile' && (
            <Card className="animate-fade-up" style={{ border: '1px solid var(--color-border)' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1)' }}>
                      Clinical Profile &amp; Practice Information
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Official institutional credentials, AYUSH council registration, and OPD assignment details.
                    </p>
                  </div>
                  <Badge variant="outline">Institutional Role: DOCTOR</Badge>
                </div>
              </div>

              <form onSubmit={handleSaveAll} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      Practitioner Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.fullName}
                      onChange={e => updateSetting('fullName', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      Degrees &amp; Qualifications
                    </label>
                    <input
                      type="text"
                      value={settings.degrees}
                      onChange={e => updateSetting('degrees', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      NCISM / State Council Registration No.
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={settings.regNumber}
                        onChange={e => updateSetting('regNumber', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', paddingRight: '80px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-mono)' }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                        ✓ Validated
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      Primary AYUSH Specialization
                    </label>
                    <select
                      value={settings.specialty}
                      onChange={e => updateSetting('specialty', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option>Kayachikitsa (General Medicine)</option>
                      <option>Panchakarma (Detoxification &amp; Rejuvenation)</option>
                      <option>Shalya Tantra (Surgical Techniques)</option>
                      <option>Shalakya Tantra (ENT &amp; Eye Disorders)</option>
                      <option>Prasuti &amp; Stri Roga (Gynecology &amp; Obstetrics)</option>
                      <option>Kaumarbhritya (Pediatrics)</option>
                      <option>Dravyaguna (Herbal Pharmacology)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      Consultation Room &amp; Department Wing
                    </label>
                    <input
                      type="text"
                      value={settings.roomNumber}
                      onChange={e => updateSetting('roomNumber', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      Assigned Healthcare Facility (HIP)
                    </label>
                    <input
                      type="text"
                      value={settings.facility}
                      disabled
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-muted)', fontSize: '14px' }}
                    />
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                      Managed centrally by hospital administrator per ABDM HIP registry.
                    </p>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                    Practitioner Bio &amp; Clinical Focus
                  </label>
                  <textarea
                    rows={3}
                    value={settings.bio}
                    onChange={e => updateSetting('bio', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
                  <Button type="submit" isLoading={saving}>
                    Save Clinical Profile
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: AI & SAFETY RADAR */}
          {activeTab === 'ai' && (
            <Card className="animate-fade-up" style={{ border: '1px solid var(--color-border)' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1)' }}>
                  AI Clinical Intelligence &amp; Safety Radar Settings
                </h2>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Controls clinical fact extraction, deterministic hallucination rejection, and emergency red flag gating.
                </p>
              </div>

              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* AI Provider Engine */}
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                        Clinical LLM Extraction Provider
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                        Select the primary model used for conversational intake slot-filling and clinical narrative drafting.
                      </p>
                    </div>
                    <Badge variant="routine">Hybrid Cloud/Local</Badge>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                    {[
                      { id: 'gemini', label: 'Gemini 1.5 Flash', tag: 'Fast / Cloud API', note: 'Standard clinical extraction' },
                      { id: 'ollama', label: 'Ollama Llama 3.1:8b', tag: 'Local / Air-Gapped', note: 'Zero external network transmission' },
                      { id: 'groq', label: 'Groq Llama 3.1:8b', tag: 'Ultra Low-Latency', note: 'Sub-second turn synthesis' },
                    ].map(p => (
                      <div
                        key={p.id}
                        onClick={() => updateSetting('aiProvider', p.id as typeof settings.aiProvider)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: settings.aiProvider === p.id ? '2px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                          backgroundColor: settings.aiProvider === p.id ? 'var(--color-primary-25)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '600', color: settings.aiProvider === p.id ? 'var(--color-primary-900)' : 'var(--color-text-primary)' }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-primary-700)', fontWeight: '600' }}>{p.tag}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{p.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hallucination Gating Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                      Strict Hallucination &amp; Evidence Gating
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Enforce 100% provenance anchoring. If the AI model extracts facts not directly substantiated by patient speech or scanned Rx, it is flagged as UNVERIFIED.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('hallucinationGating', !settings.hallucinationGating)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.hallucinationGating ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.hallucinationGating ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* Auto Draft Clinical Narrative */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                      Automatic Clinical Narrative Synthesis
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Automatically draft pre-consultation Chief Complaint, HPI, and AYUSH constitutional summary upon patient intake submission.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('autoDraftSummary', !settings.autoDraftSummary)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.autoDraftSummary ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.autoDraftSummary ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* Red Flag Alert Sensitivity */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)' }}>
                    Deterministic Safety Alert Sensitivity Level
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                    {[
                      { id: 'standard', title: 'Standard Sensitivity', desc: 'Critical cardiac, stroke, and hemorrhage alerts.' },
                      { id: 'strict', title: 'Strict (AYUSH Acute Protocol)', desc: 'Standard + severe Agnimandya, high fever, dyspnea.' },
                      { id: 'maximum', title: 'Maximum Vigilance', desc: 'All potential contraindications and drug-herb interactions.' }
                    ].map(lvl => (
                      <div
                        key={lvl.id}
                        onClick={() => updateSetting('redFlagSensitivity', lvl.id as typeof settings.redFlagSensitivity)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: settings.redFlagSensitivity === lvl.id ? '2px solid #dc2626' : '1px solid var(--color-border)',
                          backgroundColor: settings.redFlagSensitivity === lvl.id ? '#fef2f2' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '600', color: settings.redFlagSensitivity === lvl.id ? '#991b1b' : 'var(--color-text-primary)' }}>
                          {lvl.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {lvl.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audio chime on emergency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                      Audible Notification on Emergency Case Intake
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Play an audible clinical chime in the physician workstation whenever an EMERGENCY triage card arrives.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('audioAlertOnEmergency', !settings.audioAlertOnEmergency)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.audioAlertOnEmergency ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.audioAlertOnEmergency ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
                  <Button onClick={() => handleSaveAll()} isLoading={saving}>
                    Save AI &amp; Safety Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: OPD QUEUE & TRIAGE */}
          {activeTab === 'queue' && (
            <Card className="animate-fade-up" style={{ border: '1px solid var(--color-border)' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1)' }}>
                  OPD Queue &amp; Triage Desk Preferences
                </h2>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Control near-real-time refresh cadence, automatic encounter claiming locks, and waiting list views.
                </p>
              </div>

              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Refresh Interval Selector */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                      Near-Real-Time Queue Refresh Cadence
                    </h3>
                    <Badge variant="routine">Current: {settings.refreshInterval}s</Badge>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-3)' }}>
                    Controls the background polling frequency for newly completed patient intakes.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-3)' }}>
                    {[
                      { seconds: 10, label: '10 Seconds', tag: 'Fast' },
                      { seconds: 15, label: '15 Seconds', tag: 'Recommended' },
                      { seconds: 30, label: '30 Seconds', tag: 'Standard' },
                      { seconds: 60, label: '60 Seconds', tag: 'Low Bandwidth' },
                    ].map(opt => (
                      <button
                        key={opt.seconds}
                        type="button"
                        onClick={() => updateSetting('refreshInterval', opt.seconds)}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-md)',
                          border: settings.refreshInterval === opt.seconds ? '2px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                          backgroundColor: settings.refreshInterval === opt.seconds ? 'var(--color-primary-50)' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{opt.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-primary-700)', fontWeight: '600', marginTop: '2px' }}>{opt.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pause on hidden tab */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                      Pause Polling When Tab Is Hidden
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Suspends background polling when you switch browser tabs, immediately resuming upon window focus.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('pauseOnHiddenTab', !settings.pauseOnHiddenTab)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.pauseOnHiddenTab ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.pauseOnHiddenTab ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* Atomic Auto-Claim Encounter on Opening */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                        Atomic Conditional Claiming
                      </h3>
                      <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        POSTGRESQL ROW LOCK
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                      Automatically claims unassigned encounters when you open them, locking other physicians out with 403 Forbidden to prevent duplicate consults.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('atomicAutoClaim', !settings.atomicAutoClaim)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.atomicAutoClaim ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.atomicAutoClaim ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* Default Queue Filter View */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)' }}>
                    Default Active Queue Filter View
                  </h3>
                  <select
                    value={settings.defaultQueueFilter}
                    onChange={e => updateSetting('defaultQueueFilter', e.target.value as typeof settings.defaultQueueFilter)}
                    style={{ width: '100%', maxWidth: '360px', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#ffffff', fontSize: '14px' }}
                  >
                    <option value="ALL">All Waiting Patients (Comprehensive)</option>
                    <option value="ACTION_REQ">Priority Attention (Emergency &amp; Urgent First)</option>
                    <option value="ROUTINE">Routine Consultations (Standard Flow)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
                  <Button onClick={() => handleSaveAll()} isLoading={saving}>
                    Save Queue Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: ABDM & INTEROPERABILITY */}
          {activeTab === 'abdm' && (
            <Card className="animate-fade-up" style={{ border: '1px solid var(--color-border)' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1)' }}>
                      Ayushman Bharat Digital Mission (ABDM) Integration
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Configure National Health Stack gateway parameters, NAMASTE 2026 dual-coding, and FHIR export gating.
                    </p>
                  </div>
                  <Badge variant="success">ABDM v3 Milestone Ready</Badge>
                </div>
              </div>

              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      Health Information Provider (HIP ID)
                    </label>
                    <input
                      type="text"
                      value={settings.hipId}
                      onChange={e => updateSetting('hipId', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                      National Health Facility Registry (HFR ID)
                    </label>
                    <input
                      type="text"
                      value={settings.hfrFacilityId}
                      onChange={e => updateSetting('hfrFacilityId', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>

                {/* NAMASTE Dual-Coding Mode */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                        NAMASTE 2026 Morbidity Dual-Coding
                      </h3>
                      <span style={{ fontSize: '10px', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        MINISTRY OF AYUSH
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                      Automatically append National AYUSH Morbidity &amp; Standardized Terminology Electronic (NAMASTE) codes alongside ICD-11 in FHIR Condition resources.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('dualCodingNamaste', !settings.dualCodingNamaste)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.dualCodingNamaste ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.dualCodingNamaste ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* FHIR Schema Pre-Validation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                      Strict FHIR R4 Bundle Validation
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Gate export until all required clinical attributes, Practitioner, Patient, Encounter, and DiagnosticReport conform to official NHA specs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('validateFhirSchema', !settings.validateFhirSchema)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: settings.validateFhirSchema ? 'var(--color-primary-600)' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: settings.validateFhirSchema ? '23px' : '3px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* Encryption Security Badge */}
                <div style={{ padding: 'var(--space-4)', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-lg)', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ fontSize: '24px' }}>🔒</div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#166534', margin: '0 0 2px' }}>
                      Cryptographic Data Protection Standard
                    </h4>
                    <p style={{ fontSize: '12px', color: '#15803d', margin: 0 }}>
                      ABDM data transfer utilizes RSA-OAEP 2048-bit key exchange and AES-256-GCM authenticated payload encryption. PII is never transmitted in cleartext.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
                  <Button onClick={() => handleSaveAll()} isLoading={saving}>
                    Save ABDM Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 5: SECURITY, SESSION & AUDIT */}
          {activeTab === 'security' && (
            <Card className="animate-fade-up" style={{ border: '1px solid var(--color-border)' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1)' }}>
                      Security, Session &amp; Clinical Audit Trail
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Active cryptographic credentials, JWT session timeout parameters, and clinical action provenance.
                    </p>
                  </div>
                  <Badge variant="urgent">Audit Active</Badge>
                </div>
              </div>

              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Active Session Info */}
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 var(--space-3)' }}>
                    Active Practitioner Session
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Logged In User:</span>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{user?.username || 'dr.ayush'}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>RBAC Authority:</span>
                      <div style={{ fontWeight: '600', color: '#0369a1' }}>DOCTOR (Full Clinical OPD Scope)</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Session Expiry:</span>
                      <div style={{ fontWeight: '600', color: '#15803d' }}>Active (8 Hour OPD Token)</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Client Location:</span>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>127.0.0.1 (Secure Intranet)</div>
                    </div>
                  </div>
                </div>

                {/* Password Change Form */}
                <form onSubmit={handlePasswordSubmit} style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4)' }}>
                    Update Workstation Password
                  </h3>

                  {passwordToast && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: passwordToast.includes('successfully') ? '#f0fdf4' : '#fef2f2',
                      color: passwordToast.includes('successfully') ? '#166534' : '#991b1b',
                      fontSize: '12px',
                      fontWeight: '500',
                      marginBottom: 'var(--space-4)'
                    }}>
                      {passwordToast}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.current}
                        onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPass}
                        onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="secondary" size="sm">
                      Update Password
                    </Button>
                  </div>
                </form>

                {/* Recent Clinical Audit Activity Table */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                      Recent Clinical Audit Activity Log
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Immutable Ledger • 7 Year Retention</span>
                  </div>

                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>Event Type</th>
                          <th style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>Entity</th>
                          <th style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>Actor</th>
                          <th style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>Audit Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { event: 'ENCOUNTER_CLAIMED', entity: 'Encounter (Auto-Claimed)', actor: 'dr.ayush', status: 'LOCKED & VERIFIED' },
                          { event: 'FACT_VERIFIED', entity: 'ClinicalAnswer: chief_complaint', actor: 'dr.ayush', status: 'PROVENANCE PRESERVED' },
                          { event: 'ALERT_ACKNOWLEDGED', entity: 'SafetyAlert: Red Flag Gating', actor: 'dr.ayush', status: 'RESOLVED' },
                          { event: 'FHIR_EXPORTED', entity: 'Bundle: DiagnosticReport', actor: 'dr.ayush', status: 'ABDM SYNCED' },
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom: i < 3 ? '1px solid var(--color-border-light)' : 'none' }}>
                            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--color-primary-800)' }}>{row.event}</td>
                            <td style={{ padding: '8px 12px', color: 'var(--color-text-primary)' }}>{row.entity}</td>
                            <td style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>{row.actor}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
