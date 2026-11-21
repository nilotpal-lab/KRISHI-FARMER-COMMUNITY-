'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { LanguageModal } from '@/components/common/LanguageModal';
import { DemoBar } from '@/components/common/DemoBar';
import { KisanChatbot } from '@/components/common/KisanChatbot';
import { ArrowLeftIcon, GlobeIcon } from '@/components/ui/Icons';
import styles from './TaskShell.module.css';

interface TaskShellProps {
  children: React.ReactNode;
  backHref: string;
  backLabel?: string;
  title?: string;
}

export const TaskShell: React.FC<TaskShellProps> = ({
  children,
  backHref,
  backLabel,
  title,
}) => {
  const { t, locale } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langDisplay =
    locale === 'kn' ? 'ಕನ್ನಡ' : locale === 'hi' ? 'ಹಿन्दी' : 'English';

  return (
    <>
      <header className="nav">
        <div className="wrap nav__bar">
          <Link href={backHref} className={styles.backLink}>
            <ArrowLeftIcon size={16} />
            <span>{backLabel || t('common.back')}</span>
          </Link>

          {title && <span className={styles.headerTitle}>{title}</span>}

          <div className="nav__actions" style={{ marginLeft: 'auto' }}>
            <DemoBar />
            <button
              type="button"
              className={styles.langBtn}
              onClick={() => setIsLangOpen(true)}
              aria-label={t('nav.language')}
            >
              <GlobeIcon size={14} />
              <span>{langDisplay}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className={styles.mainContent}>
        <div className="wrap">
          {children}
        </div>
      </main>

      <footer className={styles.taskFooter}>
        <div className="wrap">
          <div className={styles.footerRow}>
            <div className={styles.footerBrand}>
              <Link href="/" className="nav__logo">
                <span className="mark" data-mark="leaf" aria-hidden="true" />
                <span>{t('brand.title')}</span>
              </Link>
              <p className={styles.footerSub}>
                {t('brand.subtitle')}
              </p>
            </div>
            <nav className={styles.footerNav} aria-label={t('footer.platform')}>
              <Link href="/">{t('nav.home')}</Link>
              <Link href="/communities">{t('nav.groups')}</Link>
              <Link href="/about">{t('footer.about')}</Link>
              <Link href="/admin">{t('footer.moderation')}</Link>
            </nav>
          </div>
          <div className={styles.footerLegal}>
            <span>{t('footer.legal')}</span>
            <span className={styles.credits}>{t('footer.credits')}</span>
          </div>
        </div>
        <KisanChatbot />
      </footer>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </>
  );
};
