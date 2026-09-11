import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';
import { ExtractedFact, ClinicalFactValue } from '@/types';

const HUMAN_SLOT_LABELS: Record<string, string> = {
  chief_complaint: 'Main Health Concern',
  duration: 'How Long It Has Been Occurring',
  severity: 'Severity / Discomfort Level',
  medical_history: 'Previous Medical Conditions',
  agni_digestion: 'Appetite & Digestion (Agni)',
  sleep_pattern: 'Sleep Quality (Nidra)',
  thermal_preference: 'Weather & Temperature Preference',
  lifestyle_diet: 'Dietary Habits & Daily Routine'
};

export function ReviewPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facts, setFacts] = useState<ExtractedFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      if (!token) return;
      try {
        const res = await apiClient.getReviewSummary(token);
        setFacts(res.facts);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    setIsSubmitting(true);
    setError('');
    try {
      await apiClient.confirmReview(token);
      navigate(`/intake/${token}/completion`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to confirm responses.');
      setIsSubmitting(false);
    }
  };

  const formatFactHuman = (value: ClinicalFactValue | Record<string, unknown> | string | undefined | null): string => {
    if (!value) return 'None reported';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if ('raw' in value && value.raw && typeof value.raw === 'string') {
        return value.raw;
      }
      if ('symptom' in value && value.symptom) {
        const parts = [String(value.symptom)];
        if (value.character) parts.push(`(${value.character})`);
        if (value.severity) parts.push(`- ${value.severity} severity`);
        return parts.join(' ');
      }
      if ('condition' in value && value.condition) {
        return String(value.condition === 'none' ? 'No prior chronic conditions' : value.condition);
      }
      if ('value' in value && value.value !== undefined) {
        return `${value.value} ${value.unit || 'days'}`.trim();
      }
      if ('level' in value && value.level) {
        return `${String(value.level).charAt(0).toUpperCase() + String(value.level).slice(1)} severity`;
      }
      if ('appetite' in value || 'digestion_issues' in value) {
        const items = [];
        if (value.appetite) items.push(`Appetite: ${value.appetite}`);
        if (value.digestion_issues) items.push(`Digestion: ${value.digestion_issues}`);
        if (value.bowel_regularity) items.push(`Bowel: ${value.bowel_regularity}`);
        return items.join(', ');
      }
      if ('quality' in value || 'morning_refreshment' in value) {
        const items = [];
        if (value.quality) items.push(`Sleep: ${value.quality}`);
        if (value.morning_refreshment) items.push(`Morning: ${value.morning_refreshment}`);
        return items.join(', ');
      }
      if ('preference' in value && value.preference) {
        return `Comfortable in: ${value.preference}`;
      }
      if ('diet_type' in value || 'meal_regularity' in value) {
        const items = [];
        if (value.diet_type) items.push(String(value.diet_type));
        if (value.meal_regularity) items.push(String(value.meal_regularity));
        return items.join(', ');
      }
    }
    return String(value);
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-850)', animation: 'spin 0.8s linear infinite' }}></div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Organizing your case summary...</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: 'var(--space-6)' }}>
      
      {/* Review Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
          Step 4 of 4 • Final Patient Review
        </span>
        
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)',
          lineHeight: '1.25'
        }}>
          Here is what we noted for your doctor.
        </h1>

        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          Please review your health answers before sending them securely to the physician's workstation.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'var(--color-emergency-bg)',
          color: 'var(--color-emergency-text)',
          border: '1px solid var(--color-emergency-border)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-3)',
          fontSize: 'var(--font-size-xs)',
          marginBottom: 'var(--space-4)'
        }}>
          {error}
        </div>
      )}

      {/* Human Fact Review List (Clean, Open, No Heavy Borders) */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-subtle)',
        marginBottom: 'var(--space-6)',
        overflow: 'hidden'
      }}>
        {facts.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            No symptoms recorded during this session.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {facts.map((fact, idx) => (
              <div 
                key={idx}
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  borderTop: idx > 0 ? '1px solid var(--color-border-subtle)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                    {HUMAN_SLOT_LABELS[fact.slot] || fact.slot.replace(/_/g, ' ')}
                  </span>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', lineHeight: '1.5' }}>
                    {formatFactHuman(fact.value)}
                  </p>
                </div>

                <span style={{ fontSize: '10px', color: 'var(--color-primary-850)', background: 'var(--color-primary-50)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-primary-100)', flexShrink: 0 }}>
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/intake/${token}/documents`)}
        >
          Back
        </Button>
        <Button 
          size="lg" 
          isLoading={isSubmitting} 
          onClick={handleSubmit}
          style={{ flex: 1 }}
        >
          Confirm & Send to Doctor →
        </Button>
      </div>

    </div>
  );
}
