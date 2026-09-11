import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';

export function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)', backgroundImage: 'var(--gradient-flag-diagonal)' }}>
      {/* National Tricolor Micro-Ribbon */}
      <div className="tiranga-ribbon" />

      <style>{`
        .doctor-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }
        .doctor-nav-link:hover {
          color: var(--color-primary-700);
          background-color: var(--color-primary-25);
        }
        .doctor-nav-link.active {
          color: var(--color-primary-800);
          background-color: var(--color-primary-50);
          border-color: var(--color-primary-200);
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(230, 81, 0, 0.08);
        }
        @media (max-width: 900px) {
          .doctor-nav-links-desktop {
            display: none !important;
          }
          .doctor-nav-toggle-mobile {
            display: inline-flex !important;
          }
        }
        @media (min-width: 901px) {
          .doctor-nav-toggle-mobile {
            display: none !important;
          }
          .doctor-mobile-menu {
            display: none !important;
          }
        }
      `}</style>

      {/* ── TOP INSTITUTIONAL CONTEXT STRIP ── */}
      <div style={{
        backgroundColor: 'var(--color-primary-950)',
        color: 'var(--color-text-inverse)',
        fontSize: '11px',
        fontWeight: 'var(--font-weight-medium)',
        padding: '6px var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        letterSpacing: '0.02em',
        borderBottom: '1px solid rgba(255, 103, 31, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
            OPD Clinical Session Active
          </span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
            Dept. of Kayachikitsa • Room 104
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.75)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60a5fa' }}></span>
            ABDM National Health Gateway: Connected
          </span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
            NAMASTE Morbidity Codes 2026
          </span>
        </div>
      </div>

      {/* ── MAIN TOP NAVIGATION BAR ── */}
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 2px rgba(13, 34, 24, 0.03)'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-6)'
        }}>
          {/* Left: Brand Identity with Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <Link 
              to="/doctor/queue" 
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              title="SwasthyaSaathi Doctor Portal"
            >
              <Logo 
                size={34} 
                showText={true} 
                subtitle="Clinical Workstation" 
              />
            </Link>

            <span style={{ 
              height: '24px', 
              width: '1px', 
              backgroundColor: 'var(--color-border)', 
              margin: '0 var(--space-1)' 
            }} className="doctor-nav-links-desktop" />

            {/* Navigation Links (Desktop) */}
            <nav 
              className="doctor-nav-links-desktop"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <NavLink 
                to="/doctor/queue" 
                className={({ isActive }) => `doctor-nav-link ${isActive ? 'active' : ''}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Patient Intake Queue
              </NavLink>

              <NavLink 
                to="/doctor/settings" 
                className={({ isActive }) => `doctor-nav-link ${isActive ? 'active' : ''}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                System Settings
              </NavLink>
            </nav>
          </div>

          {/* Right: Clinician Status, Profile & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {/* Link to public demo / home */}
            <Link
              to="/"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                height: '36px',
                padding: '0 10px',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)'
              }}
              className="doctor-nav-links-desktop"
              title="Visit public portal"
            >
              <span>Public Portal</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </Link>

            {/* Doctor Profile Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '36px',
              padding: '0 12px 0 4px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'var(--font-weight-bold)',
                boxShadow: '0 2px 5px rgba(230, 81, 0, 0.25)'
              }}>
                {user?.full_name?.charAt(0) || 'D'}
              </div>

              <div style={{ lineHeight: '1.2' }}>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}>
                  {user?.full_name || 'Dr. Practitioner'}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {user?.role || 'Ayurveda Physician'}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '36px',
                padding: '0 12px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-alert-red)';
                e.currentTarget.style.borderColor = 'var(--color-alert-red)';
                e.currentTarget.style.backgroundColor = 'var(--color-emergency-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Sign out of workstation"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="doctor-nav-links-desktop">Sign Out</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="doctor-nav-toggle-mobile"
              aria-label="Toggle navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                cursor: 'pointer',
                color: 'var(--color-text-primary)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
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
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div 
            className="doctor-mobile-menu"
            style={{
              padding: 'var(--space-4) var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}
          >
            <NavLink 
              to="/doctor/queue"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `doctor-nav-link ${isActive ? 'active' : ''}`}
            >
              Patient Intake Queue
            </NavLink>
            <NavLink 
              to="/doctor/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `doctor-nav-link ${isActive ? 'active' : ''}`}
            >
              System Settings
            </NavLink>
            <Link 
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '8px 16px',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none'
              }}
            >
              Visit Public Portal ↗
            </Link>
          </div>
        )}
      </header>

      {/* ── DOCTOR WORKSPACE MAIN OUTLET ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
}
