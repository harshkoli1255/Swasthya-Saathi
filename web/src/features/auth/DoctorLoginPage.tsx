import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Logo } from '@/components/ui/Logo';

export function DoctorLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.login(username, password);
      login(response);
      navigate('/doctor/queue');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid physician credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setUsername('dr.ayush');
    setPassword('demo_password123');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* National Tricolor Micro-Ribbon */}
      <div className="tiranga-ribbon" />

      <div style={{ display: 'flex', flex: 1, backgroundColor: 'var(--color-surface)' }}>
        {/* Left side: Dignified Institutional Identity (Hidden on mobile) */}
        <div 
          style={{
            flex: 1,
            background: 'radial-gradient(circle at 15% 15%, rgba(255, 103, 31, 0.22) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(4, 106, 56, 0.15) 0%, transparent 50%), linear-gradient(135deg, #2A0D04 0%, #150602 55%, #05034E 100%)',
            color: '#ffffff',
            padding: 'var(--space-16)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255, 103, 31, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="hidden-mobile"
        >
          <div>
            {/* Emblem & Department */}
            <div style={{ marginBottom: 'var(--space-16)' }}>
              <Logo size={42} showText={true} variant="light" subtitle="Clinical Provider Access" />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: '700',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-6)',
              maxWidth: '460px',
              color: '#ffffff'
            }}>
              Structured clinical intelligence before you open the door.
            </h1>

            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'rgba(255, 255, 255, 0.82)',
              maxWidth: '440px',
              lineHeight: '1.7',
              margin: '0 0 var(--space-10)'
            }}>
              Review verified symptom narratives, AYUSH functional parameters (Agni, Nidra, Satmya), and automated safety red flags before the encounter begins.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              fontSize: 'var(--font-size-sm)',
              color: 'rgba(255, 255, 255, 0.75)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ color: '#FF9E5C', fontWeight: 700 }}>✓</span>
                <span>Deterministic Clinical Safety Alert Gating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ color: '#FF9E5C', fontWeight: 700 }}>✓</span>
                <span>Direct ABDM & Ministry of Ayush NAMASTE Mapping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ color: '#FF9E5C', fontWeight: 700 }}>✓</span>
                <span>Physician-Verified Status Elevation</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255, 255, 255, 0.5)' }}>
            National Digital Health Mission • ABDM Sandbox Certified • Ayush Hospital Network
          </div>
        </div>

        {/* Right side: Clean, Open Login Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-8)',
          position: 'relative',
          backgroundColor: 'var(--color-background)',
          backgroundImage: 'var(--gradient-flag-diagonal)'
        }}>
        {/* Back to Site Button (Hidden on Doctor Surface where patient routes are not mounted) */}
        {import.meta.env.VITE_APP_SURFACE !== 'doctor' && (
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              leftIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>}
            >
              Back to Platform Overview
            </Button>
          </div>
        )}

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '100%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'var(--space-8)'
          }}>
            
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                Physician Workstation
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                margin: '0 0 var(--space-2)',
                lineHeight: '1.25'
              }}>
                Sign in to your OPD queue
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                Enter your institutional credentials to review waiting patients.
              </p>
            </div>

            {/* Quick Demo Credentials Assistant */}
            <div style={{
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)'
            }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', display: 'block' }}>
                  CLINICAL DEMO ACCOUNT
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                  dr.ayush • demo_password123
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAutoFill}
                style={{ fontSize: '11px', height: '28px', padding: '0 var(--space-2)' }}
              >
                Auto-fill
              </Button>
            </div>

            {error && (
              <div style={{
                background: 'var(--color-emergency-bg)',
                border: '1px solid var(--color-emergency-border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)',
                color: 'var(--color-emergency-text)',
                fontSize: 'var(--font-size-sm)',
                marginBottom: 'var(--space-4)'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <Label htmlFor="username">Physician Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dr.ayush"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div style={{ marginTop: 'var(--space-2)' }}>
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg" 
                  isLoading={loading}
                >
                  Sign In to Workstation
                </Button>
              </div>
            </form>

            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Restricted to authorized clinical personnel. All access is logged for patient safety and compliance.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
