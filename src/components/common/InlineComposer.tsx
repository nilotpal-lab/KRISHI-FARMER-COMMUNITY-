'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { UserProfile, Community, Locale } from '@/types';
import { AudioRecorder } from './AudioRecorder';
import { compressPostImage } from '@/lib/utils/mediaUtils';
import { Camera, Trash2 } from 'lucide-react';
import styles from './InlineComposer.module.css';

interface InlineComposerProps {
  defaultCommunitySlug?: string;
  onPostCreated?: () => void;
}

export const InlineComposer: React.FC<InlineComposerProps> = ({
  defaultCommunitySlug,
  onPostCreated,
}) => {
  const { t, locale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(defaultCommunitySlug || 'karnataka-farmers');
  const [selectedLang, setSelectedLang] = useState<Locale>(locale);
  const [selectedTag, setSelectedTag] = useState<string>('cotton');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    setUser(krishiService.getCurrentUser(locale));
    const commsResult = krishiService.getCommunities('all', 1, 20, locale);
    setCommunities(commsResult.items);

    const unsub = krishiService.subscribe(() => {
      setUser(krishiService.getCurrentUser(locale));
    });
    return unsub;
  }, [locale]);

  const cropTags = [
    { key: 'cotton', label: locale === 'kn' ? 'ಹತ್ತಿ' : locale === 'hi' ? 'कपास' : 'Cotton' },
    { key: 'tomato', label: locale === 'kn' ? 'ಟೊಮ್ಯಾಟೊ' : locale === 'hi' ? 'टमाटर' : 'Tomato' },
    { key: 'paddy', label: locale === 'kn' ? 'ಭತ್ತ' : locale === 'hi' ? 'धान/चावल' : 'Paddy' },
    { key: 'chilli', label: locale === 'kn' ? 'ಮೆಣಸಿನಕಾಯಿ' : locale === 'hi' ? 'मिर्च' : 'Chilli' },
    { key: 'sugarcane', label: locale === 'kn' ? 'ಕಬ್ಬು' : locale === 'hi' ? 'गन्ना' : 'Sugarcane' },
    { key: 'onion', label: locale === 'kn' ? 'ಈರುಳ್ಳಿ' : locale === 'hi' ? 'प्याज़' : 'Onion' },
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressPostImage(file, 900, 0.7);
      setUploadedPhoto(compressed);
      setError(null);
    } catch {
      setError(t('common.errorDesc'));
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let trimmedTitle = title.trim();
    let trimmedBody = body.trim();

    if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
      if (audioUrl) {
        trimmedTitle = `${t('post.defaultVoiceTitle')} (${new Date().toLocaleDateString()})`;
      } else {
        setError(t('form.titleHelp'));
        return;
      }
    }

    if (!trimmedBody && audioUrl) {
      trimmedBody = t('post.defaultVoiceBody');
    } else if (!audioUrl && (trimmedBody.length < 10 || trimmedBody.length > 1500)) {
      setError(t('form.bodyHelp'));
      return;
    }

    setIsSubmitting(true);

    const result = krishiService.publishPost({
      communitySlug: selectedCommunity,
      title: trimmedTitle,
      body: trimmedBody,
      lang: selectedLang,
      imageUrl: uploadedPhoto || undefined,
      audioUrl: audioUrl || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setTitle('');
      setBody('');
      setUploadedPhoto(null);
      setAudioUrl(null);
      setIsExpanded(false);
      setToastMessage(locale === 'kn' ? 'ಪೋಸ್ಟ್ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : locale === 'hi' ? 'पोस्ट सफलतापूर्वक प्रकाशित हुआ!' : 'Post published to feed!');
      setTimeout(() => setToastMessage(null), 3500);
      onPostCreated?.();
    } else {
      setError(result.error ? t(result.error) : 'Failed to publish post.');
    }
  };

  const isMember = user?.role === 'member';

  return (
    <div className={styles.composerCard}>
      {toastMessage && (
        <div style={{
          backgroundColor: 'var(--p-action, #1f5134)',
          color: '#ffffff',
          padding: '8px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 160ms ease-out',
        }}>
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {!isMember ? (
        <div className={styles.guestBanner}>
          <span className={styles.guestText}>
            {locale === 'kn'
              ? 'ಪ್ರಶ್ನೆ ಕೇಳಲು ಅಥವಾ ಕೃಷಿ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಲು ಡೆಮೊ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ:'
              : locale === 'hi'
              ? 'प्रश्न पूछने या फसल अनुभव साझा करने के लिए डेमो खाते में साइन इन करें:'
              : 'Join discussions and share field observations with fellow farmers:'}
          </span>
          <div className={styles.guestDemos}>
            <button
              type="button"
              className={styles.triggerAction}
              onClick={() => krishiService.switchAccount('gowri_demo')}
            >
              {locale === 'kn' ? 'ಗೌರಿ ಆಗಿ ಲಾಗಿನ್' : locale === 'hi' ? 'गौरी के रूप में लॉगिन' : 'Post as Gowri'}
            </button>
            <button
              type="button"
              className={styles.triggerAction}
              style={{ backgroundColor: 'var(--p-surface, #e9eae0)', color: 'var(--p-ink, #17281d)', border: '1px solid var(--color-line)' }}
              onClick={() => krishiService.switchAccount('ravi_demo')}
            >
              {locale === 'kn' ? 'ರವಿ ಆಗಿ ಲಾಗಿನ್' : locale === 'hi' ? 'रवि के रूप में लॉगिन' : 'Post as Ravi'}
            </button>
          </div>
        </div>
      ) : !isExpanded ? (
        <div className={styles.collapsedRow} onClick={() => setIsExpanded(true)}>
          <img
            src={user?.avatarUrl || '/assets/farmers/gowri_avatar.jpg'}
            alt=""
            className={styles.userAvatar}
          />
          <button type="button" className={styles.promptTrigger}>
            {locale === 'kn'
              ? `${user.displayName}, ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಇಂದು ಏನು ನಡೆಯುತ್ತಿದೆ? ಪ್ರಶ್ನೆ ಕೇಳಿ...`
              : locale === 'hi'
              ? `${user.displayName}, आज आपके खेत में क्या चल रहा है? प्रश्न पूछें...`
              : `What's happening on your farm, ${user.displayName}? Ask a question or share...`}
          </button>
          <button type="button" className={styles.triggerAction}>
            {locale === 'kn' ? 'ಪೋಸ್ಟ್ ಮಾಡಿ' : locale === 'hi' ? 'पोस्ट करें' : 'Post'}
          </button>
        </div>
      ) : (
        <form className={styles.expandedForm} onSubmit={handlePublish}>
          <div className={styles.authorMetaRow}>
            <div className={styles.authorLeft}>
              <img
                src={user?.avatarUrl || '/assets/farmers/gowri_avatar.jpg'}
                alt=""
                className={styles.userAvatar}
              />
              <span className={styles.authorName}>{user?.displayName}</span>
            </div>
            <div className={styles.controlsRight}>
              <select
                className={styles.selectControl}
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                aria-label="Select community"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.labels?.[locale]?.name || c.name}
                  </option>
                ))}
              </select>

              <select
                className={styles.selectControl}
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as Locale)}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            className={styles.titleInput}
            placeholder={
              locale === 'kn'
                ? 'ಶೀರ್ಷಿಕೆ: (ಉದಾ: ಮಳೆಯ ನಂತರ ಟೊಮ್ಯಾಟೊ ಎಲೆ ಹಳದಿಯಾಗುತ್ತಿದೆ)'
                : locale === 'hi'
                ? 'शीर्षक: (उदा: बारिश के बाद टमाटर के पत्ते पीले हो रहे हैं)'
                : 'Title: (e.g. Tomato leaves yellowing after rain)'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />

          <textarea
            className={styles.bodyTextarea}
            placeholder={
              locale === 'kn'
                ? 'ಬೆಳೆ ಲಕ್ಷಣಗಳು, ಮಣ್ಣಿನ ಸ್ಥಿತಿ, ಬಳಸಿದ ಗೊಬ್ಬರ ಅಥವಾ ಪ್ರಶ್ನೆಯನ್ನು ವಿವರವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ...'
                : locale === 'hi'
                ? 'फसल के लक्षण, मिट्टी की स्थिति, उपयोग की गई खाद या प्रश्न विस्तार से बताएं...'
                : 'Describe crop symptoms, soil moisture, acreage, or farming methods observed...'
            }
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1500}
          />

          {/* Media Attachments: Voice Note & Real Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
            <AudioRecorder
              maxDurationSeconds={60}
              audioUrl={audioUrl}
              onAudioRecorded={setAudioUrl}
            />

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              {!uploadedPhoto ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--color-line)',
                    background: 'var(--color-surface-subtle)',
                    color: 'var(--color-ink)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                >
                  <Camera size={16} />
                  <span>{t('media.uploadPhoto')}</span>
                </button>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-line)' }}>
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded observation"
                    style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedPhoto(null)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      minHeight: '44px',
                      minWidth: '44px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>{t('media.removePhoto')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.cropTagRow}>
            <span className={styles.tagLabel}>
              {locale === 'kn' ? 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ:' : locale === 'hi' ? 'फसल चुनें:' : 'Select crop:'}
            </span>
            {cropTags.map((tag) => (
              <button
                key={tag.key}
                type="button"
                className={`${styles.cropTagBtn} ${selectedTag === tag.key ? styles.cropTagActive : ''}`}
                onClick={() => setSelectedTag(tag.key)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.bottomBar}>
            <span className={styles.charCount}>
              {body.length} / 1500 {locale === 'kn' ? 'ಅಕ್ಷರಗಳು' : locale === 'hi' ? 'अक्षर' : 'chars'}
            </span>
            <div className={styles.actionBtns}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setIsExpanded(false);
                  setError(null);
                }}
              >
                {locale === 'kn' ? 'ರದ್ದುಮಾಡಿ' : locale === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className={styles.publishBtn}
                disabled={isSubmitting || (!audioUrl && (title.trim().length < 5 || body.trim().length < 10))}
              >
                {isSubmitting
                  ? (locale === 'kn' ? 'ಪ್ರಕಟಿಸಲಾಗುತ್ತಿದೆ...' : locale === 'hi' ? 'प्रकाशित हो रहा है...' : 'Publishing...')
                  : (locale === 'kn' ? 'ಪೋಸ್ಟ್ ಮಾಡಿ' : locale === 'hi' ? 'पोस्ट करें' : 'Post')}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
