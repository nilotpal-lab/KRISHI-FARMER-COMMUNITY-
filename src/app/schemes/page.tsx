'use client';

import React from 'react';
import { TaskShell } from '@/components/shells/TaskShell';
import { useI18n } from '@/lib/i18n/context';
import styles from './Schemes.module.css';

interface SchemeData {
  id: string;
  name: { en: string; kn: string; hi: string };
  tagline: { en: string; kn: string; hi: string };
  benefit: { en: string; kn: string; hi: string };
  eligibility: { en: string; kn: string; hi: string };
  howToApply: { en: string; kn: string; hi: string };
  importantNote?: { en: string; kn: string; hi: string };
}

const SCHEMES_LIST: SchemeData[] = [
  {
    id: 'pm-kisan',
    name: {
      en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      kn: 'ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ)',
      hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
    },
    tagline: {
      en: 'Direct income support for landholding farming families.',
      kn: 'ಜಮೀನು ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ನೇರ ಆರ್ಥಿಕ ನೆರವು.',
      hi: 'कृषि भूमि वाले किसान परिवारों को प्रत्यक्ष आय सहायता।',
    },
    benefit: {
      en: '₹6,000 per year (in 3 equal instalments of ₹2,000 via DBT)',
      kn: 'ವಾರ್ಷಿಕ ₹೬,೦೦೦ (೩ ಕಂತುಗಳಲ್ಲಿ ತಲಾ ₹೨,೦೦೦ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ಜಮಾ)',
      hi: '₹6,000 प्रति वर्ष (3 किस्तों में ₹2,000-₹2,000 डीबीटी द्वारा)',
    },
    eligibility: {
      en: 'All landholding farmer families with cultivable land in their names.',
      kn: 'ತಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಸಾಗುವಳಿ ಜಮೀನು ಹೊಂದಿರುವ ಎಲ್ಲಾ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರು.',
      hi: 'सभी भूमिधारक किसान परिवार जिनके नाम पर कृषि भूमि दर्ज है।',
    },
    howToApply: {
      en: 'Complete eKYC via PM-Kisan portal, or visit local Gram One / CSC centre with land records.',
      kn: 'ಗ್ರಾಮ ಒನ್ (Gram One), ಬಾಪೂಜಿ ಸೇವಾ ಕೇಂದ್ರ ಅಥವಾ ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರದಲ್ಲಿ ಇ-ಕೆವೈಸಿ (eKYC) ಪೂರ್ಣಗೊಳಿಸಿ.',
      hi: 'ग्राम वन, सीएससी (CSC) केंद्र या पोर्टल पर जाकर ई-केवाईसी (eKYC) करवाएं।',
    },
  },
  {
    id: 'pmfby',
    name: {
      en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      kn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ಬೆಳೆ ವಿಮೆ)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)',
    },
    tagline: {
      en: 'Comprehensive crop insurance against natural weather hazards and localized pest losses.',
      kn: 'ಪ್ರಕೃತಿ ವಿಕೋಪ, ಅನಾವೃಷ್ಟಿ, ಪ್ರವಾಹ ಹಾಗೂ ಕೀಟ ಬಾಧೆಯಿಂದ ಬೆಳೆ ಹಾನಿಯಾದರೆ ಸಮಗ್ರ ವಿಮಾ ರಕ್ಷಣೆ.',
      hi: 'सूखा, बाढ़, कीट प्रकोप और बेमौसम बारिश से फसल नुकसान पर व्यापक सुरक्षा।',
    },
    benefit: {
      en: 'Covers full sum insured; farmer premium only 1.5% to 2.0% for food crops',
      kn: 'ಆಹಾರ ಧಾನ್ಯಗಳಿಗೆ ಕೇವಲ ೧.೫% ರಿಂದ ೨.೦% ಪ್ರೀಮಿಯಂ; ಪೂರ್ಣ ನಷ್ಟ ಪರಿಹಾರ',
      hi: 'खाद्यान्न फसलों पर केवल 1.5% से 2.0% प्रीमियम; पूरा बीमित क्लेम',
    },
    eligibility: {
      en: 'All farmers growing notified crops in notified areas (both loanee and non-loanee).',
      kn: 'ಅಧಿಸೂಚಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ ನಿಗದಿತ ಬೆಳೆ ಬೆಳೆಯುವ ಎಲ್ಲಾ ಸಾಲಗಾರ ಮತ್ತು ಸಾಲೇತರ ರೈತರು.',
      hi: 'अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले सभी किसान।',
    },
    howToApply: {
      en: 'Apply at Raitha Samparka Kendra, nearest bank branch, or online via Samrakshane / PMFBY portal.',
      kn: 'ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK), ಬ್ಯಾಂಕ್ ಶಾಖೆ ಅಥವಾ ಸಂರಕ್ಷಣೆ (Samrakshane) ಪೋರ್ಟಲ್ ಮೂಲಕ.',
      hi: 'नज़दीकी बैंक शाखा, कृषि विभाग कार्यालय या फसल बीमा पोर्टल से आवेदन करें।',
    },
    importantNote: {
      en: 'Report localized crop loss within 72 hours via Crop Insurance app or helpline 1800-180-1551.',
      kn: 'ಬೆಳೆ ಹಾನಿಯಾದ ೭೨ ಗಂಟೆಗಳ ಒಳಗೆ ಕ್ರಾಪ್ ಇನ್ಶೂರೆನ್ಸ್ ಆ್ಯಪ್ ಅಥವಾ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ ದೂರು ದಾಖಲಿಸಬೇಕು.',
      hi: 'फसल नुकसान होने के 72 घंटे के भीतर ऐप पर या टोल-फ्री 1800-180-1551 पर सूचना देना अनिवार्य है।',
    },
  },
  {
    id: 'kcc',
    name: {
      en: 'Kisan Credit Card (KCC) Crop Loan',
      kn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಬೆಳೆ ಸಾಲ',
      hi: 'किसान क्रेडिट कार्ड (केसीसी) रियायती ऋण',
    },
    tagline: {
      en: 'Timely and adequate credit support for crop cultivation and farm inputs at subsidized interest.',
      kn: 'ಬೆಳೆ ಸಾಗುವಳಿ, ಬೀಜ ಮತ್ತು ಗೊಬ್ಬರ ಖರೀದಿಗಾಗಿ ಸಬ್ಸಿಡಿ ಬಡ್ಡಿದರದಲ್ಲಿ ಸುಲಭ ಸಾಲ ಸೌಲಭ್ಯ.',
      hi: 'खाद-बीज और खेती के खर्चों के लिए रियायती ब्याज दर पर आसान ऋण सुविधा।',
    },
    benefit: {
      en: 'Up to ₹3 Lakh at 4% effective interest with prompt repayment incentive',
      kn: 'ಸಕಾಲಕ್ಕೆ ಮರುಪಾವತಿಸಿದರೆ ಕೇವಲ ೪% ಬಡ್ಡಿದರದಲ್ಲಿ ₹೩ ಲಕ್ಷದವರೆಗೆ ಬೆಳೆ ಸಾಲ',
      hi: 'समय पर चुकाने पर केवल 4% प्रभावी ब्याज दर पर ₹3 लाख तक का कृषि ऋण',
    },
    eligibility: {
      en: 'Owner cultivators, tenant farmers, oral lessees, and sharecroppers.',
      kn: 'ಸ್ವಂತ ಜಮೀನು ಹೊಂದಿರುವ ರೈತರು ಹಾಗೂ ಗೇಣಿ ರೈತರು ಸಹ ಈ ಯೋಜನೆಗೆ ಅರ್ಹರು.',
      hi: 'स्वयं खेती करने वाले किसान, बटाईदार और काश्तकार सभी पात्र हैं।',
    },
    howToApply: {
      en: 'Submit land RTC records and Aadhaar to your nearest nationalized bank, Grameena Bank, or PACS.',
      kn: 'ಪಹಣಿ (RTC), ಆಧಾರ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಪ್ರತಿಗಳನ್ನು ನಿಮ್ಮ ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕ್ ಅಥವಾ ಸೊಸೈಟಿಗೆ ನೀಡಿ.',
      hi: 'खतौनी, आधार कार्ड और बैंक पासबुक लेकर नज़दीकी ग्रामीण बैंक या बैंक शाखा में जमा करें।',
    },
  },
  {
    id: 'kusum',
    name: {
      en: 'PM-KUSUM (Solar Agriculture Water Pump)',
      kn: 'ಪಿಎಂ-ಕುಸುಮ್ (ಸೌರ ಕೃಷಿ ಪಂಪ್‌ಸೆಟ್ ಯೋಜನೆ)',
      hi: 'पीएम-कुसुम (सोलर कृषि पंप योजना)',
    },
    tagline: {
      en: 'Subsidized standalone solar irrigation pumps for reliable day-time farming electricity.',
      kn: 'ಹಗಲು ವೇಳೆ ವಿಶ್ವಾಸಾರ್ಹ ನೀರಾವರಿಗಾಗಿ ಸೌರಶಕ್ತಿ ಚಾಲಿತ ಕೃಷಿ ಪಂಪ್‌ಸೆಟ್‌ಗಳಿಗೆ ಸಬ್ಸಿಡಿ.',
      hi: 'दिन में सिंचाई के लिए सब्सिडी पर सोलर वाटर पंप लगाने की योजना।',
    },
    benefit: {
      en: 'Up to 60% combined Central and State Government subsidy on 3HP to 7.5HP pumps',
      kn: '೩ ಹೆಚ್‌ಪಿಯಿಂದ ೭.೫ ಹೆಚ್‌ಪಿ ಪಂಪ್‌ಗಳಿಗೆ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರದಿಂದ ೬೦% ವರೆಗೆ ಸಬ್ಸಿಡಿ',
      hi: '3 से 7.5 एचपी पंप पर केंद्र व राज्य सरकार द्वारा 60% तक का अनुदान',
    },
    eligibility: {
      en: 'Farmers with verified borewell or open water source seeking grid-independent solar pumping.',
      kn: 'ಹೊಲದಲ್ಲಿ ಕೊಳವೆಬಾವಿ ಅಥವಾ ತೆರೆದ ಬಾವಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ರೈತರು.',
      hi: 'जिन किसानों के पास बोरवेल या सिंचाई का खुला स्रोत उपलब्ध है।',
    },
    howToApply: {
      en: 'Apply online through state renewable energy development agency (e.g. KREDL in Karnataka).',
      kn: 'ಕರ್ನಾಟಕ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಅಭಿವೃದ್ಧಿ ನಿಯಮಿತ (KREDL) ಅಥವಾ ಮಹಾಉರ್ಜಾ ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
      hi: 'राज्य की नोडल एजेंसी (जैसे क्रेडेल / महाऊर्जा) के आधिकारिक पोर्टल से आवेदन करें।',
    },
  },
];

export default function SchemesPage() {
  const { t, locale } = useI18n();

  const playTTS = (scheme: SchemeData) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const name = scheme.name[locale] || scheme.name.en;
    const benefit = scheme.benefit[locale] || scheme.benefit.en;
    const apply = scheme.howToApply[locale] || scheme.howToApply.en;
    const textToSpeak = `${name}. ${locale === 'kn' ? 'ಸೌಲಭ್ಯ' : locale === 'hi' ? 'लाभ' : 'Benefit'}: ${benefit}. ${locale === 'kn' ? 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ' : locale === 'hi' ? 'आवेदन का तरीका' : 'How to apply'}: ${apply}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('schemes.title')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('schemes.title')}</h1>
          <p className={styles.subtitle}>{t('schemes.subtitle')}</p>
        </header>

        {/* Physical Documents Checklist Card (Gram Panchayat) */}
        <section className={styles.checklistCard} aria-labelledby="checklist-h">
          <h2 id="checklist-h" className={styles.checklistTitle}>
            <span>📋</span>
            <span>{t('schemes.documentsChecklist')}</span>
          </h2>
          <div className={styles.checklistItems}>
            <div className={styles.checkItem}>
              <span>📄</span>
              <span>{t('schemes.docRtc')}</span>
            </div>
            <div className={styles.checkItem}>
              <span>🆔</span>
              <span>{t('schemes.docAadhaar')}</span>
            </div>
            <div className={styles.checkItem}>
              <span>🏦</span>
              <span>{t('schemes.docPassbook')}</span>
            </div>
          </div>
        </section>

        {/* Schemes List */}
        <section className={styles.schemeList} aria-label={t('schemes.title')}>
          {SCHEMES_LIST.map((scheme) => {
            const name = scheme.name[locale] || scheme.name.en;
            const tagline = scheme.tagline[locale] || scheme.tagline.en;
            const benefit = scheme.benefit[locale] || scheme.benefit.en;
            const eligibility = scheme.eligibility[locale] || scheme.eligibility.en;
            const howToApply = scheme.howToApply[locale] || scheme.howToApply.en;
            const note = scheme.importantNote ? scheme.importantNote[locale] || scheme.importantNote.en : null;

            return (
              <article key={scheme.id} className={styles.schemeCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.schemeTitleWrap}>
                    <h2 className={styles.schemeName}>{name}</h2>
                    <p className={styles.desc}>{tagline}</p>
                    <span className={styles.benefitBadge}>💰 {benefit}</span>
                  </div>
                </div>

                <div className={styles.detailsGrid}>
                  <div>
                    <strong>{locale === 'kn' ? 'ಯಾರು ಅರ್ಹರು?: ' : locale === 'hi' ? 'पात्रता: ' : 'Eligibility: '}</strong>
                    <span>{eligibility}</span>
                  </div>
                  <div>
                    <strong>{locale === 'kn' ? 'ಅರ್ಜಿ ವಿಧಾನ: ' : locale === 'hi' ? 'आवेदन कैसे करें: ' : 'How to apply: '}</strong>
                    <span>{howToApply}</span>
                  </div>
                  {note && (
                    <div style={{ color: '#992830', fontWeight: 600, marginTop: '2px' }}>
                      <strong>⚠️ {locale === 'kn' ? 'ಗಮನಿಸಿ: ' : locale === 'hi' ? 'महत्वपूर्ण सूचना: ' : 'Important: '}</strong>
                      <span>{note}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    className={styles.ttsBtn}
                    onClick={() => playTTS(scheme)}
                    title="Listen to scheme details"
                    aria-label="Listen to scheme details"
                  >
                    🔊 <span>{locale === 'kn' ? 'ವಿವರ ಕೇಳಿ' : locale === 'hi' ? 'योजना सुनें' : 'Listen'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* National Kisan Call Centre Banner */}
        <div className={styles.helplineBox} role="note">
          <span style={{ fontSize: '22px' }}>📞</span>
          <span>
            {locale === 'kn'
              ? 'ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆಗಳ ಉಚಿತ ಸಹಾಯವಾಣಿ: 1800-180-1551 (ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್)'
              : locale === 'hi'
              ? 'सरकारी कृषि योजनाओं के लिए टोल-फ्री हेल्पलाइन: 1800-180-1551 (किसान कॉल सेंटर)'
              : 'National Toll-Free Agriculture Helpline: 1800-180-1551 (Kisan Call Centre)'}
          </span>
        </div>
      </div>
    </TaskShell>
  );
}
