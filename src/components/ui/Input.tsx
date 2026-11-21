import React, { useId } from 'react';
import styles from './Field.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={inputId} className={styles.label}>
        <span>
          {label}
          {required && <span className={styles.required}>*</span>}
        </span>
      </label>

      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.inputHasError : ''} ${className}`}
        aria-describedby={error ? errorId : helperText ? helpId : undefined}
        aria-invalid={Boolean(error)}
        required={required}
        {...props}
      />

      {error ? (
        <span id={errorId} className={styles.errorText} role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={helpId} className={styles.helperText}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
