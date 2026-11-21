import React, { useId } from 'react';
import styles from './Field.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  error,
  required,
  children,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const helpId = `${selectId}-help`;
  const errorId = `${selectId}-error`;

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={selectId} className={styles.label}>
        <span>
          {label}
          {required && <span className={styles.required}>*</span>}
        </span>
      </label>

      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          className={`${styles.select} ${error ? styles.inputHasError : ''} ${className}`}
          aria-describedby={error ? errorId : helperText ? helpId : undefined}
          aria-invalid={Boolean(error)}
          required={required}
          {...props}
        >
          {children}
        </select>
        <span className={styles.selectArrow} aria-hidden="true">
          ▼
        </span>
      </div>

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
