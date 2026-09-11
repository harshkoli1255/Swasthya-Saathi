import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { QueuePatientCard } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

export function QueuePage() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueuePatientCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTION_REQ' | 'ROUTINE'>('ALL');
  const [sortBy, setSortBy] = useState<'WAIT_DESC' | 'URGENCY' | 'NAME'>('URGENCY');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { token } = useAuth();

  const loadQueue = async (isManual = false) => {
    if (!token) return;
    if (isManual) setRefreshing(true);
    try {
      const data = await apiClient.getQueue(token);
      setQueue(data);
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load queue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(() => loadQueue(), 25000);
    return () => clearInterval(interval);
  }, [token]);

  // Counts
  const emergencyCount = queue.filter(p => p.triage_level === 'EMERGENCY').length;
  const urgentCount = queue.filter(p => p.triage_level === 'URGENT').length;
  const actionReqCount = emergencyCount + urgentCount + queue.filter(p => p.red_flag_count > 0 && p.triage_level === 'ROUTINE').length;
  const routineCount = Math.max(0, queue.length - actionReqCount);

  // Filtered & Sorted Queue
  const processedQueue = useMemo(() => {
    const filtered = queue.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.patient_name.toLowerCase().includes(q) || 
        p.opd_id.toLowerCase().includes(q) ||
        (p.chief_complaint && p.chief_complaint.toLowerCase().includes(q));
      
      if (!matchesSearch) return false;

      if (filter === 'ACTION_REQ') {
        return p.triage_level === 'EMERGENCY' || p.triage_level === 'URGENT' || p.red_flag_count > 0;
      }
      if (filter === 'ROUTINE') {
        return p.triage_level === 'ROUTINE' && p.red_flag_count === 0;
      }
      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'URGENCY') {
        const score = (p: QueuePatientCard) => {
          if (p.triage_level === 'EMERGENCY') return 3;
          if (p.triage_level === 'URGENT') return 2;
          if (p.red_flag_count > 0) return 1.5;
          return 1;
        };
        const diff = score(b) - score(a);
        if (diff !== 0) return diff;
        return (b.wait_minutes || 0) - (a.wait_minutes || 0);
      }
      if (sortBy === 'WAIT_DESC') {
        return (b.wait_minutes || 0) - (a.wait_minutes || 0);
      }
      if (sortBy === 'NAME') {
        return a.patient_name.localeCompare(b.patient_name);
      }
      return 0;
    });
  }, [queue, searchQuery, filter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedQueue.length / itemsPerPage));
  const paginatedQueue = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedQueue.slice(start, start + itemsPerPage);
  }, [processedQueue, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, sortBy]);

  return (
    <div style={{
      maxWidth: '1380px',
      margin: '0 auto',
      width: '100%',
      padding: 'var(--space-8) var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }}>

      {/* ── WORKSPACE HEADER BANNER ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        paddingBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span className="editorial-eyebrow" style={{ color: 'var(--color-clay-600)' }}>
              Outpatient Triage Desk
            </span>
            <span style={{ color: 'var(--color-border)' }}>•</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Live Clinical Feed
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-2)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Patient Intake Queue
          </h1>

          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', maxWidth: '780px', lineHeight: 1.5 }}>
            Structured pre-consultation case sheets with extracted AYUSH constitutional markers (Agni, Nidra, Satmya) and deterministic safety triage.
          </p>
        </div>

        {/* Top Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => loadQueue(true)}
            isLoading={refreshing}
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            }
          >
            {refreshing ? 'Updating...' : 'Refresh Queue'}
          </Button>
        </div>
      </div>

      {/* ── CLINICAL STATUS METRICS STRIP ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        {/* Metric 1: Total Queue */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface-muted)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-800)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Total Waiting
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {queue.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Active in waiting room
            </div>
          </div>
        </div>

        {/* Metric 2: Priority Attention */}
        <div style={{
          backgroundColor: actionReqCount > 0 ? '#FEF2F2' : 'var(--color-surface)',
          border: `1px solid ${actionReqCount > 0 ? '#FECACA' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: actionReqCount > 0 ? '#FEE2E2' : 'var(--color-surface-muted)',
            border: `1px solid ${actionReqCount > 0 ? '#FCA5A5' : 'var(--color-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: actionReqCount > 0 ? '#DC2626' : 'var(--color-text-muted)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: actionReqCount > 0 ? '#991B1B' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Priority Attention
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: actionReqCount > 0 ? '#DC2626' : 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {actionReqCount}
            </div>
            <div style={{ fontSize: '11px', color: actionReqCount > 0 ? '#B91C1C' : 'var(--color-text-secondary)', marginTop: '2px' }}>
              {emergencyCount > 0 ? `${emergencyCount} emergency, ${urgentCount} urgent` : 'Urgent or safety flags'}
            </div>
          </div>
        </div>

        {/* Metric 3: Routine Pre-Intakes */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface-muted)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-700)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-primary-800)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Routine Intake
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {routineCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Structured & ready for MD
            </div>
          </div>
        </div>

        {/* Metric 4: ABDM Interoperability Ready */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface-muted)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-accent-600)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              FHIR R4 / NAMASTE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              Dual-Coded
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              ABDM Gateway Sync Active
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER, SEARCH & SORT CONTROLS ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--space-3) var(--space-4)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Search Bar */}
        <div style={{ flex: '1 1 300px', maxWidth: '460px', position: 'relative' }}>
          <Input 
            placeholder="Search patient name, OPD ID, or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', height: '38px', fontSize: '13px', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '2px 6px'
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Segmented Control & Sorting */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-surface-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px',
            gap: '3px'
          }}>
            <button
              onClick={() => setFilter('ALL')}
              style={{
                padding: '5px 12px',
                background: filter === 'ALL' ? '#FFFFFF' : 'transparent',
                color: filter === 'ALL' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: filter === 'ALL' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: filter === 'ALL' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              All Cases ({queue.length})
            </button>
            <button
              onClick={() => setFilter('ACTION_REQ')}
              style={{
                padding: '5px 12px',
                background: filter === 'ACTION_REQ' ? '#FFFFFF' : 'transparent',
                color: filter === 'ACTION_REQ' ? '#DC2626' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: filter === 'ACTION_REQ' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: filter === 'ACTION_REQ' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Priority Attention ({actionReqCount})
            </button>
            <button
              onClick={() => setFilter('ROUTINE')}
              style={{
                padding: '5px 12px',
                background: filter === 'ROUTINE' ? '#FFFFFF' : 'transparent',
                color: filter === 'ROUTINE' ? 'var(--color-primary-800)' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: filter === 'ROUTINE' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: filter === 'ROUTINE' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Routine ({routineCount})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '5px 8px',
                fontSize: 'var(--font-size-xs)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="URGENCY">Urgency First</option>
              <option value="WAIT_DESC">Longest Wait</option>
              <option value="NAME">Patient Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message if present */}
      {error && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: '#FEF2F2',
          color: '#DC2626',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #FECACA',
          fontSize: 'var(--font-size-sm)'
        }}>
          {error}
        </div>
      )}

      {/* ── CLINICAL CASE ROSTER / TABLE ── */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(13, 34, 24, 0.04)'
      }}>
        {loading ? (
          <div style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
              Loading clinical queue...
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)' }}>
              Syncing structured intakes from OPD waiting area
            </div>
          </div>
        ) : processedQueue.length === 0 ? (
          <div style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {searchQuery ? 'No matching patients found' : 'No patients currently in queue'}
            </p>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {searchQuery ? 'Try clearing your search query or switching filters.' : 'Patients will appear here automatically when pre-consultation intake begins.'}
            </p>
            {searchQuery && (
              <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')} style={{ marginTop: 'var(--space-4)' }}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '820px' }}>
              {/* Table Header Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 2.6fr 1.3fr 1fr 130px',
              columnGap: 'var(--space-4)',
              padding: '12px var(--space-5)',
              backgroundColor: 'var(--color-surface-subtle)',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              <div style={{ paddingLeft: '20px' }}>Patient & OPD ID</div>
              <div>Reported Concern & Intake Status</div>
              <div style={{ textAlign: 'center' }}>Triage & Safety</div>
              <div style={{ textAlign: 'center' }}>Wait Time</div>
              <div style={{ textAlign: 'right' }}>Action</div>
            </div>

            {/* Patient Rows */}
            {paginatedQueue.map((patient, idx) => {
              const isEmergency = patient.triage_level === 'EMERGENCY';
              const isUrgent = patient.triage_level === 'URGENT';
              const hasRedFlags = patient.red_flag_count > 0;

              return (
                <div
                  key={patient.encounter_id}
                  onClick={() => navigate(`/doctor/encounters/${patient.encounter_id}`)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 2.6fr 1.3fr 1fr 130px',
                    columnGap: 'var(--space-4)',
                    alignItems: 'center',
                    padding: 'var(--space-4) var(--space-5)',
                    borderTop: idx > 0 ? '1px solid var(--color-border-subtle)' : 'none',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  {/* Patient Info with integrated triage indicator bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, paddingRight: 'var(--space-2)' }}>
                    {/* Triage indicator accent bar */}
                    <div style={{
                      width: '4px',
                      height: '38px',
                      borderRadius: '2px',
                      backgroundColor: isEmergency ? '#DC2626' : isUrgent ? '#D97706' : 'var(--color-primary-700)',
                      flexShrink: 0
                    }} />

                    {/* Patient Avatar & Demographics */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: isEmergency ? '#FEE2E2' : isUrgent ? '#FEF3C7' : 'var(--color-surface-muted)',
                        color: isEmergency ? '#DC2626' : isUrgent ? '#B45309' : 'var(--color-primary-800)',
                        border: `1px solid ${isEmergency ? '#FECACA' : isUrgent ? '#FDE68A' : 'var(--color-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {patient.patient_name.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-display)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {patient.patient_name}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{patient.patient_age ? `${patient.patient_age}y` : ''}</span>
                          <span>•</span>
                          <span>{patient.patient_sex || 'Unspecified'}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{patient.opd_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Context / Chief Complaint */}
                  <div style={{ paddingRight: 'var(--space-4)' }}>
                    <div style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {patient.chief_complaint || 'Pre-consultation history complete'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Case taking completed • Ready for review
                    </div>
                  </div>

                  {/* Triage & Safety Alert Badge */}
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isEmergency ? (
                        <Badge variant="danger">EMERGENCY</Badge>
                      ) : isUrgent ? (
                        <Badge variant="warning">URGENT</Badge>
                      ) : (
                        <Badge variant="routine">ROUTINE</Badge>
                      )}
                    </div>
                    {hasRedFlags ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#B91C1C',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        ⚠ {patient.red_flag_count} Safety Flag{patient.red_flag_count > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        ✓ No red flags
                      </span>
                    )}
                  </div>

                  {/* Wait Time */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 700,
                      color: (patient.wait_minutes || 0) > 30 ? 'var(--color-clay-600)' : 'var(--color-text-primary)'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {patient.wait_minutes || 0}m
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      waiting
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ textAlign: 'right' }}>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/encounters/${patient.encounter_id}`);
                      }}
                      style={{
                        fontSize: '12px',
                        padding: '5px 12px',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'none'
                      }}
                    >
                      Open Chart →
                    </Button>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* ── PAGINATION BAR ── */}
        {!loading && processedQueue.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--color-surface-subtle)',
            borderTop: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)',
            gap: 'var(--space-3)'
          }}>
            <div>
              Showing <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{(currentPage - 1) * itemsPerPage + 1}</span> to <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{Math.min(currentPage * itemsPerPage, processedQueue.length)}</span> of <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{processedQueue.length}</span> patients
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: currentPage === 1 ? 'var(--color-surface-muted)' : '#FFFFFF',
                  color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>

              <span style={{ fontSize: '12px', padding: '0 var(--space-2)' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: currentPage === totalPages ? 'var(--color-surface-muted)' : '#FFFFFF',
                  color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
