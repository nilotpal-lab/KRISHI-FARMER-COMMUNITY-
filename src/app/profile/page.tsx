'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { LanguageModal } from '@/components/common/LanguageModal';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { UserProfile } from '@/types';
import { ShieldIcon, GlobeIcon } from '@/components/ui/Icons';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const current = krishiService.getCurrentUser(locale);
    if (!current) {
      router.push('/login');
      return;
    }
    setUser(current);
    const unsub = krishiService.subscribe(() => {
      const u = krishiService.getCurrentUser(locale);
      if (!u) router.push('/login');
      else setUser(u);
    });
    return unsub;
  }, [router, locale]);

  const handleSignOut = () => {
    krishiService.logout();
    router.push('/');
  };

  if (!user) {
    return (
      <TaskShell backHref="/" backLabel={t('nav.home')}>
        <div style={{ textAlign: 'center', padding: '32px' }}>{t('common.loading')}</div>
      </TaskShell>
    );
  }

  const getCropDisplayName = (cropKey: string): string => {
    const k = cropKey.toLowerCase().trim();
    if (k === 'tomato') return locale === 'kn' ? 'ಟೊಮೆಟೊ' : locale === 'hi' ? 'टमाटर' : 'Tomato';
    if (k === 'paddy' || k === 'rice') return locale === 'kn' ? 'ಭತ್ತ' : locale === 'hi' ? 'धान' : 'Paddy';
    if (k === 'cotton') return locale === 'kn' ? 'ಹತ್ತಿ' : locale === 'hi' ? 'कपास' : 'Cotton';
    if (k === 'chilli') return locale === 'kn' ? 'ಮೆಣಸಿನಕಾಯಿ' : locale === 'hi' ? 'मिर्च' : 'Chilli';
    if (k === 'sugarcane') return locale === 'kn' ? 'ಕಬ್ಬು' : locale === 'hi' ? 'गन्ना' : 'Sugarcane';
    if (k === 'onion') return locale === 'kn' ? 'ಈರುಳ್ಳಿ' : locale === 'hi' ? 'प्याज' : 'Onion';
    if (k === 'ragi' || k === 'millet') return locale === 'kn' ? 'ರಾಗಿ' : locale === 'hi' ? 'बाजरा' : 'Ragi';
    if (k === 'groundnut') return locale === 'kn' ? 'ಕಡಲೆಕಾಯಿ' : locale === 'hi' ? 'मूंगफली' : 'Groundnut';
    return cropKey;
  };

  const getLangDisplayName = (code: string): string => {
    const c = code.toLowerCase();
    if (c === 'voice_only' || c === 'none') return t('signup.voiceOnlyOption');
    if (c === 'kn') return locale === 'kn' ? 'ಕನ್ನಡ' : locale === 'hi' ? 'कन्नड़' : 'Kannada';
    if (c === 'hi') return locale === 'kn' ? 'ಹಿಂದಿ' : locale === 'hi' ? 'हिन्दी' : 'Hindi';
    if (c === 'en') return locale === 'kn' ? 'ಇಂಗ್ಲಿಷ್' : locale === 'hi' ? 'अंग्रेज़ी' : 'English';
    return code.toUpperCase();
  };

  const langDisplay = locale === 'kn' ? 'ಕನ್ನಡ' : locale === 'hi' ? 'हिन्दी' : 'English';
  const isAdmin = user.role === 'admin';

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('nav.account')}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            {user.photoDataUrl || user.avatarUrl ? (
              <img
                src={user.photoDataUrl || user.avatarUrl}
                alt={user.displayName}
                className={styles.avatarLarge}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <InitialsAvatar name={user.displayName} className={styles.avatarLarge} />
            )}
            <div className={styles.infoArea}>
              <h1 className={styles.displayName}>{user.displayName}</h1>
              <span className={styles.username}>@{user.username}</span>
              <div style={{ marginTop: '4px' }}>
                <Badge variant={isAdmin ? 'sun' : 'mint'}>
                  {isAdmin ? t('profile.adminBadge') : t('profile.memberBadge')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Extended Farmer Profile Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('profile.farmingDetails')}</h2>
            <div className={styles.rowItem}>
              <span className={styles.rowLabel}>{t('profile.location')}</span>
              <span className={styles.rowValue}>
                {user.state
                  ? `${user.district ? user.district + ', ' : ''}${user.state}`
                  : t('profile.notSpecified')}
              </span>
            </div>
            {user.age !== undefined && (
              <div className={styles.rowItem}>
                <span className={styles.rowLabel}>{t('profile.age')}</span>
                <span className={styles.rowValue}>
                  {user.age} {t('profile.yearsSuffix')}
                </span>
              </div>
            )}
            {user.experienceYears !== undefined && (
              <div className={styles.rowItem}>
                <span className={styles.rowLabel}>{t('profile.experience')}</span>
                <span className={styles.rowValue}>
                  {user.experienceYears} {t('profile.yearsSuffix')}
                </span>
              </div>
            )}
            {user.crops && user.crops.length > 0 && (
              <div className={styles.rowItem}>
                <span className={styles.rowLabel}>{t('profile.crops')}</span>
                <span className={styles.rowValue}>
                  {user.crops.map((c) => getCropDisplayName(c)).join(', ')}
                </span>
              </div>
            )}
            <div className={styles.rowItem}>
              <span className={styles.rowLabel}>{t('profile.readLanguages')}</span>
              <span className={styles.rowValue}>
                {user.readLangs && user.readLangs.length > 0
                  ? user.readLangs.map((l) => getLangDisplayName(l)).join(', ')
                  : t('signup.voiceOnlyOption')}
              </span>
            </div>
            <div className={styles.rowItem}>
              <span className={styles.rowLabel}>{t('profile.writeLanguages')}</span>
              <span className={styles.rowValue}>
                {user.writeLangs && user.writeLangs.length > 0
                  ? user.writeLangs.map((l) => getLangDisplayName(l)).join(', ')
                  : t('signup.voiceOnlyOption')}
              </span>
            </div>
          </div>

          {/* Admin Moderation Card if admin */}
          {isAdmin && (
            <div className={styles.adminBanner}>
              <span className={styles.adminTitle} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldIcon size={16} />
                <span>{t('profile.adminBannerTitle')}</span>
              </span>
              <p style={{ fontSize: '14px', color: 'var(--color-ink)' }}>
                {t('profile.adminBannerDesc')}
              </p>
              <div style={{ marginTop: '8px' }}>
                <Link href="/admin">
                  <Button variant="solid" size="small">
                    {t('nav.reports')} →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Account Details Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('profile.preferences')}</h2>
            <div className={styles.rowItem}>
              <span className={styles.rowLabel}>{t('nav.language')}</span>
              <Button
                variant="outline"
                size="small"
                onClick={() => setIsLangOpen(true)}
              >
                <GlobeIcon size={14} style={{ marginRight: '6px' }} />
                <span>{langDisplay}</span>
              </Button>
            </div>
            <div className={styles.rowItem}>
              <span className={styles.rowLabel}>{t('profile.status')}</span>
              <span className={styles.rowValue}>{t('profile.activeStatus')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsGroup}>
            <Button variant="outline" onClick={handleSignOut} fullWidth>
              {t('auth.signOut')}
            </Button>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link href="/about" style={{ fontSize: '14px' }}>
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </TaskShell>
  );
}
