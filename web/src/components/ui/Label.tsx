import React from 'react';
import './Label.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', required, children, ...props }, ref) => {
    return (
      <label ref={ref} className={`ui-label ${className}`} {...props}>
        {children}
        {required && <span className="ui-label__required">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
