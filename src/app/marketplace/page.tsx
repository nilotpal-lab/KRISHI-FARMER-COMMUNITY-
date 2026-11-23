'use client';

import React, { useState, useEffect } from 'react';
import { TaskShell } from '@/components/shells/TaskShell';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import styles from './Marketplace.module.css';

export default function MarketplacePage() {
  const { t, locale } = useI18n();
  const [isNotified, setIsNotified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsNotified(krishiService.getMarketplaceInterest());
  }, []);

  const handleToggleNotify = () => {
    const nextState = !isNotified;
    krishiService.setMarketplaceInterest(nextState);
    setIsNotified(nextState);
    if (nextState) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('marketplace.title')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('marketplace.title')}</h1>
          <p className={styles.subtitle}>{t('marketplace.subtitle')}</p>
        </header>

        {/* Coming Soon & Notify Me Banner */}
        <section className={styles.comingSoonBanner} aria-labelledby="marketplace-banner-h">
          <div className={styles.badgeRow}>
            <span className={styles.comingSoonBadge}>📢 {t('marketplace.comingSoon')}</span>
          </div>

          <h2 id="marketplace-banner-h" className={styles.bannerHeading}>
            {t('marketplace.title')}
          </h2>

          <p className={styles.bannerText}>
            {t('marketplace.desc')}
          </p>

          <div>
            <button
              type="button"
              className={`${styles.notifyBtn} ${isNotified ? styles.notifyBtnActive : ''}`}
              onClick={handleToggleNotify}
            >
              <span>{isNotified ? '✓' : '🔔'}</span>
              <span>{isNotified ? t('marketplace.notified') : t('marketplace.notifyMe')}</span>
            </button>
          </div>

          {showSuccess && (
            <div className={styles.successAlert} role="status" aria-live="polite">
              {t('marketplace.notifySuccess')}
            </div>
          )}
        </section>

        {/* Marketplace Categories Preview */}
        <h3 className={styles.categoriesTitle}>🛒 {t('marketplace.subtitle')}</h3>
        <div className={styles.categoriesGrid}>
          {/* 1. Implements */}
          <article className={styles.categoryCard}>
            <span className={styles.categoryIcon} aria-hidden="true">🚜</span>
            <h4 className={styles.categoryTitle}>{t('marketplace.catEquip')}</h4>
            <p className={styles.categoryDesc}>{t('marketplace.catEquipDesc')}</p>
          </article>

          {/* 2. Seeds */}
          <article className={styles.categoryCard}>
            <span className={styles.categoryIcon} aria-hidden="true">🌱</span>
            <h4 className={styles.categoryTitle}>{t('marketplace.catSeeds')}</h4>
            <p className={styles.categoryDesc}>{t('marketplace.catSeedsDesc')}</p>
          </article>

          {/* 3. Produce */}
          <article className={styles.categoryCard}>
            <span className={styles.categoryIcon} aria-hidden="true">🧺</span>
            <h4 className={styles.categoryTitle}>{t('marketplace.catProduce')}</h4>
            <p className={styles.categoryDesc}>{t('marketplace.catProduceDesc')}</p>
          </article>
        </div>
      </div>
    </TaskShell>
  );
}
