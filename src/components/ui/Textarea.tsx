import React, { useId } from 'react';
import styles from './Field.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const helpId = `${textareaId}-help`;
  const errorId = `${textareaId}-error`;

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={textareaId} className={styles.label}>
        <span>
          {label}
          {required && <span className={styles.required}>*</span>}
        </span>
      </label>

      <textarea
        id={textareaId}
        className={`${styles.textarea} ${error ? styles.inputHasError : ''} ${className}`}
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
