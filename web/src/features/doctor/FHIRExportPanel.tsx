import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';
import { FHIREligibilityResponse, FHIRExportRecord, FHIRExportResult } from '@/types';

export function FHIRExportPanel({ encounterId }: { encounterId: string }) {
  const { token } = useAuth();
  const [eligibility, setEligibility] = useState<FHIREligibilityResponse | null>(null);
  const [records, setRecords] = useState<FHIRExportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [exportResult, setExportResult] = useState<FHIRExportResult | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [eligRes, recRes] = await Promise.all([
        apiClient.getExportEligibility(token, encounterId).catch(() => null),
        apiClient.getExportRecords(token, encounterId).catch(() => [])
      ]);
      setEligibility(eligRes);
      setRecords(recRes);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || 'Failed to load FHIR export data');
      else setError('Failed to load FHIR export data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, encounterId]);

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    setError('');
    setExportResult(null);
    try {
      const result = await apiClient.exportFHIR(token, encounterId);
      setExportResult(result);
      loadData(); // Refresh history
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || 'Export failed');
      else setError('Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-6)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Checking FHIR & ABDM bundle eligibility...
        </div>
      </div>
    );
  }

  const hasConflicts = (eligibility?.unresolved_conflicts || 0) > 0;
  const isEligible = (eligibility?.eligible_resources?.length || 0) > 0 && !hasConflicts;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      padding: '18px 20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-primary-800)',
          marginBottom: '4px'
        }}>
          ABDM & FHIR R4 Interoperability
        </div>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#0F172A',
          margin: 0
        }}>
          National Health Stack Export
        </h3>
        <p style={{
          fontSize: '12px',
          color: '#64748B',
          marginTop: '4px',
          marginBottom: 0,
          lineHeight: '1.4'
        }}>
          Compiles confirmed clinical facts into signed NDHM-compliant FHIR R4 Bundles with NAMASTE ontology codes.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          {error}
        </div>
      )}

      {/* Resource Count Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '12px 14px',
        backgroundColor: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Eligible Resources</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            {eligibility?.eligible_resources?.length || 0}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Blocked / Unconfirmed</div>
          <div style={{
            fontSize: '18px',
            fontWeight: 800,
            color: (eligibility?.blocked_resources?.length || 0) > 0 ? '#C2410C' : '#64748B'
          }}>
            {eligibility?.blocked_resources?.length || 0}
          </div>
        </div>
      </div>

      {hasConflicts && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          background: 'var(--color-emergency-bg)',
          border: '1px solid rgba(176, 58, 46, 0.2)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-emergency-text)'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', lineHeight: '1.4' }}>
            Export blocked: {eligibility?.unresolved_conflicts} unresolved conflicting clinical assertions require physician reconciliation above.
          </span>
        </div>
      )}

      <Button 
        variant={isEligible ? 'primary' : 'outline'} 
        disabled={!isEligible || exporting}
        onClick={handleExport}
        fullWidth
        isLoading={exporting}
      >
        {exporting ? 'Generating FHIR Bundle...' : 'Export to ABDM / FHIR R4'}
      </Button>

      {exportResult && (
        <div style={{
          padding: 'var(--space-4)',
          background: exportResult.status === 'success' ? 'var(--color-routine-bg)' : 'var(--color-emergency-bg)',
          color: exportResult.status === 'success' ? 'var(--color-routine-text)' : 'var(--color-emergency-text)',
          border: `1px solid ${exportResult.status === 'success' ? 'rgba(39, 110, 80, 0.2)' : 'rgba(176, 58, 46, 0.2)'}`,
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>
            {exportResult.status === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            )}
            {exportResult.status === 'success' ? 'FHIR Bundle Exported Successfully' : 'Export Failed'}
          </div>
          {exportResult.reason && <div style={{ fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>{exportResult.reason}</div>}
          
          {exportResult.bundle && (
            <details style={{ marginTop: 'var(--space-3)' }}>
              <summary style={{ fontSize: '11px', cursor: 'pointer', fontWeight: 'var(--font-weight-semibold)', outline: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Inspect FHIR JSON Bundle</span>
                <span 
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(JSON.stringify(exportResult.bundle, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  style={{ color: 'var(--color-primary-800)', fontWeight: 'var(--font-weight-bold)', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {copied ? '✓ Copied' : 'Copy JSON'}
                </span>
              </summary>
              <div style={{
                marginTop: 'var(--space-2)',
                maxHeight: '180px',
                overflow: 'auto',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)'
              }}>
                <pre style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0, fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>
                  {JSON.stringify(exportResult.bundle, null, 2)}
                </pre>
              </div>
            </details>
          )}
        </div>
      )}

      {records.length > 0 && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-2)'
          }}>
            Export Audit Trail ({records.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {records.map((rec: FHIRExportRecord) => (
              <div key={rec.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--color-surface-hover)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {rec.created_at ? new Date(rec.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                </span>
                <Badge variant={rec.status === 'SUCCESS' ? 'success' : 'danger'} style={{ fontSize: '10px', padding: '1px 6px' }}>
                  {rec.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

