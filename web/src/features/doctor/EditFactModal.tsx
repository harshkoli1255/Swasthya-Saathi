import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { formatClinicalFact } from './clinicalFactFormatter';

interface EditFactModalProps {
  isOpen: boolean;
  fact: any | null;
  onClose: () => void;
  onSave: (factId: string, newValue: any) => Promise<void>;
}

export function EditFactModal({ isOpen, fact, onClose, onSave }: EditFactModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [textValue, setTextValue] = useState('');
  const [severityLevel, setSeverityLevel] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [durationValue, setDurationValue] = useState<number>(2);
  const [durationUnit, setDurationUnit] = useState<string>('days');
  const [hasNoMedicalHistory, setHasNoMedicalHistory] = useState(true);
  const [medicalHistoryText, setMedicalHistoryText] = useState('');

  useEffect(() => {
    if (!fact) return;
    setError('');
    const val = fact.value;

    if (fact.slot === 'severity') {
      const lvl = (typeof val === 'object' && val?.level) ? val.level.toLowerCase() : 'mild';
      setSeverityLevel(lvl === 'severe' ? 'severe' : lvl === 'moderate' ? 'moderate' : 'mild');
    } else if (fact.slot === 'duration') {
      if (typeof val === 'object' && val?.value !== undefined) {
        setDurationValue(Number(val.value) || 1);
        setDurationUnit(val.unit || 'days');
      } else {
        setDurationValue(2);
        setDurationUnit('days');
      }
    } else if (fact.slot === 'medical_history') {
      const cond = typeof val === 'object' ? (val?.condition || 'none') : String(val || 'none');
      if (cond === 'none' || cond === 'nil' || cond === 'no') {
        setHasNoMedicalHistory(true);
        setMedicalHistoryText('');
      } else {
        setHasNoMedicalHistory(false);
        setMedicalHistoryText(cond);
      }
    } else if (fact.slot === 'chief_complaint') {
      if (typeof val === 'object') {
        setTextValue(val?.symptom || val?.raw || '');
      } else {
        setTextValue(String(val || ''));
      }
    } else {
      if (typeof val === 'object' && val?.raw) {
        setTextValue(val.raw);
      } else if (typeof val === 'string') {
        setTextValue(val);
      } else {
        setTextValue(JSON.stringify(val));
      }
    }
  }, [fact]);

  if (!isOpen || !fact) return null;

  const formatted = formatClinicalFact(fact.slot, fact.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    let payloadValue: any = {};

    try {
      if (fact.slot === 'severity') {
        payloadValue = { level: severityLevel };
      } else if (fact.slot === 'duration') {
        payloadValue = { value: Number(durationValue), unit: durationUnit.toLowerCase() };
      } else if (fact.slot === 'medical_history') {
        payloadValue = hasNoMedicalHistory ? { condition: 'none' } : { condition: medicalHistoryText.trim() || 'none' };
      } else if (fact.slot === 'chief_complaint') {
        payloadValue = { symptom: textValue.trim() || 'Pain' };
      } else {
        payloadValue = { raw: textValue.trim() };
      }

      await onSave(fact.id, payloadValue);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update clinical fact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div 
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary-800)',
              marginBottom: '4px'
            }}>
              <span>Doctor Chart Review</span>
              <span>•</span>
              <span>{formatted.categoryLabel}</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Edit {formatted.title}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', marginBottom: 0 }}>
              Modifying this value marks it as <strong style={{ color: '#046A38' }}>Physician Verified</strong> in the clinical case sheet.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            {/* Current Value Pill */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Patient-Reported Value
                </div>
                <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: 600, marginTop: '2px' }}>
                  {formatted.primaryValue}
                </div>
              </div>
              {formatted.ayushContext && (
                <span style={{
                  fontSize: '11px',
                  color: 'var(--color-primary-800)',
                  backgroundColor: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-200)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 500
                }}>
                  {formatted.ayushContext}
                </span>
              )}
            </div>

            {/* Specialized Input Fields */}
            {fact.slot === 'severity' ? (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Select Clinical Severity
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {(['mild', 'moderate', 'severe'] as const).map(lvl => {
                    const isSelected = severityLevel === lvl;
                    const colorMap = {
                      mild: { bg: '#F0FDF4', border: '#86EFAC', text: '#166534', activeBg: '#16A34A' },
                      moderate: { bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412', activeBg: '#EA580C' },
                      severe: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', activeBg: '#DC2626' }
                    }[lvl];

                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverityLevel(lvl)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: `2px solid ${isSelected ? colorMap.activeBg : '#E2E8F0'}`,
                          backgroundColor: isSelected ? colorMap.bg : '#FFFFFF',
                          color: isSelected ? colorMap.text : '#475569',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '13px',
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: 700 }}>{lvl}</span>
                        <span style={{ fontSize: '11px', opacity: 0.8 }}>
                          {lvl === 'mild' ? 'Routine' : lvl === 'moderate' ? 'Significant' : 'High Priority'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : fact.slot === 'duration' ? (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Symptom Duration & Unit
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={durationValue}
                    onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            ) : fact.slot === 'medical_history' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Past Morbidities & History
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: hasNoMedicalHistory ? '#F0FDF4' : '#F8FAFC',
                  border: `1px solid ${hasNoMedicalHistory ? '#86EFAC' : '#E2E8F0'}`,
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={hasNoMedicalHistory}
                    onChange={(e) => {
                      setHasNoMedicalHistory(e.target.checked);
                      if (e.target.checked) setMedicalHistoryText('');
                    }}
                    style={{ width: '16px', height: '16px', accentColor: '#16A34A' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: hasNoMedicalHistory ? '#166534' : '#475569' }}>
                    No prior chronic medical conditions or major surgeries
                  </span>
                </label>

                {!hasNoMedicalHistory && (
                  <div>
                    <input
                      type="text"
                      placeholder="Specify past condition (e.g. Hypertension 5 yrs, Diabetes Type 2)..."
                      value={medicalHistoryText}
                      onChange={(e) => setMedicalHistoryText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Clinical Finding / Text
                </label>
                <textarea
                  rows={3}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Enter physician assessment..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
            >
              {saving ? 'Saving...' : 'Save & Verify Observation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
