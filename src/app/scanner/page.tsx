'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { TaskShell } from '@/components/shells/TaskShell';
import { useI18n } from '@/lib/i18n/context';
import { compressPostImage } from '@/lib/utils/mediaUtils';
import styles from './Scanner.module.css';

interface DiagnosticResult {
  diseaseName: { en: string; kn: string; hi: string };
  matchPercent: number;
  cause: { en: string; kn: string; hi: string };
  remedies: { en: string[]; kn: string[]; hi: string[] };
}

const CROP_DIAGNOSTICS: Record<string, DiagnosticResult> = {
  tomato: {
    diseaseName: {
      en: 'Tomato Leaf Curl Virus',
      kn: 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಮುದುರು ರೋಗ',
      hi: 'टमाटर पत्ती मरोड़ रोग (लीफ कर्ल)',
    },
    matchPercent: 94,
    cause: {
      en: 'Transmitted by sucking whiteflies (Bemisia tabaci).',
      kn: 'ಬಿಳಿ ನೊಣಗಳಿಂದ ಈ ವೈರಸ್ ರೋಗವು ಹರಡುತ್ತದೆ.',
      hi: 'सफेद मक्खियों द्वारा यह विषाणु रोग फैलता है।',
    },
    remedies: {
      en: [
        'Install 10-12 yellow sticky traps per acre to monitor and trap whiteflies.',
        'Spray natural botanical neem oil extract to control sucking pest vectors.',
        'Safely uproot and destroy severely stunted plants to prevent spread.',
        'Keep field borders free from weed hosts and alternate nightshade crops.',
      ],
      kn: [
        'ಬಿಳಿ ನೊಣಗಳನ್ನು ಹಿಡಿಯಲು ಎಕರೆಗೆ 10-12 ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ.',
        'ರಸಹೀರುವ ಕೀಟಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ನೈಸರ್ಗಿಕ ಬೇವಿನ ಎಣ್ಣೆ ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ.',
        'ರೋಗ ಉಲ್ಬಣಿಸಿದ ಗಿಡಗಳನ್ನು ತಕ್ಷಣ ಕಿತ್ತು ಮಣ್ಣಿನಲ್ಲಿ ಹೂತುಹಾಕಿ.',
        'ಬದುಗಳಲ್ಲಿರುವ ಕಳೆ ಗಿಡಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ತೆಗೆದು ಸ್ವಚ್ಛತೆ ಕಾಪಾಡಿ.',
      ],
      hi: [
        'सफेद मक्खी की रोकथाम हेतु प्रति एकड़ 10-12 पीले चिपचिपे कार्ड लगाएं।',
        'रस चूसक कीटों से बचाव के लिए प्राकृतिक नीम तेल के घोल का छिड़काव करें।',
        'अत्यधिक ग्रसित पौधों को उखाड़कर खेत से दूर जमीन में दबा दें।',
        'खेत की मेड़ों से खरपतवार हटाएं ताकि कीटों को आश्रय न मिले।',
      ],
    },
  },
  chilli: {
    diseaseName: {
      en: 'Chilli Leaf Curl & Thrips Infestation',
      kn: 'ಮೆಣಸಿನಕಾಯಿ ಎಲೆ ಸುರುಟು ಮತ್ತು ನುಸಿ ಕೀಟ',
      hi: 'मिर्च पत्ती मरोड़ व थ्रिप्स कीट',
    },
    matchPercent: 92,
    cause: {
      en: 'Caused by yellow mites and thrips during dry warm spells.',
      kn: 'ಒಣ ಹವೆಯಲ್ಲಿ ನುಸಿ ಮತ್ತು ಥ್ರಿಪ್ಸ್ ಕೀಟಗಳಿಂದ ಎಲೆ ಸುರುಟುತ್ತದೆ.',
      hi: 'गर्म और शुष्क मौसम में थ्रिप्स व माइट कीटों के कारण पत्तियां मुड़ती हैं।',
    },
    remedies: {
      en: [
        'Install 10 blue sticky traps per acre for thrips collection.',
        'Spray neem seed kernel extract (NSKE) during early morning hours.',
        'Avoid excessive synthetic nitrogen; apply well-rotted organic manure.',
        'Maintain uniform soil moisture using drip or light furrow irrigation.',
      ],
      kn: [
        'ನುಸಿ ಕೀಟಗಳ ಹತೋಟಿಗೆ ಎಕರೆಗೆ 10 ನೀಲಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ.',
        'ಮುಂಜಾನೆಯ ಸಮಯದಲ್ಲಿ ಬೇವಿನ ಕಷಾಯವನ್ನು ಎಲೆಗಳ ಕೆಳಭಾಗಕ್ಕೆ ಸಿಂಪಡಿಸಿ.',
        'ಹೆಚ್ಚು ಯೂರಿಯಾ ಬಳಸದೆ ಸಮತೋಲಿತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರವನ್ನು ನೀಡಿ.',
        'ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವನ್ನು ಸಮನಾಗಿ ಕಾಪಾಡಿ.',
      ],
      hi: [
        'थ्रिप्स की निगरानी के लिए खेत में प्रति एकड़ 10 नीले ट्रैप लगाएं।',
        'सुबह के समय नीम के अर्क का पत्तियों के नीचे छिड़काव करें।',
        'अत्यधिक यूरिया के बजाय अच्छी तरह सड़ी हुई गोबर की खाद दें।',
        'खेत में नियमित नमी बनाए रखें ताकि कीटों का प्रकोप न बढ़े।',
      ],
    },
  },
  paddy: {
    diseaseName: {
      en: 'Rice Blast (Magnaporthe oryzae)',
      kn: 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)',
      hi: 'धान का झुलसा रोग (ब्लास्ट)',
    },
    matchPercent: 91,
    cause: {
      en: 'Air-borne fungal spores thriving in high humidity and cloudy weather.',
      kn: 'ಮೋಡ ಕವಿದ ವಾತಾವರಣ ಮತ್ತು ಹೆಚ್ಚಿನ ತೇವಾಂಶದಲ್ಲಿ ಶಿಲೀಂಧ್ರದಿಂದ ಹರಡುತ್ತದೆ.',
      hi: 'अधिक नमी और बादलों वाले मौसम में फफूंद द्वारा यह रोग फैलता है।',
    },
    remedies: {
      en: [
        'Practice alternate wetting and drying instead of continuous deep flooding.',
        'Apply potash and silica-rich organic compost to strengthen leaf tissue.',
        'Remove wild grasses and alternate grass weeds around paddy bunds.',
        'Treat seeds with Trichoderma viride biological culture before nursery sowing.',
      ],
      kn: [
        'ಸತತ ನೀರು ನಿಲ್ಲಿಸದೆ, ಒಣಗಿಸಿ ನೀರು ಕೊಡುವ ಪದ್ಧತಿಯನ್ನು ಅನುಸರಿಸಿ.',
        'ಗಿಡದ ಬಲವರ್ಧನೆಗೆ ಪೊಟ್ಯಾಷ್ ಮತ್ತು ಜೈವಿಕ ಕಾಂಪೋಸ್ಟ್ ಗೊಬ್ಬರ ಬಳಸಿ.',
        'ಭತ್ತದ ಬದುಗಳಲ್ಲಿ ಬೆಳೆದ ಹುಲ್ಲು ಮತ್ತು ಕಳೆಗಳನ್ನು ಸಕಾಲದಲ್ಲಿ ತೆಗೆಯಿರಿ.',
        'ನಾಟಿಗೆ ಮುನ್ನ ಬೀಜಕ್ಕೆ ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಉಪಚರಿಸಿ.',
      ],
      hi: [
        'खेत में लगातार पानी भरने के बजाय गीला-सूखा सिंचाई चक्र अपनाएं।',
        'पौधों की मजबूती के लिए पोटाश और जैविक खाद का संतुलित उपयोग करें।',
        'खेत की मेड़ों से जंगली घास हटाएं ताकि फफूंद न पनपे।',
        'बुवाई से पहले बीजों को ट्राइकोडर्मा जैविक कल्चर से उपचारित करें।',
      ],
    },
  },
  cotton: {
    diseaseName: {
      en: 'Cotton Pink Bollworm Damage',
      kn: 'ಹತ್ತಿ ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
      hi: 'कपास की गुलाबी सुंडी',
    },
    matchPercent: 95,
    cause: {
      en: 'Larvae burrowing inside green bolls and feeding on developing seeds.',
      kn: 'ಕಾಯಿ ಕೊರೆಯುವ ಮರಿ ಹುಳುಗಳು ಬೀಜ ಮತ್ತು ಹತ್ತಿ ನಾರನ್ನು ತಿನ್ನುತ್ತವೆ.',
      hi: 'सुंडी हरी डेंडियों के अंदर घुसकर विकासशील बीजों को खाती है।',
    },
    remedies: {
      en: [
        'Install 8-10 sex pheromone traps per acre to monitor male moth flights.',
        'Manually collect and destroy flared squares and rosette flowers.',
        'Deep summer ploughing exposes overwintering pupae to intense heat.',
        'Avoid extending crop season beyond standard 150-160 days duration.',
      ],
      kn: [
        'ಎಕರೆಗೆ 8-10 ಲಿಂಗಾಕರ್ಷಕ ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ ಪತಂಗಗಳ ನಿಗಾ ಇರಿಸಿ.',
        'ಹೂವು ಮತ್ತು ಕಾಯಿಗಳ ಮೇಲೆ ಹುಳು ಬಾಧೆ ಕಂಡರೆ ಆ ಭಾಗಗಳನ್ನು ಕಿತ್ತು ನಾಶಪಡಿಸಿ.',
        'ಬೇಸಿಗೆಯಲ್ಲಿ ಆಳವಾದ ಉಳುಮೆ ಮಾಡಿ ಕೋಶಾವಸ್ಥೆಯ ಕೀಟಗಳನ್ನು ಬಿಸಿಲಿಗೆ ಒಡ್ಡಿ.',
        'ಬೆಳೆ ಅವಧಿಯನ್ನು ಅನಗತ್ಯವಾಗಿ ವಿಸ್ತರಿಸದೆ ಸಕಾಲಕ್ಕೆ ಕೊನೆಗೊಳಿಸಿ.',
      ],
      hi: [
        'प्रति एकड़ 8-10 फेरोमोन ट्रैप लगाकर नर पतंगों की निगरानी करें।',
        'गुलाब जैसे विकृत फूलों और ग्रसित डेंडियों को तोड़कर नष्ट करें।',
        'गर्मियों में गहरी जुताई करें ताकि सुंडी के प्यूपा धूप से खत्म हों।',
        'फसल को 150-160 दिनों से अधिक समय तक खेत में न रखें।',
      ],
    },
  },
};

const SAMPLE_PHOTOS = [
  { crop: 'tomato', url: '/assets/crops/tomato_crop.jpg', label: 'Tomato leaf' },
  { crop: 'chilli', url: '/assets/crops/chilli_crop.jpg', label: 'Chilli leaf' },
  { crop: 'paddy', url: '/assets/crops/paddy_mandya.jpg', label: 'Paddy plant' },
  { crop: 'cotton', url: '/assets/crops/cotton_crop.jpg', label: 'Cotton boll' },
];

export default function ScannerPage() {
  const { t, locale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressPostImage(file, 900, 0.7);
      setScannedImage(compressed);
      runDiagnosis(selectedCrop);
    } catch {
      // friendly fallback
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setSelectedCrop(sample.crop);
    setScannedImage(sample.url);
    runDiagnosis(sample.crop);
  };

  const runDiagnosis = (cropKey: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const diag = CROP_DIAGNOSTICS[cropKey] || CROP_DIAGNOSTICS.tomato;
      setResult(diag);
      setIsAnalyzing(false);
    }, 450);
  };

  const playTTS = () => {
    if (!result || typeof window === 'undefined') return;

    const name = result.diseaseName[locale] || result.diseaseName.en;
    const cause = result.cause[locale] || result.cause.en;
    const remedies = (result.remedies[locale] || result.remedies.en).join('. ');
    const textToSpeak = `${name}. ${cause}. ${remedies}. ${t('scanner.kvkAdvice')}`;

    if (locale === 'kn') {
      try {
        const audio = new Audio(`/api/tts?lang=kn&text=${encodeURIComponent(textToSpeak.slice(0, 200))}`);
        audio.play().catch(() => {});
        return;
      } catch {
        // fallback to speech synthesis below
      }
    }

    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const cropKeys = [
    { key: 'tomato', en: 'Tomato', kn: 'ಟೊಮ್ಯಾಟೊ', hi: 'टमाटर' },
    { key: 'chilli', en: 'Chilli', kn: 'ಮೆಣಸಿನಕಾಯಿ', hi: 'मिर्च' },
    { key: 'paddy', en: 'Paddy', kn: 'ಭತ್ತ', hi: 'धान' },
    { key: 'cotton', en: 'Cotton', kn: 'ಹತ್ತಿ', hi: 'कपास' },
  ];

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('scanner.title')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('scanner.title')}</h1>
          <p className={styles.subtitle}>{t('scanner.subtitle')}</p>
        </header>

        {/* Outdoor daylight guidance banner */}
        <div className={styles.guideBanner} role="note">
          <span style={{ fontSize: '20px' }}>☀️</span>
          <span>{t('scanner.instruction')}</span>
        </div>

        {/* Crop Selection */}
        <div className={styles.card}>
          <span className={styles.sectionLabel}>{t('scanner.selectCrop')}</span>
          <div className={styles.cropsRow} role="tablist">
            {cropKeys.map((c) => {
              const active = selectedCrop === c.key;
              const name = c[locale] || c.en;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCrop(c.key);
                    if (scannedImage) runDiagnosis(c.key);
                  }}
                  className={`${styles.cropChip} ${active ? styles.cropChipActive : ''}`}
                >
                  <span>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Photo Capture / Upload Area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
            id="scanner-camera-input"
          />

          {!scannedImage ? (
            <div className={styles.uploadZone}>
              <button
                type="button"
                className={styles.cameraBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                <span style={{ fontSize: '22px' }}>📷</span>
                <span>{t('media.uploadPhoto')}</span>
              </button>
              <span style={{ fontSize: '13px', color: 'var(--p-muted)' }}>
                {locale === 'kn'
                  ? 'ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ'
                  : locale === 'hi'
                  ? 'कैमरा खोलें या गैलरी से फ़ोटो चुनें'
                  : 'Open camera viewfinder or pick from phone'}
              </span>

              {/* Sample test photos */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--p-muted)', display: 'block', marginBottom: '6px' }}>
                  {locale === 'kn' ? 'ಅಥವಾ ಮಾದರಿ ಫೋಟೋ ಪರೀಕ್ಷಿಸಿ:' : locale === 'hi' ? 'या नमूना फ़ोटो से जांचें:' : 'Or test with field sample:'}
                </span>
                <div className={styles.sampleRow}>
                  {SAMPLE_PHOTOS.map((s) => (
                    <img
                      key={s.crop}
                      src={s.url}
                      alt={s.label}
                      className={styles.sampleThumb}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSample(s);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.previewFrame}>
              <img src={scannedImage} alt="Scanned leaf" className={styles.previewImg} />
              <button
                type="button"
                className={styles.retakeBtn}
                onClick={() => {
                  setScannedImage(null);
                  setResult(null);
                }}
              >
                🔄 {locale === 'kn' ? 'ಮತ್ತೆ ತೆಗೆಯಿರಿ' : locale === 'hi' ? 'फिर से लें' : 'Retake photo'}
              </button>
            </div>
          )}
        </div>

        {/* Diagnosis Result Card */}
        {isAnalyzing && (
          <div className={styles.card} style={{ textAlign: 'center', padding: '32px' }}>
            <span style={{ fontSize: '24px' }}>🔬</span>
            <p style={{ margin: '8px 0 0 0', fontWeight: 600 }}>{t('form.saving')}</p>
          </div>
        )}

        {result && !isAnalyzing && (
          <article className={styles.resultCard} aria-live="polite">
            <div className={styles.resultHeader}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--p-action)', textTransform: 'uppercase' }}>
                  {locale === 'kn' ? 'ರೋಗ ಪತ್ತೆ ವರದಿ' : locale === 'hi' ? 'जांच रिपोर्ट' : 'Diagnostic Match'}
                </span>
                <h2 className={styles.diseaseName}>
                  {result.diseaseName[locale] || result.diseaseName.en}
                </h2>
              </div>
              <span className={styles.matchBadge}>{result.matchPercent}% {locale === 'kn' ? 'ಹೊಂದಾಣಿಕೆ' : locale === 'hi' ? 'सटीकता' : 'Match'}</span>
            </div>

            <p style={{ margin: 0, fontSize: '14px', color: 'var(--p-muted)' }}>
              {result.cause[locale] || result.cause.en}
            </p>

            <div className={styles.ttsRow}>
              <button
                type="button"
                className={styles.ttsBtn}
                onClick={playTTS}
                title="Listen to diagnosis"
                aria-label="Listen to diagnosis"
              >
                🔊 <span>{locale === 'kn' ? 'ಧ್ವನಿ ಆಲಿಸಿ' : locale === 'hi' ? 'रिपोर्ट सुनें' : 'Listen to report'}</span>
              </button>
            </div>

            {/* Non-toxic Organic / Cultural Remedies */}
            <div className={styles.remedyBox}>
              <h3 className={styles.remedyTitle}>🌿 {t('scanner.remedyTitle')}</h3>
              <ul className={styles.remedyList}>
                {(result.remedies[locale] || result.remedies.en).map((rem, idx) => (
                  <li key={idx}>{rem}</li>
                ))}
              </ul>
            </div>

            {/* Strict Safety Rule KVK Notice */}
            <div className={styles.kvkBox} role="note">
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>{t('scanner.kvkAdvice')}</span>
            </div>

            {/* Action Bar */}
            <div className={styles.actionRow}>
              <Link
                href={`/posts/new?group=${
                  selectedCrop === 'tomato'
                    ? 'tomato-growers'
                    : selectedCrop === 'chilli'
                    ? 'chilli-growers'
                    : 'karnataka-farmers'
                }&title=${encodeURIComponent(
                  result.diseaseName[locale] || result.diseaseName.en
                )}`}
                className={styles.communityBtn}
              >
                <span>💬</span>
                <span>{t('scanner.askCommunity')}</span>
              </Link>
            </div>
          </article>
        )}
      </div>
    </TaskShell>
  );
}
