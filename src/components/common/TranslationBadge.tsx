'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import styles from './TranslationBadge.module.css';

interface TranslationBadgeProps {
  sourceLangName: string;
  showOriginal: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const TranslationBadge: React.FC<TranslationBadgeProps> = ({
  sourceLangName,
  showOriginal,
  onToggle,
  isLoading,
}) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className={styles.skeleton} aria-label={t('translate.translating')} role="status">
        <div className={styles.skeletonLine} style={{ width: '45%' }} />
      </div>
    );
  }

  return (
    <div className={styles.badgeContainer}>
      <span className={styles.badgeTag}>
        <span>🌐</span>
        <span>{t('translate.autoBadge', { lang: sourceLangName })}</span>
      </span>
      <span>•</span>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={onToggle}
      >
        {showOriginal ? t('translate.seeTranslation') : t('translate.seeOriginal')}
      </button>
    </div>
  );
};
