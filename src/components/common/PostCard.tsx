'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, Community } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
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

  // Real persisted upvote state
  const [upvotes, setUpvotes] = useState<number>(() => post.upvotes ?? 0);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [sharedToast, setSharedToast] = useState(false);

  useEffect(() => {
    setUpvotes(krishiService.getPostUpvotes(post.id) || (post.upvotes ?? 0));
    setHasUpvoted(krishiService.isPostUpvoted(post.id));
  }, [post.id, post.upvotes]);

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
    const result = krishiService.toggleUpvotePost(post.id);
    setUpvotes(result.upvotes);
    setHasUpvoted(result.hasUpvoted);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/posts/${post.id}`;
    const shareData = {
      title: activeTitle,
      text: `${activeTitle} - Krishi`,
      url: shareUrl,
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed, fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setSharedToast(true);
        setTimeout(() => setSharedToast(false), 2000);
      } catch {
        // clipboard access failed
      }
    }
  };

  const playPostTTS = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${activeTitle}. ${activeBody}`);
    const targetLang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(locale));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    window.speechSynthesis.speak(utterance);
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

      {/* Clean real crop photograph without obscuring overlay */}
      <div
        className="panel panel--inset"
        role="img"
        aria-label={post.imageAlt || `Field observations: ${activeTitle}`}
        style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}
      >
        <img
          src={post.imageUrl || '/assets/crops/paddy_mandya.jpg'}
          alt={post.imageAlt || activeTitle}
          className="frame__img"
          loading="lazy"
          style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
        />
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

          <button
            type="button"
            className={styles.ttsBtn}
            onClick={playPostTTS}
            title={locale === 'kn' ? 'ಧ್ವನಿ ಆಲಿಸಿ' : locale === 'hi' ? 'पोस्ट सुनें' : 'Listen to post'}
            aria-label="Listen to post"
          >
            🔊 <span>{locale === 'kn' ? 'ಆಲಿಸಿ' : locale === 'hi' ? 'सुनें' : 'Listen'}</span>
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
      </div>
    </article>
  );
};
