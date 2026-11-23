'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/context';
import { krishiService, hashPassword } from '@/lib/services/krishiService';
import { Locale, UserProfile } from '@/types';
import { Camera, Check, ArrowLeft, ArrowRight, User } from 'lucide-react';
import styles from './Signup.module.css';

// Pre-defined crops for Step 9
const CROP_OPTIONS = [
  { key: 'tomato', en: 'Tomato', kn: 'ಟೊಮೆಟೊ', hi: 'टमाटर', icon: '🍅' },
  { key: 'paddy', en: 'Paddy / Rice', kn: 'ಭತ್ತ', hi: 'धान', icon: '🌾' },
  { key: 'cotton', en: 'Cotton', kn: 'ಹತ್ತಿ', hi: 'कपास', icon: '🌱' },
  { key: 'chilli', en: 'Chilli', kn: 'ಮೆಣಸಿನಕಾಯಿ', hi: 'मिर्च', icon: '🌶️' },
  { key: 'sugarcane', en: 'Sugarcane', kn: 'ಕಬ್ಬು', hi: 'गन्ना', icon: '🎋' },
  { key: 'onion', en: 'Onion', kn: 'ಈರುಳ್ಳಿ', hi: 'प्याज', icon: '🧅' },
  { key: 'millet', en: 'Ragi / Millet', kn: 'ರಾಗಿ', hi: 'बाजरा', icon: '🌾' },
  { key: 'groundnut', en: 'Groundnut', kn: 'ಕಡಲೆಕಾಯಿ', hi: 'मूंगफली', icon: '🥜' },
];

const LANGUAGE_OPTIONS: { code: Locale; en: string; kn: string; hi: string }[] = [
  { code: 'en', en: 'English', kn: 'ಇಂಗ್ಲಿಷ್', hi: 'अंग्रेज़ी' },
  { code: 'kn', en: 'ಕನ್ನಡ (Kannada)', kn: 'ಕನ್ನಡ', hi: 'कन्नड़' },
  { code: 'hi', en: 'हिन्दी (Hindi)', kn: 'ಹಿಂದಿ', hi: 'हिन्दी' },
];

/**
 * Compresses an uploaded image to max 400px width/height and returns a data URL.
 * Strictly adheres to Rule E.3 (max 400px, JPEG 0.7) using native Canvas API without external packages.
 */
function compressPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 400;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SignupWizardPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wizard State
  const [step, setStep] = useState(1);
  const totalSteps = 9;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [district, setDistrict] = useState('');
  const [readLangs, setReadLangs] = useState<Locale[]>([locale]);
  const [writeLangs, setWriteLangs] = useState<Locale[]>([locale]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [otherCrop, setOtherCrop] = useState('');

  const states = krishiService.getStates();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressPhoto(file);
      setPhotoDataUrl(compressed);
      setError(null);
    } catch {
      setError(t('common.errorDesc'));
    }
  };

  const toggleLanguage = (
    lang: Locale,
    current: Locale[],
    setter: React.Dispatch<React.SetStateAction<Locale[]>>
  ) => {
    if (current.includes(lang)) {
      setter(current.filter((l) => l !== lang));
    } else {
      setter([...current, lang]);
    }
  };

  const toggleCrop = (cropKey: string) => {
    if (selectedCrops.includes(cropKey)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== cropKey));
    } else {
      setSelectedCrops([...selectedCrops, cropKey]);
    }
  };

  const validateCurrentStep = (): boolean => {
    setError(null);
    if (step === 1) {
      if (!displayName.trim()) {
        setError(t('form.required'));
        return false;
      }
    } else if (step === 2) {
      if (!username.trim() || username.trim().length < 3) {
        setError(t('form.required'));
        return false;
      }
      if (!password || password.length < 4) {
        setError(t('form.required'));
        return false;
      }
      // Check if username already exists
      const clean = username.trim().toLowerCase();
      const existing = krishiService.getAllUsers();
      if (existing.some((u) => u.username.toLowerCase() === clean)) {
        setError(t('auth.usernameTaken'));
        return false;
      }
    } else if (step === 6) {
      if (!selectedState) {
        setError(t('form.required'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/login');
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      // 1. Hash password via SubtleCrypto
      const passwordHash = await hashPassword(password);

      // 2. Combine selected crops with other crop if present
      const finalCrops = [...selectedCrops];
      if (otherCrop.trim() && !finalCrops.includes(otherCrop.trim())) {
        finalCrops.push(otherCrop.trim());
      }

      // 3. Construct extended UserProfile
      const newProfile: UserProfile = {
        username: username.trim(),
        displayName: displayName.trim(),
        passwordHash,
        role: 'member',
        enabled: true,
        age: age ? parseInt(age, 10) : undefined,
        experienceYears: experience ? parseInt(experience, 10) : undefined,
        state: selectedState,
        district: district.trim() || undefined,
        readLangs,
        writeLangs,
        crops: finalCrops,
        photoDataUrl: photoDataUrl || undefined,
        avatarUrl: photoDataUrl || undefined,
      };

      // 4. Save through MockKrishiService
      const res = await krishiService.registerUser(newProfile);
      setIsSubmitting(false);

      if (res.success) {
        // Automatically logged in -> redirect to home
        router.push('/');
      } else {
        setError(t(res.error || 'common.errorDesc'));
      }
    } catch {
      setIsSubmitting(false);
      setError(t('common.errorDesc'));
    }
  };

  // Is current step skippable?
  // Steps 1, 2, and 6 are required. Steps 3, 4, 5, 7, 8, 9 are skippable.
  const isSkippable = [3, 4, 5, 7, 8, 9].includes(step);

  return (
    <TaskShell backHref="/login" backLabel={t('auth.signIn')} title={t('signup.title')}>
      <div className={styles.container}>
        <div className={styles.wizardCard}>
          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressMeta}>
              <span className={styles.stepBadge}>
                {t('signup.stepProgress', { step, total: totalSteps })}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {/* STEP 1: Name */}
          {step === 1 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step1Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step1Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <Input
                  label={`${t('signup.nameLabel')} *`}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('signup.namePlaceholder')}
                  autoFocus
                  required
                />
              </div>
            </>
          )}

          {/* STEP 2: Username & Password */}
          {step === 2 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step2Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step2Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <Input
                  label={`${t('signup.usernameLabel')} *`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('signup.usernamePlaceholder')}
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                />
                <Input
                  label={`${t('signup.passwordLabel')} *`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </>
          )}

          {/* STEP 3: Age */}
          {step === 3 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step3Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step3Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <Input
                  label={t('signup.ageLabel')}
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('signup.agePlaceholder')}
                  autoFocus
                />
              </div>
            </>
          )}

          {/* STEP 4: Experience */}
          {step === 4 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step4Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step4Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <Input
                  label={t('signup.expLabel')}
                  type="number"
                  min="0"
                  max="80"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder={t('signup.expPlaceholder')}
                  autoFocus
                />
              </div>
            </>
          )}

          {/* STEP 5: Photo */}
          {step === 5 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step5Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step5Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.photoWrapper}>
                  <div className={styles.photoPreviewFrame}>
                    {photoDataUrl ? (
                      <img
                        src={photoDataUrl}
                        alt="Profile preview"
                        className={styles.photoPreviewImg}
                      />
                    ) : (
                      <User size={56} color="var(--color-muted-light)" />
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className={styles.hiddenFileInput}
                    id="profile-photo-input"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadBtn}
                  >
                    <Camera size={18} />
                    <span>{t('signup.photoUploadBtn')}</span>
                  </button>

                  {photoDataUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl(null)}
                      className={styles.removePhotoBtn}
                    >
                      {t('signup.photoRemoveBtn')}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* STEP 6: State & District */}
          {step === 6 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step6Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step6Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.selectWrapper}>
                  <label htmlFor="state-select" className={styles.fieldLabel}>
                    {t('signup.stateLabel')} *
                  </label>
                  <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={styles.selectInput}
                    required
                  >
                    <option value="">{t('form.selectState')}</option>
                    {states.map((st) => (
                      <option key={st.key} value={st.labels[locale] || st.labels.en}>
                        {st.labels[locale] || st.labels.en}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label={t('signup.districtLabel')}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={t('signup.districtPlaceholder')}
                />
              </div>
            </>
          )}

          {/* STEP 7: Languages Read */}
          {step === 7 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step7Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step7Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.chipsGrid}>
                  <button
                    type="button"
                    onClick={() => setReadLangs([])}
                    className={`${styles.chipItem} ${readLangs.length === 0 ? styles.chipItemActive : ''}`}
                  >
                    {readLangs.length === 0 && <Check size={16} />}
                    <span>🎙️ {t('signup.voiceOnlyOption')}</span>
                  </button>
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const active = readLangs.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLanguage(lang.code, readLangs, setReadLangs)}
                        className={`${styles.chipItem} ${active ? styles.chipItemActive : ''}`}
                      >
                        {active && <Check size={16} />}
                        <span>{lang[locale] || lang.en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* STEP 8: Languages Write */}
          {step === 8 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step8Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step8Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.chipsGrid}>
                  <button
                    type="button"
                    onClick={() => setWriteLangs([])}
                    className={`${styles.chipItem} ${writeLangs.length === 0 ? styles.chipItemActive : ''}`}
                  >
                    {writeLangs.length === 0 && <Check size={16} />}
                    <span>🎙️ {t('signup.voiceOnlyOption')}</span>
                  </button>
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const active = writeLangs.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLanguage(lang.code, writeLangs, setWriteLangs)}
                        className={`${styles.chipItem} ${active ? styles.chipItemActive : ''}`}
                      >
                        {active && <Check size={16} />}
                        <span>{lang[locale] || lang.en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* STEP 9: Crops */}
          {step === 9 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>{t('signup.step9Title')}</h1>
                <p className={styles.stepHelp}>{t('signup.step9Help')}</p>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.chipsGrid}>
                  {CROP_OPTIONS.map((crop) => {
                    const active = selectedCrops.includes(crop.key);
                    return (
                      <button
                        key={crop.key}
                        type="button"
                        onClick={() => toggleCrop(crop.key)}
                        className={`${styles.chipItem} ${active ? styles.chipItemActive : ''}`}
                      >
                        <span>{crop.icon}</span>
                        <span>{crop[locale] || crop.en}</span>
                        {active && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '12px' }}>
                  <Input
                    label={t('signup.otherCropLabel')}
                    value={otherCrop}
                    onChange={(e) => setOtherCrop(e.target.value)}
                    placeholder={t('signup.otherCropPlaceholder')}
                  />
                </div>
              </div>
            </>
          )}

          {/* Navigation Controls */}
          <div className={styles.navRow}>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              <span>{t('signup.back')}</span>
            </Button>

            <div className={styles.navRight}>
              {isSkippable && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className={styles.skipBtn}
                  disabled={isSubmitting}
                >
                  {t('signup.skip')}
                </button>
              )}

              <Button
                type="button"
                variant="solid"
                onClick={handleNext}
                isLoading={isSubmitting}
              >
                <span>
                  {step === totalSteps ? t('signup.finish') : t('signup.next')}
                </span>
                {step < totalSteps && <ArrowRight size={16} style={{ marginLeft: '6px' }} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TaskShell>
  );
}
