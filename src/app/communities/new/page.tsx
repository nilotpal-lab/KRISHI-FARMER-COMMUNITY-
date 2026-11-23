'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { Locale, CommunityKind, IndianState } from '@/types';
import { MapPinIcon, TagIcon } from '@/components/ui/Icons';
import styles from './NewCommunity.module.css';

export default function NewCommunityPage() {
  const { t, locale } = useI18n();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState<CommunityKind>('location');
  const [stateKey, setStateKey] = useState('');
  const [lang, setLang] = useState<Locale>(locale);
  const [states, setStates] = useState<IndianState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  useEffect(() => {
    const user = krishiService.getCurrentUser();
    if (!user || user.role !== 'member') {
      router.push('/login?next=/communities/new');
      return;
    }
    setStates(krishiService.getStates());
  }, [router]);

  const isDirty = name.trim().length > 0 || description.trim().length > 0;

  const handleCancel = () => {
    if (isDirty) {
      setIsDiscardOpen(true);
    } else {
      router.push('/communities');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameTrimmed = name.trim();
    if (nameTrimmed.length < 3 || nameTrimmed.length > 60) {
      setError(t('form.nameHelp'));
      return;
    }

    const descTrimmed = description.trim();
    if (descTrimmed.length < 10 || descTrimmed.length > 240) {
      setError(t('form.descHelp'));
      return;
    }

    if (kind === 'location' && !stateKey) {
      setError(t('form.selectState'));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = krishiService.createCommunity({
        name: nameTrimmed,
        description: descTrimmed,
        kind,
        stateKey: kind === 'location' ? stateKey : null,
        lang,
      });

      setIsLoading(false);

      if (res.success && res.community) {
        router.push(`/communities/${res.community.slug}`);
      } else {
        setError(res.error ? t(res.error) : t('common.loadError'));
      }
    }, 250);
  };

  return (
    <TaskShell backHref="/communities" backLabel={t('nav.groups')}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>{t('group.create')}</h1>
            <p className={styles.subtitle}>
              {t('groups.newSubtitle')}
            </p>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Community Type */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t('groups.type')}</label>
              <div className={styles.typeSelector}>
                <button
                  type="button"
                  className={`${styles.typeBtn} ${kind === 'location' ? styles.selectedType : ''}`}
                  onClick={() => setKind('location')}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <MapPinIcon size={16} />
                  <span>{t('group.location')}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.typeBtn} ${kind === 'topic' ? styles.selectedType : ''}`}
                  onClick={() => {
                    setKind('topic');
                    setStateKey('');
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <TagIcon size={16} />
                  <span>{t('group.topic')}</span>
                </button>
              </div>
            </div>

            {/* State Picker (Only if State group) */}
            {kind === 'location' && (
              <Select
                label={t('groups.state')}
                value={stateKey}
                onChange={(e) => setStateKey(e.target.value)}
                required
              >
                <option value="">-- {t('form.selectState')} --</option>
                {states.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.labels[locale] || s.labels.en} ({s.kind === 'state' ? t('common.state') : t('common.ut')})
                  </option>
                ))}
              </Select>
            )}

            {/* Name */}
            <Input
              label={t('groups.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText={t('form.nameHelp')}
              required
              placeholder={t('groups.namePlaceholder')}
            />

            {/* Description */}
            <Textarea
              label={t('groups.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText={t('form.descHelp')}
              required
              placeholder={t('groups.descPlaceholder')}
            />

            {/* Writing Language */}
            <Select
              label={t('post.language')}
              value={lang}
              onChange={(e) => setLang(e.target.value as Locale)}
            >
              <option value="kn">{t('lang.kannada')}</option>
              <option value="en">{t('lang.english')}</option>
              <option value="hi">{t('lang.hindi')}</option>
            </Select>

            {/* Actions */}
            <div className={styles.actionsRow}>
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="solid" isLoading={isLoading}>
                {t('group.create')}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      <Dialog
        isOpen={isDiscardOpen}
        onClose={() => setIsDiscardOpen(false)}
        title={t('confirm.discard')}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDiscardOpen(false)}>
              {t('confirm.keep')}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsDiscardOpen(false);
                router.push('/communities');
              }}
            >
              {t('confirm.discard')}
            </Button>
          </>
        }
      >
        <p>{t('confirm.discardNotice')}</p>
      </Dialog>
    </TaskShell>
  );
}
