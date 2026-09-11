import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';

export function DocumentPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  
  const [files, setFiles] = useState<{name: string, size: number, status: 'uploading' | 'complete'}[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && token) {
      const fileArray = Array.from(e.target.files);
      const newFiles = fileArray.map(f => ({
        name: f.name,
        size: f.size,
        status: 'uploading' as const
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      
      for (const f of fileArray) {
        try {
          await apiClient.uploadDocument(token, f);
          setFiles(prev => prev.map(pf => pf.name === f.name ? { ...pf, status: 'complete' } : pf));
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'File upload failed');
          setFiles(prev => prev.filter(pf => pf.name !== f.name));
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const hasFiles = files.length > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: 'var(--space-6)' }}>
      
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="editorial-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
          Step 3 of 4 • Supporting Reports (Optional)
        </span>
        
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)',
          lineHeight: '1.25'
        }}>
          Previous prescriptions or lab tests?
        </h1>

        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          If you have physical test reports or previous doctor prescriptions, you can attach a clear photo or PDF for your doctor. This step is entirely optional.
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

      {/* Upload Dropzone */}
      <div 
        style={{
          border: '1px dashed var(--color-border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-8) var(--space-6)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer',
          marginBottom: 'var(--space-6)',
          transition: 'all var(--transition-fast)'
        }}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary-850)';
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)';
          e.currentTarget.style.backgroundColor = 'var(--color-surface)';
        }}
      >
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'var(--color-primary-100)', 
          color: 'var(--color-primary-850)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto var(--space-3)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </div>

        <h3 style={{ margin: '0 0 4px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
          Tap to take photo or choose file
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Supports PDF, JPG, or PNG up to 10MB
        </p>

        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*,application/pdf" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
      </div>

      {/* Uploaded File List */}
      {hasFiles && (
        <div style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {files.map((file, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ color: 'var(--color-primary-850)' }}>📄</span>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.status === 'uploading' ? 'Uploading...' : 'Attached'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(idx)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                aria-label="Remove document"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/intake/${token}/interview`)}
        >
          Back
        </Button>
        <Button 
          size="lg" 
          onClick={() => navigate(`/intake/${token}/review`)}
        >
          {hasFiles ? 'Save & Review Answers →' : 'Skip & Continue to Review →'}
        </Button>
      </div>

    </div>
  );
}
