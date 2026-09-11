import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import '@/styles/global.css';

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gradient-flag-diagonal)' }}>
      {/* ── TOP NATIONAL TRICOLOR RIBBON ── */}
      <div className="tiranga-ribbon" />

      {/* ── TOP ANNOUNCEMENT / CONTEXT STRIP ── */}
      <div style={{
        background: '#2A0D04',
        color: '#FFF7ED',
        padding: 'var(--space-2) var(--space-4)',
        fontSize: 'var(--font-size-xs)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 103, 31, 0.25)',
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)'
      }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-tiranga-saffron)' }}></span>
        <span>Operational Standard: <strong>AI Assists. Attending Physician Decides.</strong> National Digital Health (ABDM) & Ministry of Ayush NAMASTE aligned.</span>
      </div>

      {/* ── MAIN NAVIGATION BAR ── */}
      <header style={{
        background: 'rgba(255, 253, 250, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          
          {/* Logo & Clinical Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Logo size={36} showText={true} subtitle="AYUSH Pre-Consultation" />
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }} className="hidden-mobile">
            <Link 
              to="/" 
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-750)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              Platform Overview
            </Link>
            
            <Link 
              to="/about" 
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-750)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              Clinical Philosophy & Ethics
            </Link>
            
            <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-border)' }}></div>
            
            <Link 
              to="/doctor/login" 
              style={{
                background: 'linear-gradient(135deg, #FF792E 0%, #E65100 100%)',
                color: '#ffffff',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                boxShadow: '0 2px 8px rgba(230, 81, 0, 0.28)',
                border: '1px solid #C2410C',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(230, 81, 0, 0.4)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(230, 81, 0, 0.28)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Physician Workstation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              display: 'none'
            }}
            className="mobile-header-toggle"
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <line x1="18" y1="6" x2="6" y2="18"></line>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          zIndex: 99
        }}>
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}
          >
            Platform Overview
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}
          >
            Clinical Philosophy & Ethics
          </Link>
          <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }}></div>
          <Link 
            to="/doctor/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ color: 'var(--color-primary-850)', textDecoration: 'none', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}
          >
            Physician Workstation →
          </Link>
        </div>
      )}

      {/* ── PAGE OUTLET ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── FOOTER: DIGNIFIED, EDITORIAL, COMPLIANT ── */}
      <footer style={{
        backgroundColor: 'var(--color-neutral-900)',
        color: 'var(--color-neutral-300)',
        borderTop: '1px solid var(--color-neutral-800)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-12)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-12)',
            paddingBottom: 'var(--space-12)',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            {/* Column 1: Identity & Scope */}
            <div style={{ maxWidth: '340px' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <Logo size={36} showText={true} variant="light" subtitle="Clinical Systems" />
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-neutral-400)', margin: 0 }}>
                Intelligent pre-consultation case-taking and clinical information structuring built specifically for AYUSH outpatient departments.
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', marginTop: 'var(--space-3)', lineHeight: '1.5' }}>
                Governed by strict clinical boundaries: AI assists in gathering and structuring facts; only registered medical practitioners make diagnoses and treatment decisions.
              </p>
            </div>

            {/* Column 2: Clinical Standards */}
            <div>
              <h4 style={{
                color: '#ffffff',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)'
              }}>
                Standards & Interoperability
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                <li style={{ color: 'var(--color-neutral-400)' }}>Ministry of Ayush NAMASTE Codes</li>
                <li style={{ color: 'var(--color-neutral-400)' }}>HL7® FHIR® R4 Document Bundles</li>
                <li style={{ color: 'var(--color-neutral-400)' }}>SNOMED CT Clinical Terminology</li>
                <li style={{ color: 'var(--color-neutral-400)' }}>Ayushman Bharat Digital Mission (ABDM)</li>
                <li style={{ color: 'var(--color-neutral-400)' }}>Deterministic Safety Rules (RF-001..007)</li>
              </ul>
            </div>

            {/* Column 3: Workspaces */}
            <div>
              <h4 style={{
                color: '#ffffff',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)'
              }}>
                Clinical Navigation
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                <li>
                  <Link to="/" style={{ color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                    Platform Architecture
                  </Link>
                </li>
                <li>
                  <Link to="/about" style={{ color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                    Clinical Philosophy & Ethics
                  </Link>
                </li>
                <li>
                  <Link to="/doctor/login" style={{ color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                    Physician OPD Workstation
                  </Link>
                </li>
                <li>
                  <Link to="/doctor/queue" style={{ color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                    Patient Triage Queue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Institutional Trust */}
            <div>
              <h4 style={{
                color: '#ffffff',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)'
              }}>
                Information Security
              </h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-400)', lineHeight: '1.6', margin: 0 }}>
                Designed in conformance with DISHA and DPDP principles. Ephemeral session tokens, strict object-level authorization, zero diagnostic autonomy, and cryptographic audit trails.
              </p>
              <div style={{ marginTop: 'var(--space-4)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'rgba(255,255,255,0.06)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--color-neutral-300)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
                Clinical Production Ready
              </div>
            </div>
          </div>

          {/* Sub-footer copyright & statement */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-8)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-neutral-500)'
          }}>
            <div>
              © 2026 SwasthyaSaathi Clinical Systems. Designed for AYUSH Outpatient Departments.
            </div>
            <div>
              Protected by Immutable Provenance and Physician Authorization Protocols.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
