'use client';

import React, { useState } from 'react';
import { TaskShell } from '@/components/shells/TaskShell';
import { useI18n } from '@/lib/i18n/context';
import styles from './Mandi.module.css';

interface MandiItem {
  key: string;
  icon: string;
  name: { en: string; kn: string; hi: string };
  variety: { en: string; kn: string; hi: string };
  modalPrice: number;
  bagPrice: number;
  unit: { en: string; kn: string; hi: string };
  arrivals: string;
  trend: 'up' | 'down' | 'stable';
  trendDiff: string;
}

const DISTRICT_MANDIS: Record<string, MandiItem[]> = {
  mandya: [
    {
      key: 'paddy',
      icon: '🌾',
      name: { en: 'Paddy (Dhan)', kn: 'ಭತ್ತ', hi: 'धान' },
      variety: { en: 'Sona Masoori Grade-A', kn: 'ಸೋನಾ ಮಸೂರಿ ಗ್ರೆಡ್-ಎ', hi: 'सोना मसूरी ग्रेड-ए' },
      modalPrice: 2350,
      bagPrice: 1175,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '850 Quintals',
      trend: 'up',
      trendDiff: '+₹30',
    },
    {
      key: 'sugarcane',
      icon: '🎋',
      name: { en: 'Sugarcane', kn: 'ಕಬ್ಬು', hi: 'गन्ना' },
      variety: { en: 'Co-86032 Commercial', kn: 'ಕೋ-೮೬೦೩೨ ತಳಿ', hi: 'सीओ-86032' },
      modalPrice: 3400,
      bagPrice: 170,
      unit: { en: '₹ / Tonne', kn: '₹ / ಟನ್', hi: '₹ / टन' },
      arrivals: '1,450 Tonnes',
      trend: 'stable',
      trendDiff: 'FRP Rate',
    },
    {
      key: 'ragi',
      icon: '🥣',
      name: { en: 'Finger Millet (Ragi)', kn: 'ರಾಗಿ', hi: 'रागी' },
      variety: { en: 'MR-1 Brown Ragi', kn: 'ಎಂಆರ್-೧ ನಾಟಿ ರಾಗಿ', hi: 'एमआर-1 देसी' },
      modalPrice: 3846,
      bagPrice: 1923,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '320 Quintals',
      trend: 'up',
      trendDiff: '+₹46 (MSP)',
    },
    {
      key: 'tomato',
      icon: '🍅',
      name: { en: 'Tomato', kn: 'ಟೊಮ್ಯಾಟೊ', hi: 'टमाटर' },
      variety: { en: 'Hybrid Red Tomato', kn: 'ಹೈಬ್ರಿಡ್ ಕೆಂಪು ಟೊಮ್ಯಾಟೊ', hi: 'हाइब्रिड लाल टमाटर' },
      modalPrice: 1850,
      bagPrice: 925,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '420 Quintals',
      trend: 'up',
      trendDiff: '+₹120',
    },
  ],
  dharwad: [
    {
      key: 'chilli',
      icon: '🌶️',
      name: { en: 'Dry Red Chilli', kn: 'ಒಣ ಮೆಣಸಿನಕಾಯಿ', hi: 'सूखी लाल मिर्च' },
      variety: { en: 'Byadagi Kaddi Special', kn: 'ಬ್ಯಾಡಗಿ ಕಡ್ಡಿ ವಿಶೇಷ', hi: 'ब्याडगी कड्डी' },
      modalPrice: 18500,
      bagPrice: 9250,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '240 Quintals',
      trend: 'up',
      trendDiff: '+₹400',
    },
    {
      key: 'cotton',
      icon: '🌱',
      name: { en: 'Raw Cotton', kn: 'ಹತ್ತಿ', hi: 'कपास' },
      variety: { en: 'DCH-32 Medium Staple', kn: 'ಡಿಸಿಎಚ್-೩೨ ಮಧ್ಯಮ ಎಳೆ', hi: 'डीसीएस-32' },
      modalPrice: 7250,
      bagPrice: 3625,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '510 Quintals',
      trend: 'down',
      trendDiff: '-₹50',
    },
    {
      key: 'onion',
      icon: '🧅',
      name: { en: 'Red Onion', kn: 'ಕೆಂಪು ಈರುಳ್ಳಿ', hi: 'लाल प्याज' },
      variety: { en: 'Bellary Medium Globe', kn: 'ಬಳ್ಳಾರಿ ಮಧ್ಯಮ ಗಾತ್ರ', hi: 'बेल्लारी मध्यम' },
      modalPrice: 2400,
      bagPrice: 1200,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '680 Quintals',
      trend: 'up',
      trendDiff: '+₹80',
    },
    {
      key: 'maize',
      icon: '🌽',
      name: { en: 'Yellow Maize', kn: 'ಮೆಕ್ಕೆಜೋಳ', hi: 'मक्का' },
      variety: { en: 'Feed Grade Yellow', kn: 'ಹಳದಿ ಮೆಕ್ಕೆಜೋಳ', hi: 'पीला मक्का' },
      modalPrice: 2100,
      bagPrice: 1050,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '520 Quintals',
      trend: 'stable',
      trendDiff: 'Stable',
    },
  ],
  kolar: [
    {
      key: 'tomato',
      icon: '🍅',
      name: { en: 'Tomato', kn: 'ಟೊಮ್ಯಾಟೊ', hi: 'टमाटर' },
      variety: { en: 'Kolar Local Box Grade', kn: 'ಕೋಲಾರ ಪೆಟ್ಟಿಗೆ ಗ್ರೇಡ್', hi: 'कोलार बॉक्स ग्रेड' },
      modalPrice: 1950,
      bagPrice: 975,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '1,200 Quintals',
      trend: 'up',
      trendDiff: '+₹150',
    },
    {
      key: 'chilli',
      icon: '🌶️',
      name: { en: 'Green Chilli', kn: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ', hi: 'हरी मिर्च' },
      variety: { en: 'G-4 Green Hot', kn: 'ಜಿ-೪ ಹಸಿರು ತಳಿ', hi: 'जी-4 तीखी' },
      modalPrice: 3200,
      bagPrice: 1600,
      unit: { en: '₹ / Quintal', kn: '₹ / ಕ್ವಿಂಟಾಲ್', hi: '₹ / क्विंटल' },
      arrivals: '180 Quintals',
      trend: 'down',
      trendDiff: '-₹100',
    },
  ],
};

export default function MandiPage() {
  const { t, locale } = useI18n();
  const [district, setDistrict] = useState<string>('mandya');

  const items = DISTRICT_MANDIS[district] || DISTRICT_MANDIS.mandya;

  const playTTS = (item: MandiItem) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const name = item.name[locale] || item.name.en;
    const priceText = `${name}. ${locale === 'kn' ? 'ಕ್ವಿಂಟಾಲ್‌ಗೆ ಬೆಲೆ' : locale === 'hi' ? 'क्विंटल भाव' : 'Price per quintal'}: ${item.modalPrice} ${locale === 'kn' ? 'ರೂಪಾಯಿ' : locale === 'hi' ? 'रुपये' : 'rupees'}. 50 ${locale === 'kn' ? 'ಕೆಜಿ ಚೀಲಕ್ಕೆ' : locale === 'hi' ? 'किलो बोरी' : 'kg bag'}: ${item.bagPrice} ${locale === 'kn' ? 'ರೂಪಾಯಿ' : locale === 'hi' ? 'रुपये' : 'rupees'}.`;

    const utterance = new SpeechSynthesisUtterance(priceText);
    utterance.lang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const districtOptions = [
    { key: 'mandya', en: 'Mandya APMC', kn: 'ಮಂಡ್ಯ APMC', hi: 'मांड्या APMC' },
    { key: 'dharwad', en: 'Dharwad APMC', kn: 'ಧಾರವಾಡ APMC', hi: 'धारवाड़ APMC' },
    { key: 'kolar', en: 'Kolar APMC Yard', kn: 'ಕೋಲಾರ APMC', hi: 'कोलार APMC' },
  ];

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('mandi.title')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('mandi.title')}</h1>
          <p className={styles.subtitle}>{t('mandi.subtitle')}</p>
        </header>

        {/* District Selector */}
        <div className={styles.districtBar}>
          <span className={styles.districtLabel}>{t('mandi.selectDistrict')}</span>
          <div className={styles.districtChips} role="tablist">
            {districtOptions.map((d) => {
              const active = district === d.key;
              const name = d[locale] || d.en;
              return (
                <button
                  key={d.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDistrict(d.key)}
                  className={`${styles.districtChip} ${active ? styles.districtChipActive : ''}`}
                >
                  <span>📍</span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Commodities Rates Grid */}
        <div className={styles.ratesGrid} aria-live="polite">
          {items.map((item) => {
            const cropName = item.name[locale] || item.name.en;
            const variety = item.variety[locale] || item.variety.en;
            const unit = item.unit[locale] || item.unit.en;

            return (
              <article key={item.key} className={styles.rateCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cropNameWrap}>
                    <span className={styles.cropIcon}>{item.icon}</span>
                    <div>
                      <h2 className={styles.cropName}>{cropName}</h2>
                      <p className={styles.varietyName}>{variety}</p>
                    </div>
                  </div>

                  <span
                    className={`${styles.trendBadge} ${
                      item.trend === 'up'
                        ? styles.trendUp
                        : item.trend === 'down'
                        ? styles.trendDown
                        : styles.trendStable
                    }`}
                  >
                    <span>
                      {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '▬'}
                    </span>
                    <span>{item.trendDiff}</span>
                  </span>
                </div>

                {/* Price Display: Quintal & 50kg Bag */}
                <div className={styles.priceRow}>
                  <div className={styles.priceCol}>
                    <span className={styles.priceLabel}>{unit}</span>
                    <span className={styles.priceValue}>₹{item.modalPrice.toLocaleString()}</span>
                  </div>
                  <div className={styles.priceCol}>
                    <span className={styles.priceLabel}>{t('mandi.bagPrice')}</span>
                    <span className={styles.bagValue}>₹{item.bagPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.arrivalText}>
                    📦 {t('mandi.arrivals')}: {item.arrivals}
                  </span>

                  <button
                    type="button"
                    className={styles.speakBtn}
                    onClick={() => playTTS(item)}
                    title="Listen to price"
                    aria-label="Listen to price"
                  >
                    🔊 <span>{locale === 'kn' ? 'ದರ ಕೇಳಿ' : locale === 'hi' ? 'भाव सुनें' : 'Listen'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </TaskShell>
  );
}
