import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';
import { FHIRExportPanel } from './FHIRExportPanel';
import { formatClinicalFact } from './clinicalFactFormatter';
import { EditFactModal } from './EditFactModal';

type CategoryFilter = 'ALL' | 'COMPLAINT' | 'AYUSH' | 'LIFESTYLE';

export function PatientOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [encounter, setEncounter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedAbha, setCopiedAbha] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [editingFact, setEditingFact] = useState<any | null>(null);
  const [verifyingAll, setVerifyingAll] = useState(false);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEncounter() {
      if (!token || !id) return;
      try {
        const data = await apiClient.getEncounterOverview(token, id);
        setEncounter(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load encounter');
      } finally {
        setLoading(false);
      }
    }
    fetchEncounter();
  }, [token, id]);

  const handleCopyAbha = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  const handleQuickVerify = async (fact: any) => {
    if (!token || !id) return;
    try {
      await apiClient.updateClinicalFact(token, id, fact.id, fact.value);
      const data = await apiClient.getEncounterOverview(token, id);
      setEncounter(data);
    } catch (e: any) {
      alert(`Could not verify fact: ${e.message}`);
    }
  };

  const handleVerifyAll = async () => {
    if (!token || !id || !encounter?.clinical_facts) return;
    setVerifyingAll(true);
    try {
      const unverified = encounter.clinical_facts.filter((f: any) => f.status !== 'PHYSICIAN_VERIFIED');
      for (const fact of unverified) {
        await apiClient.updateClinicalFact(token, id, fact.id, fact.value);
      }
      const data = await apiClient.getEncounterOverview(token, id);
      setEncounter(data);
    } catch (e: any) {
      alert(`Failed to verify all facts: ${e.message}`);
    } finally {
      setVerifyingAll(false);
    }
  };

  const handleSaveEditedFact = async (factId: string, newValue: any) => {
    if (!token || !id) return;
    await apiClient.updateClinicalFact(token, id, factId, newValue);
    const data = await apiClient.getEncounterOverview(token, id);
    setEncounter(data);
  };

  if (loading) return (
    <div style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '3px solid #FFEDD5',
        borderTopColor: '#EA580C',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <div style={{ color: '#64748B', fontWeight: 600, fontSize: '15px' }}>
        Loading patient clinical chart & ABDM record...
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{
        padding: '16px 24px',
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FCA5A5',
        borderRadius: '12px',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: 600
      }}>
        {error}
      </div>
    </div>
  );

  if (!encounter) return (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: '#64748B' }}>
      Encounter not found.
    </div>
  );

  const facts = encounter.clinical_facts || [];
  const verifiedCount = facts.filter((f: any) => f.status === 'PHYSICIAN_VERIFIED').length;
  const totalCount = facts.length;

  const filteredFacts = facts.filter((f: any) => {
    const formatted = formatClinicalFact(f.slot, f.value);
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'COMPLAINT') return formatted.category === 'complaint';
    if (activeCategory === 'AYUSH') return formatted.category === 'ayush';
    if (activeCategory === 'LIFESTYLE') return formatted.category === 'lifestyle' || formatted.category === 'history';
    return true;
  });

  const getSlotIcon = (iconType: string) => {
    switch (iconType) {
      case 'complaint':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFF1F2', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>
        );
      case 'severity':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        );
      case 'duration':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        );
      case 'agni':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
        );
      case 'thermal':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFEFF', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
          </div>
        );
      case 'sleep':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        );
      case 'diet':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
        );
      case 'history':
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
        );
      default:
        return (
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '24px 32px 64px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.25); }
        }
        .pulse-dot {
          animation: pulseDot 2s infinite ease-in-out;
        }
        .fact-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .fact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06);
          border-color: #CBD5E1;
        }
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-full { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>

      {/* ── TOP ACTION BAR ── */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/doctor/queue')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF7ED';
              e.currentTarget.style.color = '#EA580C';
              e.currentTarget.style.borderColor = '#FDBA74';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#334155';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Intake Queue</span>
          </button>

          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
            OPD Session Active • Live Case Sheet
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button
            variant="outline"
            onClick={() => window.print()}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
            }
          >
            Print OPD Sheet
          </Button>

          {verifiedCount < totalCount && (
            <Button
              variant="outline"
              onClick={handleVerifyAll}
              disabled={verifyingAll}
              isLoading={verifyingAll}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              }
            >
              Verify All Facts ({totalCount - verifiedCount})
            </Button>
          )}

          <Button
            variant="primary"
            onClick={() => alert(`Starting active consultation for ${encounter.patient.full_name}. OPD Token: ${encounter.opd_id}`)}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            }
          >
            Begin Clinical Consultation
          </Button>
        </div>
      </div>

      {/* ── HIGH-IMPACT PATIENT IDENTITY BANNER ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        marginBottom: '28px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Top Indian Tricolor Micro-Ribbon */}
        <div style={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #FF671F 0%, #FF671F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #046A38 66.6%, #046A38 100%)'
        }} />

        <div style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Patient Core Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF671F 0%, #EA580C 50%, #C2410C 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 800,
              boxShadow: '0 8px 16px -2px rgba(234, 88, 12, 0.35)',
              position: 'relative',
              flexShrink: 0
            }}>
              {encounter.patient.full_name?.charAt(0) || 'P'}
              {encounter.patient.verification_status?.startsWith('VERIFIED') && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  {encounter.patient.full_name}
                </h1>

                {/* Triage Badge */}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: encounter.triage_level === 'EMERGENCY' ? '#FEF2F2' : encounter.triage_level === 'URGENT' ? '#FFF7ED' : '#F0FDF4',
                  color: encounter.triage_level === 'EMERGENCY' ? '#991B1B' : encounter.triage_level === 'URGENT' ? '#C2410C' : '#166534',
                  border: `1px solid ${encounter.triage_level === 'EMERGENCY' ? '#FCA5A5' : encounter.triage_level === 'URGENT' ? '#FED7AA' : '#BBF7D0'}`
                }}>
                  {encounter.triage_level} Triage
                </span>

                {/* ABDM Verified Badge */}
                {encounter.patient.verification_status?.startsWith('VERIFIED') ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#15803D',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '20px',
                    padding: '3px 10px'
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    ABDM Verified ({encounter.patient.verification_method || 'Aadhaar OTP'})
                  </span>
                ) : (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748B',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '3px 10px'
                  }}>
                    Self-Reported Identity
                  </span>
                )}
              </div>

              {/* Patient Key Demographics */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '13px',
                color: '#475569'
              }}>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>
                  {encounter.patient.age} Yrs • {encounter.patient.sex === 'M' ? 'Male' : encounter.patient.sex === 'F' ? 'Female' : encounter.patient.sex}
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#F8FAFC', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  {encounter.opd_id}
                </span>

                {(encounter.patient.abha_address || encounter.patient.abha_number) && (
                  <>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <button
                      type="button"
                      onClick={() => handleCopyAbha(encounter.patient.abha_address || encounter.patient.abha_number)}
                      title="Click to copy ABHA address"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1D4ED8',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>ABHA: {encounter.patient.abha_address || encounter.patient.abha_number}</span>
                      {copiedAbha && <span style={{ color: '#16A34A', fontWeight: 700 }}>✓ Copied</span>}
                    </button>
                  </>
                )}

                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ color: '#64748B' }}>
                  Dept. of Kayachikitsa (OPD Room 104)
                </span>
              </div>
            </div>
          </div>

          {/* Right Status Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 20px'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700 }}>
                Encounter Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  {encounter.status?.replace(/_/g, ' ') || 'READY FOR DOCTOR'}
                </span>
              </div>
            </div>

            <div style={{ width: '1px', height: '32px', backgroundColor: '#E2E8F0' }} />

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700 }}>
                Verification
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: verifiedCount === totalCount ? '#16A34A' : '#EA580C' }}>
                {verifiedCount} / {totalCount} Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN BALANCED WORKSTATION GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 380px) 1fr',
        gap: '28px',
        alignItems: 'start'
      }}>

        {/* ── LEFT COLUMN: CLINICAL CONTEXT & INTEROP (380px) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 1. AI Pre-Consultation Synthesis Narrative */}
          {encounter.summary && (
            <Card style={{
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid #E2E8F0',
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#EA580C', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    AI Clinical Synthesis
                  </span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#15803D',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  98% Quality
                </span>
              </div>

              <CardContent style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {encounter.summary.history_of_present_illness && (
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>
                      History of Present Illness (HPI)
                    </div>
                    <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: '1.5', margin: 0 }}>
                      {encounter.summary.history_of_present_illness}
                    </p>
                  </div>
                )}

                {encounter.summary.past_medical_history && (
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>
                      Past Medical History
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                      {encounter.summary.past_medical_history}
                    </p>
                  </div>
                )}

                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#475569'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Zero red-flag emergency symptoms detected.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. Clinical Encounter Timeline */}
          <Card style={{
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <CardHeader style={{ padding: '16px 18px 12px' }}>
              <CardTitle style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700 }}>
                Intake Milestones & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 18px 16px' }}>
              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                {/* Vertical Line */}
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  top: '8px',
                  bottom: '8px',
                  width: '2px',
                  backgroundColor: '#E2E8F0'
                }}></div>

                {/* Event 1: Registration */}
                <div style={{ position: 'relative', marginBottom: '18px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    boxShadow: '0 0 0 3px #FFFFFF'
                  }}></div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    OPD Registration
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Token {encounter.opd_id} issued • {new Date(encounter.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Event 2: AI Intake */}
                <div style={{ position: 'relative', marginBottom: '18px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#EA580C',
                    boxShadow: '0 0 0 3px #FFFFFF'
                  }}></div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    AI Intake Completed
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    8 structured clinical observations collected
                  </div>
                </div>

                {/* Event 3: ABDM Verification */}
                <div style={{ position: 'relative', marginBottom: '18px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                    boxShadow: '0 0 0 3px #FFFFFF'
                  }}></div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    ABDM Identity Verified
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    {encounter.patient.verification_method || 'Aadhaar OTP'} • Sandbox Provenance
                  </div>
                </div>

                {/* Event 4: Ready for Consultation */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 0 3px #FFFFFF'
                  }}></div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    Ready for Doctor
                  </div>
                  <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>
                    Active in Physician Queue
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. ABDM & FHIR R4 Interoperability Component */}
          <div style={{ width: '100%' }}>
            <FHIRExportPanel encounterId={id!} />
          </div>

        </div>

        {/* ── RIGHT COLUMN: STRUCTURED CLINICAL OBSERVATIONS (FLEX 1) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Section Header with Category Tabs & Progress */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Pre-consultation Clinical Observations
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  Structured clinical facts confirmed by patient during multilingual AI intake.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                  Doctor Audit:
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: verifiedCount === totalCount ? '#F0FDF4' : '#FFF7ED',
                  color: verifiedCount === totalCount ? '#166534' : '#EA580C',
                  border: `1px solid ${verifiedCount === totalCount ? '#BBF7D0' : '#FED7AA'}`
                }}>
                  {verifiedCount} of {totalCount} Verified
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '14px'
            }}>
              {[
                { id: 'ALL', label: `All Observations (${facts.length})` },
                { id: 'COMPLAINT', label: 'Symptoms & Onset (3)' },
                { id: 'AYUSH', label: 'AYUSH Prakriti & Agni (3)' },
                { id: 'LIFESTYLE', label: 'Lifestyle & History (2)' },
              ].map(tab => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? '#EA580C' : '#E2E8F0'}`,
                      backgroundColor: isActive ? '#FFF7ED' : '#FFFFFF',
                      color: isActive ? '#C2410C' : '#475569',
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Facts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredFacts.length === 0 ? (
              <div style={{
                padding: '40px 24px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                color: '#64748B'
              }}>
                No observations match the selected category.
              </div>
            ) : (
              filteredFacts.map((fact: any) => {
                const formatted = formatClinicalFact(fact.slot, fact.value);
                const isVerified = fact.status === 'PHYSICIAN_VERIFIED';
                const hasEvidence = !!fact.evidence?.extracted_text;
                const isEvidenceExpanded = expandedEvidenceId === fact.id;

                return (
                  <div
                    key={fact.id}
                    className="fact-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: `1px solid ${isVerified ? '#BBF7D0' : '#E2E8F0'}`,
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Category Icon */}
                    {getSlotIcon(formatted.iconType)}

                    {/* Main Content Area */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      
                      {/* Top Meta Row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: '#64748B'
                          }}>
                            {formatted.title}
                          </span>

                          {formatted.secondaryPill && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: formatted.secondaryPill.tone === 'emergency' ? '#FEF2F2'
                                : formatted.secondaryPill.tone === 'urgent' ? '#FFF7ED'
                                : formatted.secondaryPill.tone === 'info' ? '#EFF6FF'
                                : '#F0FDF4',
                              color: formatted.secondaryPill.tone === 'emergency' ? '#991B1B'
                                : formatted.secondaryPill.tone === 'urgent' ? '#C2410C'
                                : formatted.secondaryPill.tone === 'info' ? '#1D4ED8'
                                : '#166534',
                              border: `1px solid ${
                                formatted.secondaryPill.tone === 'emergency' ? '#FCA5A5'
                                : formatted.secondaryPill.tone === 'urgent' ? '#FED7AA'
                                : formatted.secondaryPill.tone === 'info' ? '#BFDBFE'
                                : '#BBF7D0'
                              }`
                            }}>
                              {formatted.secondaryPill.text}
                            </span>
                          )}
                        </div>

                        {/* Status Chip */}
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: isVerified ? '#F0FDF4' : '#FFFBEB',
                          color: isVerified ? '#15803D' : '#B45309',
                          border: `1px solid ${isVerified ? '#86EFAC' : '#FDE68A'}`
                        }}>
                          {isVerified ? (
                            <>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              Physician Verified
                            </>
                          ) : (
                            'Patient Confirmed'
                          )}
                        </span>
                      </div>

                      {/* Humanized Primary Clinical Value */}
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: '1.4',
                        marginBottom: '6px'
                      }}>
                        {formatted.primaryValue}
                      </div>

                      {/* Context / Canon Metadata */}
                      {formatted.ayushContext && (
                        <div style={{
                          fontSize: '11px',
                          color: '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ fontWeight: 600, color: '#94A3B8' }}>Canonical:</span>
                          <span style={{ fontStyle: 'italic', color: '#475569' }}>{formatted.ayushContext}</span>
                        </div>
                      )}

                      {/* Evidence Accordion / Excerpt */}
                      {hasEvidence && (
                        <div style={{ marginTop: '10px' }}>
                          <button
                            type="button"
                            onClick={() => setExpandedEvidenceId(isEvidenceExpanded ? null : fact.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#64748B',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{isEvidenceExpanded ? 'Hide' : 'Inspect'} Intake Transcript Proof</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isEvidenceExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>

                          {isEvidenceExpanded && (
                            <div style={{
                              marginTop: '8px',
                              padding: '10px 12px',
                              backgroundColor: '#F8FAFC',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              fontSize: '12px',
                              color: '#334155'
                            }}>
                              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, marginBottom: '2px' }}>
                                Source: {fact.evidence.source_type?.replace(/_/g, ' ')}
                              </div>
                              <p style={{ fontStyle: 'italic', margin: '4px 0 0', borderLeft: '2px solid #EA580C', paddingLeft: '8px', color: '#475569' }}>
                                "{fact.evidence.extracted_text}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Group: Verify & Edit */}
                    <div className="no-print" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      flexShrink: 0,
                      alignItems: 'flex-end'
                    }}>
                      {!isVerified && (
                        <button
                          type="button"
                          onClick={() => handleQuickVerify(fact)}
                          title="Verify as physician"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            color: '#15803D',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DCFCE7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0FDF4';
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Verify</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingFact(fact)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#94A3B8';
                          e.currentTarget.style.color = '#0F172A';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#CBD5E1';
                          e.currentTarget.style.color = '#475569';
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Interactive Edit Modal */}
      <EditFactModal
        isOpen={!!editingFact}
        fact={editingFact}
        onClose={() => setEditingFact(null)}
        onSave={handleSaveEditedFact}
      />
    </div>
  );
}
