import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`ui-input ${error ? 'ui-input--error' : ''} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
