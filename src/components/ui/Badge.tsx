import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'mint' | 'sun' | 'line' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'mint',
  className = '',
  ...props
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
