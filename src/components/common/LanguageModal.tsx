'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Locale } from '@/types';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import styles from './LanguageModal.module.css';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES: { code: Locale; selfLabel: string; englishLabel: string; langTag: string }[] = [
  { code: 'kn', selfLabel: 'ಕನ್ನಡ', englishLabel: 'Kannada', langTag: 'kn-IN' },
  { code: 'en', selfLabel: 'English', englishLabel: 'English', langTag: 'en-IN' },
  { code: 'hi', selfLabel: 'हिन्दी', englishLabel: 'Hindi', langTag: 'hi-IN' }
];

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { locale, setLocale, t } = useI18n();
  const [selected, setSelected] = useState<Locale>(locale);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) setSelected(locale);
  }, [isOpen, locale]);

  const handleApply = () => {
    setLocale(selected);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('nav.language')}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="solid" onClick={handleApply}>
            {t('common.apply')}
          </Button>
        </>
      }
    >
      <div className={styles.optionsList} role="radiogroup" aria-label={t('nav.language')}>
        {LANGUAGES.map((lang) => {
          const isCurrent = selected === lang.code;
          const displayPrimary =
            locale === 'kn'
              ? lang.code === 'kn' ? 'ಕನ್ನಡ' : lang.code === 'hi' ? 'ಹಿಂದಿ' : 'ಇಂಗ್ಲಿಷ್'
              : locale === 'hi'
              ? lang.code === 'hi' ? 'हिंदी' : lang.code === 'kn' ? 'कन्नड़' : 'अंग्रेज़ी'
              : lang.englishLabel;
          const displaySecondary =
            locale === 'en' ? (lang.code === 'en' ? 'English' : lang.selfLabel) : lang.englishLabel;

          return (
            <label
              key={lang.code}
              className={`${styles.optionItem} ${isCurrent ? styles.selected : ''}`}
              lang={lang.code}
            >
              <div className={styles.labelWrapper}>
                <span className={styles.selfLabel}>{displayPrimary}</span>
                <span className={styles.englishLabel}>{displaySecondary}</span>
              </div>
              <input
                type="radio"
                name="krishi_language"
                value={lang.code}
                checked={isCurrent}
                onChange={() => setSelected(lang.code)}
                className={styles.radioInput}
              />
            </label>
          );
        })}
      </div>
    </Dialog>
  );
};
