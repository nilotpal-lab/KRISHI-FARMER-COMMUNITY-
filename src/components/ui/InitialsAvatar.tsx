import React, { useState } from 'react';
import styles from './InitialsAvatar.module.css';

interface InitialsAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, avatarUrl, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'K';

  if (avatarUrl && !hasError) {
    return (
      <span className={`${styles.avatar} ${className}`} aria-hidden="true" style={{ padding: 0 }}>
        <img
          src={avatarUrl}
          alt=""
          className={styles.avatarImg}
          onError={() => setHasError(true)}
        />
      </span>
    );
  }

  return (
    <span className={`${styles.avatar} ${className}`} aria-hidden="true">
      {initials}
    </span>
  );
};
