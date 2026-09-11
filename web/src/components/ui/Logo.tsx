import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  showText?: boolean;
  subtitle?: string;
  variant?: 'light' | 'dark';
}

export function Logo({
  size = 32,
  className = '',
  style = {},
  showText = false,
  subtitle,
  variant = 'dark',
}: LogoProps) {
  return (
    <div
      className={`swasthya-logo-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      <img
        src="/logo.svg"
        alt="SwasthyaSaathi Emblem"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          borderRadius: `${Math.max(6, Math.round(size * 0.22))}px`,
          display: 'block',
          boxShadow: '0 1px 3px rgba(13, 34, 24, 0.12)',
          flexShrink: 0,
        }}
      />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: size >= 36 ? '1.15rem' : '1.02rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: variant === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
            }}
          >
            SwasthyaSaathi
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: variant === 'light' ? 'rgba(255, 255, 255, 0.65)' : 'var(--color-text-muted)',
                marginTop: '1px',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
