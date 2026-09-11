import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';
import { FHIRExportPanel } from './FHIRExportPanel';

export function PatientOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [encounter, setEncounter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleEditFact = async (factId: string, currentValue: any) => {
    const newValueStr = window.prompt("Edit clinical fact value (JSON):", JSON.stringify(currentValue));
    if (!newValueStr) return;
    
    try {
      const newValue = JSON.parse(newValueStr);
      if (!token || !id) return;
      await apiClient.updateClinicalFact(token, id, factId, newValue);
      const data = await apiClient.getEncounterOverview(token, id);
      setEncounter(data);
    } catch (e) {
      alert("Invalid JSON or update failed");
    }
  };

  const formatFactValue = (value: any) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.raw) return value.raw;
    return JSON.stringify(value);
  };

  if (loading) return (
    <div style={{ padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--color-primary-100)', borderTopColor: 'var(--color-primary-600)', animation: 'spin 1s linear infinite' }}></div>
      <div className="text-secondary font-medium">Loading patient chart...</div>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
      <div style={{ padding: 'var(--space-4)', background: 'var(--color-emergency-bg)', color: 'var(--color-emergency-text)', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
        {error}
      </div>
    </div>
  );
  
  if (!encounter) return (
    <div style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
      Encounter not found.
    </div>
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--space-6) var(--space-6)' }}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minHeight: '100%' }}>
        
        {/* Top App Bar - Context */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/queue')} leftIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>}>
              Back to Queue
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="outline">Print Summary</Button>
            <Button variant="primary">Begin Encounter</Button>
          </div>
        </div>

        {/* Patient Identity Banner */}
        <Card style={{ backgroundColor: 'var(--color-primary-900)', color: 'var(--color-text-inverse)', borderColor: 'var(--color-primary-900)' }}>
          <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-800)', color: 'var(--color-primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
                {encounter.patient.full_name.charAt(0)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-1)' }}>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>{encounter.patient.full_name}</h1>
                  <Badge variant={encounter.triage_level.toLowerCase() as any}>{encounter.triage_level}</Badge>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-300)' }}>
                  <span>{encounter.patient.age}y • {encounter.patient.sex}</span>
                  <span style={{ opacity: 0.5 }}>|</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{encounter.opd_id}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', padding: 'var(--space-3) var(--space-6)', backgroundColor: 'var(--color-primary-800)', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary-50)' }}>{encounter.status.replace(/_/g, ' ')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Clinical Content - 3 Column Layout */}
        <div style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, alignItems: 'flex-start' }}>
          
          {/* Left Column - History & Context */}
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', flexShrink: 0 }}>
            
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Timeline</CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: 0 }}>
                <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                  <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '0', width: '2px', background: 'var(--color-border-light)' }}></div>
                  
                  <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
                    <div style={{ position: 'absolute', left: '-16px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary-600)', boxShadow: '0 0 0 4px var(--color-surface)' }}></div>
                    <div className="text-sm font-medium text-primary">Intake Complete</div>
                    <div className="text-xs text-secondary mt-1">{new Date(encounter.updated_at || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                  </div>

                  <div style={{ position: 'relative', marginBottom: 'var(--space-2)' }}>
                    <div style={{ position: 'absolute', left: '-16px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary-300)', boxShadow: '0 0 0 4px var(--color-surface)' }}></div>
                    <div className="text-sm font-medium text-primary">Registered</div>
                    <div className="text-xs text-secondary mt-1">{new Date(encounter.created_at || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <FHIRExportPanel encounterId={id!} />
          </div>

          {/* Center Column - AI Summary & Clinical Facts */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card style={{ borderTop: '4px solid var(--color-accent-700)' }}>
              <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle className="text-xl">Pre-consultation Summary</CardTitle>
                <Badge variant="outline">AI Extracted</Badge>
              </CardHeader>
              <CardContent style={{ paddingTop: 0 }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {(!encounter.clinical_facts || encounter.clinical_facts.length === 0) ? (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)', background: 'var(--color-surface-muted)', borderRadius: 'var(--radius-lg)' }}>
                      No structured facts collected.
                    </div>
                  ) : (
                    encounter.clinical_facts.map((fact: any) => (
                      <div key={fact.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                        <div style={{ flex: 1 }}>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                            <h3 className="text-sm font-semibold text-secondary" style={{ textTransform: 'capitalize' }}>
                              {fact.slot.replace(/_/g, ' ')}
                            </h3>
                            <Badge variant={fact.status === 'PHYSICIAN_VERIFIED' ? 'success' : 'default'} style={{ fontSize: '10px', padding: '1px 6px' }}>
                              {fact.status === 'PHYSICIAN_VERIFIED' ? 'Verified' : 'Unverified'}
                            </Badge>
                          </div>
                          
                          <p className="text-lg text-primary" style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                            {formatFactValue(fact.value)}
                          </p>
                          
                          {/* Provenance Viewer */}
                          {fact.evidence && (
                            <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                Source: {fact.evidence.source_type?.replace(/_/g, ' ')} {fact.evidence.media_type ? `(${fact.evidence.media_type})` : ''}
                              </div>
                              <p className="text-sm text-secondary" style={{ fontStyle: 'italic', borderLeft: '2px solid var(--color-border-focus)', paddingLeft: 'var(--space-3)', marginBlock: 'var(--space-2)' }}>
                                "{fact.evidence.extracted_text}"
                              </p>
                              {fact.evidence.media_url && (
                                <a href={fact.evidence.media_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--color-text-link)', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)' }}>
                                  View Original Media
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </a>
                              )}
                            </div>
                          )}
                          
                        </div>
                        <div style={{ marginLeft: 'var(--space-4)' }}>
                          <Button variant="ghost" size="sm" onClick={() => handleEditFact(fact.id, fact.value)}>Edit</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
