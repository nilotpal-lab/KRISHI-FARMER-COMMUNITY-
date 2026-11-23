'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { Locale } from '@/types';
import styles from './Welcome.module.css';

interface LanguageOption {
  code: Locale;
  nativeTitle: string;
  nativeSub: string;
  badge: string;
  className: string;
  speechText: string;
  speechLang: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    nativeTitle: 'English',
    nativeSub: 'Continue in English',
    badge: 'A',
    className: styles.cardEn,
    speechText: 'Welcome to Krishi',
    speechLang: 'en-IN',
  },
  {
    code: 'kn',
    nativeTitle: 'ಕನ್ನಡ',
    nativeSub: 'ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ',
    badge: 'ಕ',
    className: styles.cardKn,
    speechText: 'ಕೃಷಿಗೆ ಸುಸ್ವಾಗತ',
    speechLang: 'kn-IN',
  },
  {
    code: 'hi',
    nativeTitle: 'हिन्दी',
    nativeSub: 'हिन्दी में आगे बढ़ें',
    badge: 'क',
    className: styles.cardHi,
    speechText: 'कृषि में आपका स्वागत है',
    speechLang: 'hi-IN',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const { setLocale, t } = useI18n();
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeSpeaking, setActiveSpeaking] = useState<Locale | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window
    ) {
      setSpeechSupported(true);
    }
  }, []);

  const handleSelectLanguage = (code: Locale) => {
    // 1. Save locale using standard cookie logic
    if (typeof document !== 'undefined') {
      document.cookie = `krishi_locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = code;
    }
    // 2. Update context state
    setLocale(code);
    // 3. Navigate directly to the forum / home feed in guest mode
    router.push('/');
  };

  const handleSpeak = (e: React.MouseEvent, lang: LanguageOption) => {
    e.stopPropagation(); // Prevent card selection / navigation

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (lang.code === 'kn') {
      try {
        const audio = new Audio(`/api/tts?lang=kn&text=${encodeURIComponent(lang.speechText)}`);
        audio.onplay = () => setActiveSpeaking(lang.code);
        audio.onended = () => setActiveSpeaking(null);
        audio.onerror = () => setActiveSpeaking(null);
        audio.play();
        return;
      } catch {
        // fallback to speech synthesis below
      }
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(lang.speechText);
      utterance.lang = lang.speechLang;
      utterance.rate = 0.9; // Clear pacing for clarity

      // Try finding an exact matched voice if browser supports it
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === lang.speechLang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(lang.code));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setActiveSpeaking(lang.code);
      utterance.onend = () => setActiveSpeaking(null);
      utterance.onerror = () => setActiveSpeaking(null);

      window.speechSynthesis.speak(utterance);
    } catch {
      // Friendly fallback: do not crash on speech failure
      setActiveSpeaking(null);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.mascotFrame}>
            <img
              src="/assets/farmers/mascot_kisan.svg"
              alt="Krishi Mascot"
              className={styles.mascotImg}
              width={84}
              height={84}
            />
          </div>
          <span className={styles.brandEyebrow}>KRISHI · ಕೃಷಿ · कृषि</span>
          <h1 className={styles.title}>ಸುಸ್ವಾಗತ · स्वागत है · Welcome</h1>
          <p className={styles.subtitle}>ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ · अपनी भाषा चुनें · Choose your language</p>
        </header>

        <section className={styles.cardList} aria-label={t('welcome.subtitle')}>
          {LANGUAGES.map((lang) => {
            const isSpeaking = activeSpeaking === lang.code;
            return (
              <div
                key={lang.code}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectLanguage(lang.code)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectLanguage(lang.code);
                  }
                }}
                className={`${styles.card} ${lang.className}`}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.scriptBadge} aria-hidden="true">
                    {lang.badge}
                  </div>
                  <div className={styles.cardText}>
                    <h2 className={styles.cardTitle}>{lang.nativeTitle}</h2>
                    <span className={styles.cardSub}>{lang.nativeSub}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(e, lang)}
                      className={`${styles.speakerBtn} ${
                        isSpeaking ? styles.speakerBtnActive : ''
                      }`}
                      aria-label={`${t('welcome.listenTooltip')}: ${lang.nativeTitle}`}
                      title={`${t('welcome.listenTooltip')}: ${lang.nativeTitle}`}
                    >
                      <Volume2 size={22} aria-hidden="true" />
                    </button>
                  )}
                  <ChevronRight size={20} className={styles.chevronIcon} aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </section>

        <p className={styles.footerNote}>
          ಕೃಷಿ ಸಮುದಾಯ · Krishi Farmer Community · कृषि किसान समुदाय
        </p>
      </div>
    </main>
  );
}
