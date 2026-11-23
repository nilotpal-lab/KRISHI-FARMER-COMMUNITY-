'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { Locale, Community } from '@/types';
import { AudioRecorder } from '@/components/common/AudioRecorder';
import { compressPostImage } from '@/lib/utils/mediaUtils';
import { Camera, Trash2 } from 'lucide-react';
import styles from './NewPost.module.css';

function ComposeForm() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGroup = searchParams.get('group') || '';
  const preselectedTitle = searchParams.get('title') || '';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>(() => {
    return krishiService.getCommunities('all', 1, 100).items;
  });
  const [selectedGroup, setSelectedGroup] = useState<string>(preselectedGroup);
  const [title, setTitle] = useState(preselectedTitle);
  const [body, setBody] = useState('');
  const [lang, setLang] = useState<Locale>(locale);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  useEffect(() => {
    const user = krishiService.getCurrentUser(locale);
    if (!user || user.role !== 'member') {
      router.push('/login?next=/posts/new');
      return;
    }

    const memberships = krishiService.getMemberships(user.username);
    const all = krishiService.getCommunities('all', 1, 100, locale).items;
    let joined = all.filter((c) => memberships.includes(c.slug));
    if (joined.length === 0 && all.length > 0) {
      // Auto-join default community so farmer is never blocked from posting
      krishiService.joinCommunity(all[0].slug);
      joined = [all[0]];
    }
    setJoinedCommunities(joined.length > 0 ? joined : all);

    if (preselectedGroup && memberships.includes(preselectedGroup)) {
      setSelectedGroup(preselectedGroup);
    } else if (joined.length > 0) {
      setSelectedGroup(joined[0].slug);
    } else if (all.length > 0) {
      setSelectedGroup(all[0].slug);
    }
  }, [router, preselectedGroup, locale]);

  const isDirty = title.trim().length > 0 || body.trim().length > 0 || !!uploadedPhoto || !!audioUrl;

  const handleCancel = () => {
    if (isDirty) {
      setIsDiscardOpen(true);
    } else {
      router.push(selectedGroup ? `/communities/${selectedGroup}` : '/');
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetGroup = selectedGroup || (joinedCommunities[0]?.slug);
    if (!targetGroup) {
      setError(t('form.selectGroup'));
      return;
    }

    let titleTrimmed = title.trim();
    if (titleTrimmed.length < 5 || titleTrimmed.length > 100) {
      if (audioUrl) {
        titleTrimmed = `${t('post.defaultVoiceTitle')} (${new Date().toLocaleDateString()})`;
      } else {
        setError(t('form.titleHelp'));
        return;
      }
    }

    let bodyTrimmed = body.trim();
    if (!bodyTrimmed && audioUrl) {
      bodyTrimmed = t('post.defaultVoiceBody');
    } else if (!audioUrl && (bodyTrimmed.length < 10 || bodyTrimmed.length > 1500)) {
      setError(t('form.bodyHelp'));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = krishiService.publishPost({
        communitySlug: targetGroup,
        title: titleTrimmed,
        body: bodyTrimmed,
        lang,
        imageUrl: uploadedPhoto || undefined,
        audioUrl: audioUrl || undefined,
      });

      setIsLoading(false);

      if (res.success && res.post) {
        router.push(`/posts/${res.post.id}`);
      } else {
        setError(res.error ? t(res.error) : t('common.loadError'));
      }
    }, 250);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{t('home.write')}</h1>
          <p className={styles.notice}>{t('common.publicNotice')}</p>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Joined Community Selector */}
          <Select
            label={t('post.community')}
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
          >
            {joinedCommunities.map((c) => {
              const name = c.labels?.[locale]?.name || c.name;
              return (
                <option key={c.slug} value={c.slug}>
                  {name}
                </option>
              );
            })}
          </Select>

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

          {/* Title */}
          <Input
            label={t('post.title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            helperText={t('form.titleHelp')}
            required
            placeholder={t('post.titlePlaceholder')}
          />

          {/* Body */}
          <Textarea
            label={t('post.body')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            helperText={t('form.bodyHelp')}
            required
            placeholder={t('post.bodyPlaceholder')}
          />

          {/* Voice Note Recorder (60s max) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)' }}>
              {t('media.recordVoice')} (60s max)
            </span>
            <AudioRecorder
              maxDurationSeconds={60}
              audioUrl={audioUrl}
              onAudioRecorded={setAudioUrl}
            />
          </div>

          {/* Real Photo Attachment (Camera / Gallery) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)' }}>
              {t('media.uploadPhoto')}
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
              id="post-photo-upload"
            />

            {!uploadedPhoto ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} style={{ marginRight: '8px' }} />
                <span>{t('media.uploadPhoto')}</span>
              </Button>
            ) : (
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-line)' }}>
                <img
                  src={uploadedPhoto}
                  alt="Observation preview"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => setUploadedPhoto(null)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
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
                  <Trash2 size={14} />
                  <span>{t('media.removePhoto')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actionsRow}>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="solid" isLoading={isLoading}>
              {t('post.publish')}
            </Button>
          </div>
        </form>
      </div>

      {/* Discard Changes Dialog */}
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
                router.push(selectedGroup ? `/communities/${selectedGroup}` : '/');
              }}
            >
              {t('confirm.discard')}
            </Button>
          </>
        }
      >
        <p>{t('confirm.discardNotice')}</p>
      </Dialog>
    </div>
  );
}

function NewPostPageWrapper() {
  const { t } = useI18n();
  return (
    <TaskShell backHref="/" backLabel={t('common.back')}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '32px' }}>{t('common.loading')}</div>}>
        <ComposeForm />
      </Suspense>
    </TaskShell>
  );
}

export default function NewPostPage() {
  return <NewPostPageWrapper />;
}
