import React from 'react';
import './Input.css'; // Reuse Input CSS for consistency, or add Textarea specific if needed

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`ui-input ${error ? 'ui-input--error' : ''} ${className}`}
        style={{ minHeight: '80px', height: 'auto', paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-3)', resize: 'vertical' }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
