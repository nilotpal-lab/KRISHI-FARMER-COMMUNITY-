'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post, Community } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { useAutoTranslate } from '@/lib/utils/useAutoTranslate';
import { TranslationBadge } from '@/components/common/TranslationBadge';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  community?: Community | null;
}

export const PostCard: React.FC<PostCardProps> = ({ post, community }) => {
  const { t, formatDate, locale } = useI18n();

  // Local state for interactive upvote and share feedback
  const [upvotes, setUpvotes] = useState(12);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Translated community name if available
  const groupName =
    community?.labels?.[locale]?.name ||
    community?.name ||
    post.communitySlug;

  // Auto-translate integration
  const {
    isCrossLanguage,
    showOriginal,
    isLoading,
    displayTitle,
    displayBody,
    toggleShowOriginal,
    sourceLangName,
  } = useAutoTranslate({
    contentId: post.id,
    originalText: post.body,
    originalLang: post.lang || 'en',
    currentLocale: locale,
    isFieldTitleAndBody: true,
    originalTitle: post.title,
    originalBody: post.body,
    seededTitle: post.labels?.[locale]?.title,
    seededBody: post.labels?.[locale]?.body,
  });

  const activeTitle = displayTitle || post.title;
  const activeBody = displayBody || post.body;

  // Localized author display name
  let authorName = post.authorDisplayName;
  if (post.authorUsername === 'gowri_demo') {
    authorName = locale === 'kn' ? 'ಗೌರಿ' : locale === 'hi' ? 'गौरी' : 'Gowri';
  } else if (post.authorUsername === 'ravi_demo') {
    authorName = locale === 'kn' ? 'ರವಿ' : locale === 'hi' ? 'रवि' : 'Ravi';
  } else if (post.authorUsername === 'admin_demo') {
    authorName = locale === 'kn' ? 'ಕೃಷಿ ಡೆಮೊ ಮಾಡರೇಟರ್' : locale === 'hi' ? 'कृषि डेमो मॉडरेटर' : 'Krishi Demo Moderator';
  }

  // Truncate excerpt cleanly up to 140 characters
  const excerpt =
    activeBody.length > 140 ? `${activeBody.slice(0, 140)}…` : activeBody;

  const langLabel =
    locale === 'kn' ? t('lang.kannada') : locale === 'hi' ? t('lang.hindi') : t('lang.english');

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasUpvoted) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2000);
    }
  };

  return (
    <article className="card card--row" data-edge-free>
      <div className={styles.metaHeader}>
        <div className={styles.authorGroup} style={{ minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}>
          <InitialsAvatar
            name={authorName}
            avatarUrl={
              post.authorUsername === 'gowri_demo'
                ? '/assets/farmers/gowri_avatar.jpg'
                : post.authorUsername === 'ravi_demo'
                ? '/assets/farmers/ravi_avatar.jpg'
                : undefined
            }
          />
          <span className={styles.authorName}>{authorName}</span>
          <span className={styles.dot}>•</span>
          <Link
            href={`/communities/${post.communitySlug}`}
            className={styles.groupLink}
          >
            {groupName}
          </Link>
        </div>
        <time dateTime={post.createdAt} className={styles.timeTag}>
          {formatDate(post.createdAt)}
        </time>
      </div>

      {isCrossLanguage && (
        <TranslationBadge
          sourceLangName={sourceLangName}
          showOriginal={showOriginal}
          onToggle={toggleShowOriginal}
          isLoading={isLoading}
        />
      )}

      <h3 className={styles.title} lang={showOriginal ? post.lang : locale}>
        <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {activeTitle}
        </Link>
      </h3>

      <p className={styles.excerpt} lang={locale}>
        {excerpt}
      </p>

      {post.audioUrl && (
        <div style={{ margin: '8px 0 12px 0', width: '100%' }}>
          <audio controls src={post.audioUrl} style={{ width: '100%', height: '40px' }} />
        </div>
      )}

      {/* Inset visual UI fragment with real crop photograph */}
      <div
        className="panel panel--inset"
        role="img"
        aria-label={post.imageAlt || `Field observations: ${activeTitle}`}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <img
          src={post.imageUrl || '/assets/crops/paddy_mandya.jpg'}
          alt={post.imageAlt || activeTitle}
          className="frame__img"
          loading="lazy"
        />
        <div className="stage" style={{ position: 'relative', zIndex: 1 }}>
          <div className="at-rise fit">
            <div
              className="d-card"
              aria-hidden="true"
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="d-card__row">
                <h5>{groupName}</h5>
                <span className="d-chip">{langLabel}</span>
              </div>
              <div className="d-note__line">
                <i>✓</i>
                <span>
                  {t('post.fieldPhoto', { group: groupName })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reddit & Twitter style Forum Action Bar */}
      <div className={styles.footer}>
        <div className={styles.actionBar}>
          <button
            type="button"
            className={`${styles.actionPill} ${hasUpvoted ? styles.upvoted : ''}`}
            onClick={handleUpvote}
            aria-label="Mark helpful"
          >
            <span>▲</span>
            <span>{upvotes} {locale === 'kn' ? 'ಉಪಯುಕ್ತ' : locale === 'hi' ? 'उपयोगी' : 'Helpful'}</span>
          </button>

          <Link href={`/posts/${post.id}`} className={styles.actionPill}>
            <span>💬</span>
            <span>{locale === 'kn' ? 'ಚರ್ಚೆ' : locale === 'hi' ? 'टिप्पणियां' : 'Discussion'}</span>
          </Link>

          <button
            type="button"
            className={styles.actionPill}
            onClick={handleShare}
            aria-label="Share post"
          >
            <span>🔗</span>
            <span>{sharedToast ? (locale === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ!' : locale === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (locale === 'kn' ? 'ಹಂಚಿಕೊಳ್ಳಿ' : locale === 'hi' ? 'साझा करें' : 'Share')}</span>
          </button>
        </div>

        <Link href={`/posts/${post.id}`} className="card__link">
          <span>{t('post.openDiscussion')}</span>
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M2 6h8M6 2l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};
