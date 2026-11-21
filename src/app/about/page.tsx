'use client';

import React, { useState } from 'react';
import { TaskShell } from '@/components/shells/TaskShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useI18n } from '@/lib/i18n/context';
import styles from './About.module.css';

interface LaterModalState {
  title: string;
  description: string;
}

export default function AboutPage() {
  const { t } = useI18n();
  const [activeModal, setActiveModal] = useState<LaterModalState | null>(null);

  const laterFeatures = [
    {
      label: t('later.account'),
      title: t('later.account'),
      description: t('later.accountDesc'),
    },
    {
      label: t('later.forum'),
      title: t('later.forum'),
      description: t('later.forumDesc'),
    },
    {
      label: t('later.learn'),
      title: t('later.learn'),
      description: t('later.learnDesc'),
    },
    {
      label: t('later.voice'),
      title: t('later.voice'),
      description: t('later.voiceDesc'),
    },
    {
      label: t('later.phone'),
      title: t('later.phone'),
      description: t('later.phoneDesc'),
    },
  ];

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('nav.about')}>
      <div className={styles.container}>
        {/* Mission Card */}
        <section className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant="mint">{t('about.p1Badge')}</Badge>
            <Badge variant="sun">{t('about.academicDemoBadge')}</Badge>
          </div>
          <h1 className={styles.title}>{t('brand.title')}</h1>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-leaf)' }}>
            {t('brand.tagline')}
          </p>
          <p style={{ color: 'var(--color-ink)', lineHeight: '1.6' }}>
            {t('about.academicNotice')}
          </p>
        </section>

        {/* Field Research & Farm Visit Foundation */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{t('about.researchTitle')}</h2>
          <p style={{ color: 'var(--color-ink)', lineHeight: '1.5', fontSize: '14px' }}>
            {t('about.researchLead')}
          </p>

          <div className={styles.photoGrid}>
            <div className={styles.photoCard}>
              <img
                src="/assets/farmers/farmer_smartphone.jpg"
                alt="Farmer using mobile device in field"
                className={styles.photoImg}
              />
              <div className={styles.photoCaption}>
                <b>{t('about.card1Title')}</b>
                {t('about.card1Desc')}
              </div>
            </div>

            <div className={styles.photoCard}>
              <img
                src="/assets/farmers/annappa_gowda.jpg"
                alt="Farmer Annappa Gowda"
                className={styles.photoImg}
              />
              <div className={styles.photoCaption}>
                <b>{t('about.card2Title')}</b>
                {t('about.card2Desc')}
              </div>
            </div>

            <div className={styles.photoCard}>
              <img
                src="/assets/crops/paddy_mandya.jpg"
                alt="Irrigated fields in Mandya"
                className={styles.photoImg}
              />
              <div className={styles.photoCaption}>
                <b>{t('about.card3Title')}</b>
                {t('about.card3Desc')}
              </div>
            </div>

            <div className={styles.photoCard}>
              <img
                src="/assets/crops/tomato_crop.jpg"
                alt="Tomato crop inspection"
                className={styles.photoImg}
              />
              <div className={styles.photoCaption}>
                <b>{t('about.card4Title')}</b>
                {t('about.card4Desc')}
              </div>
            </div>
          </div>
        </section>

        {/* Community Rules Card */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{t('about.rulesTitle')}</h2>
          <ol className={styles.rulesList}>
            <li>{t('about.rule1')}</li>
            <li>{t('about.rule2')}</li>
            <li>{t('about.rule3')}</li>
            <li>{t('about.rule4')}</li>
          </ol>
        </section>

        {/* Privacy & Safety Card */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{t('about.privacyTitle')}</h2>
          <p style={{ color: 'var(--color-ink)', lineHeight: '1.6' }}>
            {t('about.privacyNotice')}
          </p>
        </section>

        {/* Planned Features (Later) Card */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{t('later.title')}</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
            {t('later.desc')}
          </p>

          <div className={styles.laterGrid}>
            {laterFeatures.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.laterBtn}
                onClick={() =>
                  setActiveModal({
                    title: item.title,
                    description: item.description,
                  })
                }
              >
                <span>{item.label}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Explanatory Modal for Later features */}
      <Dialog
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={activeModal?.title || t('common.later')}
        footer={
          <Button variant="solid" onClick={() => setActiveModal(null)}>
            {t('common.close')}
          </Button>
        }
      >
        <p style={{ lineHeight: '1.6', fontSize: '15px' }}>
          {activeModal?.description}
        </p>
      </Dialog>
    </TaskShell>
  );
}
