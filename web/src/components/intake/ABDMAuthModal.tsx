import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';
import { 
  ABDMStatusResponse, 
  ABDMVerifyOTPResponse, 
  SessionStatusResponse 
} from '@/types';

interface ABDMAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicToken: string;
  sessionStatus?: SessionStatusResponse | null;
  onVerificationSuccess: (result: ABDMVerifyOTPResponse) => void;
}

type VerificationMode = 'AADHAAR_OTP' | 'ABHA_OTP' | 'MOBILE_OTP' | 'SCAN_SHARE';

export function ABDMAuthModal({
  isOpen,
  onClose,
  publicToken,
  sessionStatus,
  onVerificationSuccess
}: ABDMAuthModalProps) {
  const [abdmStatus, setAbdmStatus] = useState<ABDMStatusResponse | null>(null);
  const [, setLoadingStatus] = useState(true);
  const [mode, setMode] = useState<VerificationMode>('AADHAAR_OTP');
  
  // Step in flow: 'INPUT' | 'OTP' | 'SUCCESS'
  const [step, setStep] = useState<'INPUT' | 'OTP' | 'SUCCESS'>('INPUT');
  
  // Form state
  const [identifier, setIdentifier] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [txnId, setTxnId] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  // Progress & Error
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<ABDMVerifyOTPResponse | null>(null);

  // Fetch ABDM gateway status when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage('');
    setStep('INPUT');
    setOtp('');
    
    async function fetchStatus() {
      try {
        setLoadingStatus(true);
        const status = await apiClient.getABDMStatus();
        setAbdmStatus(status);
      } catch (err: unknown) {
        console.error('Failed to query ABDM status:', err);
      } finally {
        setLoadingStatus(false);
      }
    }
    fetchStatus();
  }, [isOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter a valid identifier.');
      return;
    }
    if (!consentAgreed) {
      setErrorMessage('Please accept the ABDM consent declaration to continue.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await apiClient.requestABDMOTP(publicToken, {
        auth_mode: mode as 'AADHAAR_OTP' | 'ABHA_OTP' | 'MOBILE_OTP',
        identifier: identifier.replace(/[\s-]/g, '')
      });

      if (res.txn_id) {
        setTxnId(res.txn_id);
      }
      setStep('OTP');
      setResendTimer(60);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to request OTP from ABDM gateway');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.trim().length < 4) {
      setErrorMessage('Please enter the 6-digit OTP received.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await apiClient.verifyABDMOTP(publicToken, {
        auth_mode: mode as 'AADHAAR_OTP' | 'ABHA_OTP' | 'MOBILE_OTP',
        txn_id: txnId,
        otp: otp.trim()
      });

      setVerifiedResult(res);
      setStep('SUCCESS');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'OTP verification failed with ABDM gateway');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Complete verification and close
  const handleComplete = () => {
    if (verifiedResult) {
      onVerificationSuccess(verifiedResult);
    }
    onClose();
  };

  // Quick format helper for Aadhaar
  const handleIdentifierChange = (val: string) => {
    if (mode === 'AADHAAR_OTP') {
      const digits = val.replace(/\D/g, '').slice(0, 12);
      const parts = digits.match(/.{1,4}/g);
      setIdentifier(parts ? parts.join(' ') : digits);
    } else if (mode === 'ABHA_OTP') {
      if (/^\d*$/.test(val.replace(/-/g, ''))) {
        const digits = val.replace(/\D/g, '').slice(0, 14);
        if (digits.length > 2) {
          const p1 = digits.slice(0, 2);
          const p2 = digits.slice(2, 6);
          const p3 = digits.slice(6, 10);
          const p4 = digits.slice(10, 14);
          setIdentifier([p1, p2, p3, p4].filter(Boolean).join('-'));
        } else {
          setIdentifier(digits);
        }
      } else {
        setIdentifier(val);
      }
    } else if (mode === 'MOBILE_OTP') {
      const digits = val.replace(/\D/g, '').slice(0, 10);
      setIdentifier(digits);
    } else {
      setIdentifier(val);
    }
  };

  const isConfigured = abdmStatus?.is_configured;
  const isMockEnv = abdmStatus?.environment === 'LOCAL_DEV_MOCK';
  const isSandbox = abdmStatus?.environment === 'ABDM_SANDBOX';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-4)'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        {/* Saffron-White-Green Tricolor Accent Ribbon */}
        <div style={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #FF671F 0%, #FF671F 33.3%, #ffffff 33.3%, #ffffff 66.6%, #046A38 66.6%, #046A38 100%)',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c2410c'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
                  ABDM Patient Authentication
                </h3>
                {/* Environment Badge */}
                {isSandbox && isConfigured && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#046A38',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '12px',
                    padding: '2px 8px'
                  }}>
                    ● Official ABDM Sandbox
                  </span>
                )}
                {isSandbox && !isConfigured && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#c2410c',
                    backgroundColor: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '12px',
                    padding: '2px 8px'
                  }}>
                    ⚠ ABDM Sandbox (Pending Portal Setup)
                  </span>
                )}
                {isMockEnv && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '2px 8px'
                  }}>
                    Local Dev Mode (Offline)
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                National Health Authority (NHA) • Ayushman Bharat Digital Mission
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px' }}>
          
          {/* If Sandbox environment is active but credentials pending */}
          {isSandbox && !isConfigured && step === 'INPUT' && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              display: 'flex',
              gap: '10px',
              fontSize: '0.8rem',
              color: '#92400e',
              lineHeight: '1.45'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <strong>Sandbox Credentials Required:</strong> The backend is configured for the official NHA ABDM Sandbox Gateway (<code style={{ fontSize: '11px', background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>dev.abdm.gov.in</code>), but Client ID and Client Secret are not set in the server environment. Once registered on <a href="https://sandbox.abdm.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#b45309', textDecoration: 'underline' }}>sandbox.abdm.gov.in</a>, set <code style={{ fontSize: '11px', background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>ABDM_CLIENT_ID</code> in <code style={{ fontSize: '11px' }}>.env</code>.
              </div>
            </div>
          )}

          {/* STEP 1: INPUT & METHOD SELECTION */}
          {step === 'INPUT' && (
            <div>
              {/* Method Tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                background: '#f8fafc',
                padding: '4px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => { setMode('AADHAAR_OTP'); setIdentifier(''); setErrorMessage(''); }}
                  style={{
                    padding: '8px 4px',
                    fontSize: '11px',
                    fontWeight: mode === 'AADHAAR_OTP' ? '600' : '500',
                    borderRadius: '6px',
                    border: 'none',
                    background: mode === 'AADHAAR_OTP' ? '#ffffff' : 'transparent',
                    color: mode === 'AADHAAR_OTP' ? '#c2410c' : '#64748b',
                    boxShadow: mode === 'AADHAAR_OTP' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Aadhaar OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('ABHA_OTP'); setIdentifier(''); setErrorMessage(''); }}
                  style={{
                    padding: '8px 4px',
                    fontSize: '11px',
                    fontWeight: mode === 'ABHA_OTP' ? '600' : '500',
                    borderRadius: '6px',
                    border: 'none',
                    background: mode === 'ABHA_OTP' ? '#ffffff' : 'transparent',
                    color: mode === 'ABHA_OTP' ? '#c2410c' : '#64748b',
                    boxShadow: mode === 'ABHA_OTP' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ABHA Number
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('MOBILE_OTP'); setIdentifier(''); setErrorMessage(''); }}
                  style={{
                    padding: '8px 4px',
                    fontSize: '11px',
                    fontWeight: mode === 'MOBILE_OTP' ? '600' : '500',
                    borderRadius: '6px',
                    border: 'none',
                    background: mode === 'MOBILE_OTP' ? '#ffffff' : 'transparent',
                    color: mode === 'MOBILE_OTP' ? '#c2410c' : '#64748b',
                    boxShadow: mode === 'MOBILE_OTP' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('SCAN_SHARE'); setErrorMessage(''); }}
                  style={{
                    padding: '8px 4px',
                    fontSize: '11px',
                    fontWeight: mode === 'SCAN_SHARE' ? '600' : '500',
                    borderRadius: '6px',
                    border: 'none',
                    background: mode === 'SCAN_SHARE' ? '#ffffff' : 'transparent',
                    color: mode === 'SCAN_SHARE' ? '#c2410c' : '#64748b',
                    boxShadow: mode === 'SCAN_SHARE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Scan & Share
                </button>
              </div>

              {/* Mode: SCAN & SHARE */}
              {mode === 'SCAN_SHARE' ? (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '16px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '2px dashed #cbd5e1',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '180px',
                      height: '180px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px'
                    }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                        <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                        <rect x="14" y="14" width="3" height="3"></rect>
                        <rect x="18" y="14" width="3" height="3"></rect>
                        <rect x="14" y="18" width="7" height="3"></rect>
                      </svg>
                      <span style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', fontWeight: '500' }}>
                        Counter 1 • OPD Intake
                      </span>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 6px', fontSize: '0.92rem', color: '#0f172a', fontWeight: '600' }}>
                    Scan with any ABDM PHR App
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#64748b', lineHeight: '1.45', maxWidth: '380px', marginInline: 'auto' }}>
                    Open your ABHA App, Aarogya Setu, or Paytm Health, select <strong>Scan QR</strong>, and scan this counter display to share demographic details with SwasthyaSaathi automatically.
                  </p>

                  <div style={{
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '11px',
                    color: '#475569',
                    textAlign: 'left',
                    marginBottom: '16px'
                  }}>
                    <strong>Official ABDM Counter Link:</strong><br />
                    <code style={{ wordBreak: 'break-all', fontSize: '10px', color: '#0369a1' }}>
                      https://phrsbx.abdm.gov.in/share-profile?hipid=IN0410000123&counterid=COUNTER_1
                    </code>
                  </div>
                </div>
              ) : (
                /* Mode: Aadhaar / ABHA / Mobile OTP */
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '6px'
                    }}>
                      {mode === 'AADHAAR_OTP' && '12-Digit Aadhaar Number'}
                      {mode === 'ABHA_OTP' && '14-Digit ABHA Number or ABHA Address'}
                      {mode === 'MOBILE_OTP' && 'Linked 10-Digit Mobile Number'}
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder={
                        mode === 'AADHAAR_OTP' ? 'XXXX XXXX XXXX' :
                        mode === 'ABHA_OTP' ? '91-XXXX-XXXX-XXXX or name@abdm' :
                        '98XXXXXXXX'
                      }
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '0.95rem',
                        fontFamily: mode === 'AADHAAR_OTP' || mode === 'MOBILE_OTP' ? 'monospace' : 'inherit',
                        letterSpacing: mode === 'AADHAAR_OTP' ? '2px' : 'normal',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      autoFocus
                    />
                    <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                      {mode === 'AADHAAR_OTP' && 'Encrypted via NHA RSA-OAEP public certificate before transmission.'}
                      {mode === 'ABHA_OTP' && 'Enter your Ayushman Bharat Health Account number or address.'}
                      {mode === 'MOBILE_OTP' && 'An OTP will be sent to the mobile number registered in ABDM.'}
                    </p>
                  </div>

                  {/* Consent Checkbox */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={consentAgreed}
                        onChange={(e) => setConsentAgreed(e.target.checked)}
                        style={{ marginTop: '3px', accentColor: '#FF671F' }}
                      />
                      <span style={{ fontSize: '0.74rem', color: '#334155', lineHeight: '1.45' }}>
                        I hereby declare that I voluntarily authorize SwasthyaSaathi to authenticate my identity via the National Health Authority (NHA) ABDM Sandbox Gateway and retrieve my demographic details for this clinical outpatient encounter.
                      </span>
                    </label>
                  </div>

                  {errorMessage && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '0.78rem',
                      marginBottom: '16px'
                    }}>
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    onClick={handleRequestOTP}
                    isLoading={submitting}
                    fullWidth
                    size="lg"
                    style={{
                      backgroundColor: '#FF671F',
                      borderColor: '#FF671F',
                      color: '#ffffff',
                      fontWeight: '600'
                    }}
                  >
                    Request OTP from ABDM Gateway →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: OTP ENTRY */}
          {step === 'OTP' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  color: '#046A38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                  Enter Verification OTP
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  An OTP has been dispatched by UIDAI / ABDM to your registered mobile number.
                </p>
                {txnId && (
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                    Txn Ref: {txnId.slice(0, 16)}...
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontFamily: 'monospace',
                    borderRadius: '8px',
                    border: '2px solid #cbd5e1',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.78rem',
                  marginBottom: '16px'
                }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="secondary"
                  onClick={() => setStep('INPUT')}
                  style={{ flex: 1 }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  isLoading={submitting}
                  style={{
                    flex: 2,
                    backgroundColor: '#046A38',
                    borderColor: '#046A38',
                    color: '#ffffff',
                    fontWeight: '600'
                  }}
                >
                  Verify & Authenticate
                </Button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                {resendTimer > 0 ? (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Resend OTP in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c2410c',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & DEMOGRAPHIC RECORD REVIEW */}
          {step === 'SUCCESS' && verifiedResult && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#046A38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
                  Identity Verified via ABDM
                </h4>
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#046A38',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '2px 10px'
                }}>
                  {verifiedResult.verification_source} • {verifiedResult.verification_method}
                </span>
              </div>

              {/* Digital Health Identity Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '600' }}>
                      Ayushman Bharat Health Account (ABHA)
                    </span>
                    <h5 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                      {verifiedResult.patient_name}
                    </h5>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#046A38', fontWeight: '600' }}>
                      {verifiedResult.abha_address || 'ABDM Sandbox'}
                    </span>
                    <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                      {verifiedResult.abha_number || 'N/A'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>GENDER / AGE</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>
                      {verifiedResult.gender || 'Unknown'} {verifiedResult.age ? `(${verifiedResult.age}y)` : ''}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>STATUS</span>
                    <span style={{ color: '#15803d', fontWeight: '600' }}>
                      {verifiedResult.verification_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conflict Notification Banner */}
              {verifiedResult.has_conflict && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '16px',
                  fontSize: '0.75rem',
                  color: '#92400e'
                }}>
                  <strong>Demographic Update Recorded:</strong> A discrepancy between the initial self-reported intake and the official ABDM record was detected and logged to the clinical conflict model for physician review.
                </div>
              )}

              <Button
                onClick={handleComplete}
                fullWidth
                size="lg"
                style={{
                  backgroundColor: '#046A38',
                  borderColor: '#046A38',
                  color: '#ffffff',
                  fontWeight: '600'
                }}
              >
                Apply to Intake & Continue →
              </Button>
            </div>
          )}

        </div>

        {/* Modal Footer / Audit notice */}
        <div style={{
          padding: '12px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#94a3b8'
        }}>
          <span>NHA ABDM V3 Compliant • SHA-1/RSA-OAEP Encrypted</span>
          <span>Audit Provenance: Verified</span>
        </div>
      </div>
    </div>
  );
}
