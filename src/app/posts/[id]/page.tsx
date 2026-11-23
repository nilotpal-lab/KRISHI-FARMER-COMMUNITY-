'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { Post, Comment, Community, UserProfile, Locale, ReportReason, PaginatedResult } from '@/types';
import { AlertCircleIcon, CheckIcon } from '@/components/ui/Icons';
import { AudioRecorder } from '@/components/common/AudioRecorder';
import { useAutoTranslate } from '@/lib/utils/useAutoTranslate';
import { TranslationBadge } from '@/components/common/TranslationBadge';
import styles from './PostDetail.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

function CommentItemRow({
  comment,
  locale,
  formatDate,
}: {
  comment: Comment;
  locale: Locale;
  formatDate: (d: string) => string;
}) {
  const { t } = useI18n();
  const {
    isCrossLanguage,
    showOriginal,
    isLoading,
    displayText,
    toggleShowOriginal,
    sourceLangName,
  } = useAutoTranslate({
    contentId: comment.id,
    originalText: comment.body,
    originalLang: comment.lang || 'en',
    currentLocale: locale,
    seededTranslation: comment.labels?.[locale]?.body,
  });

  const playCommentTTS = () => {
    if (typeof window === 'undefined') return;

    if (locale === 'kn') {
      try {
        const audio = new Audio(`/api/tts?lang=kn&text=${encodeURIComponent(displayText.slice(0, 200))}`);
        audio.play().catch(() => {});
        return;
      } catch {
        // fallback below
      }
    }

    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(displayText);
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
    <div className={styles.commentItem}>
      <div className={styles.commentMeta}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InitialsAvatar name={comment.authorDisplayName} />
          <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>
            {comment.authorDisplayName}
          </span>
        </div>
        <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
      </div>

      {isCrossLanguage && (
        <TranslationBadge
          sourceLangName={sourceLangName}
          showOriginal={showOriginal}
          onToggle={toggleShowOriginal}
          isLoading={isLoading}
        />
      )}

      <div className={styles.commentBody} lang={showOriginal ? comment.lang : locale}>
        {displayText}
        {comment.audioUrl && (
          <div style={{ marginTop: '8px' }}>
            <audio controls src={comment.audioUrl} style={{ width: '100%', height: '36px' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '4px' }}>
        <button
          type="button"
          className={styles.ttsBtn}
          onClick={playCommentTTS}
          title={t('post.listenComment')}
          aria-label={t('post.listenComment')}
        >
          🔊 <span>{t('common.listen')}</span>
        </button>
      </div>
    </div>
  );
}

function PostDetailContent({ postId }: { postId: string }) {
  const { t, formatDate, locale } = useI18n();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [post, setPost] = useState<Post | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  // Comment state
  const [commentsData, setCommentsData] = useState<PaginatedResult<Comment>>({
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
    hasOlder: false,
    hasNewer: false,
  });
  const [commentText, setCommentText] = useState('');
  const [commentAudioUrl, setCommentAudioUrl] = useState<string | null>(null);
  const [commentLang, setCommentLang] = useState<Locale>(locale);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Report state
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>('spam');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [hasReportedAlready, setHasReportedAlready] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Auto-translate integration for post (unconditional hook call)
  const {
    isCrossLanguage,
    showOriginal,
    isLoading: isTranslating,
    displayTitle,
    displayBody,
    toggleShowOriginal,
    sourceLangName,
  } = useAutoTranslate({
    contentId: post?.id || '',
    originalText: post?.body || '',
    originalLang: post?.lang || 'en',
    currentLocale: locale,
    isFieldTitleAndBody: true,
    originalTitle: post?.title,
    originalBody: post?.body,
    seededTitle: post?.labels?.[locale]?.title,
    seededBody: post?.labels?.[locale]?.body,
  });

  const loadData = () => {
    const p = krishiService.getPostById(postId, locale);
    setPost(p);

    const user = krishiService.getCurrentUser(locale);
    setCurrentUser(user);

    if (p) {
      const comm = krishiService.getCommunityBySlug(p.communitySlug, locale);
      setCommunity(comm);

      if (user && comm) {
        const memberships = krishiService.getMemberships(user.username);
        setIsJoined(memberships.includes(comm.slug));
      } else {
        setIsJoined(false);
      }

      setHasReportedAlready(krishiService.hasUserReported(p.id));

      const comments = krishiService.getComments(p.id, currentPage, 20, locale);
      setCommentsData(comments);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = krishiService.subscribe(loadData);
    return unsub;
  }, [postId, currentPage, locale]);

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.postCard} style={{ textAlign: 'center' }}>
          <h2>{t('common.noPage')}</h2>
          <p style={{ color: 'var(--color-muted)', marginTop: '8px' }}>
            {t('post.hiddenOrRemoved')}
          </p>
          <div style={{ marginTop: '16px' }}>
            <Link href="/">
              <Button variant="solid">{t('nav.home')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const groupName = community?.labels?.[locale]?.name || community?.name || post.communitySlug;
  const isMember = currentUser?.role === 'member' || currentUser?.role === 'admin';
  const isGuest = !currentUser;
  const isOwnPost = currentUser?.username === post.authorUsername;

  const handleJoinAndRefresh = () => {
    if (!currentUser || !community) return;
    krishiService.setMembership(community.slug, true);
    setIsJoined(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    if (!isJoined) {
      krishiService.joinCommunity(post.communitySlug);
      setIsJoined(true);
    }

    let trimmed = commentText.trim();
    if (!trimmed && commentAudioUrl) {
      trimmed = `🎙️ ${t('post.voiceCommentText')}`;
    } else if (trimmed.length < 2 || trimmed.length > 600) {
      setCommentError(t('post.commentLengthError'));
      return;
    }

    setIsSubmittingComment(true);

    setTimeout(() => {
      const res = krishiService.addComment({
        postId: post.id,
        body: trimmed,
        lang: commentLang,
        audioUrl: commentAudioUrl || undefined,
      });

      setIsSubmittingComment(false);

      if (res.success) {
        setCommentText('');
        setCommentAudioUrl(null);
        loadData();
        // Focus discussion section
        const el = document.getElementById('discussion');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setCommentError(res.error ? t(res.error) : t('common.loadError'));
      }
    }, 200);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportError(null);

    const res = krishiService.reportPost(post.id, reportReason);
    if (res.success) {
      setReportSubmitted(true);
      setIsReportingOpen(false);
      setHasReportedAlready(true);
    } else {
      setReportError(res.error ? t(res.error) : t('common.errorDesc'));
    }
  };

  const playPostTTS = () => {
    if (typeof window === 'undefined' || !post) return;
    const textToSpeak = `${displayTitle || post.title}. ${displayBody || post.body}`;

    if (locale === 'kn') {
      try {
        const audio = new Audio(`/api/tts?lang=kn&text=${encodeURIComponent(textToSpeak.slice(0, 200))}`);
        audio.play().catch(() => {});
        return;
      } catch {
        // fallback below
      }
    }

    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
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
    <div className={styles.container}>
      {/* Full Post Article */}
      <article className={styles.postCard}>
        <div className={styles.metaHeader}>
          <div className={styles.authorGroup}>
            <InitialsAvatar name={post.authorDisplayName} />
            <span className={styles.authorName}>{post.authorDisplayName}</span>
            <span>•</span>
            <Link href={`/communities/${post.communitySlug}`} className={styles.groupLink}>
              {groupName}
            </Link>
          </div>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        {isCrossLanguage && (
          <TranslationBadge
            sourceLangName={sourceLangName}
            showOriginal={showOriginal}
            onToggle={toggleShowOriginal}
            isLoading={isTranslating}
          />
        )}

        <h1 className={styles.title} lang={showOriginal ? post.lang : locale}>
          {displayTitle || post.title}
        </h1>

        <div style={{ margin: '4px 0 12px 0' }}>
          <button
            type="button"
            className={styles.ttsBtn}
            onClick={playPostTTS}
            title={t('post.listenPost')}
            aria-label={t('post.listenPost')}
          >
            🔊 <span>{t('post.listenPost')}</span>
          </button>
        </div>

        {post.imageUrl && (
          <div className={styles.postPhotoWrapper}>
            <div className={styles.postPhotoFrame}>
              <img
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                className={styles.postPhoto}
              />
            </div>
            <div className={styles.photoCaption}>
              <span className={styles.photoBadge}>
                {t('post.photoEvidence')}
              </span>
              <span className={styles.photoCredit}>
                {t('post.photoDiagnostic', { group: groupName })}
              </span>
            </div>
          </div>
        )}

        <div className={styles.bodyText} lang={showOriginal ? post.lang : locale}>
          {displayBody || post.body}
        </div>

        {post.audioUrl && (
          <div style={{ margin: '14px 0', padding: '12px 14px', background: 'var(--color-surface-subtle)', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              🎙️ {t('media.voicePreview')}
            </span>
            <audio controls src={post.audioUrl} style={{ width: '100%', height: '40px' }} />
          </div>
        )}

        <div className={styles.postFooter}>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
            {t('post.writtenIn', { lang: locale === 'kn' ? t('lang.kannada') : locale === 'hi' ? t('lang.hindi') : t('lang.english') })}
          </span>

          {/* Report Button (Only for members, cannot report own) */}
          {isMember && !isOwnPost && (
            <div>
              {hasReportedAlready || reportSubmitted ? (
                <span style={{ fontSize: '13px', color: 'var(--color-leaf-pressed)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckIcon size={14} />
                  <span>{t('report.already')}</span>
                </span>
              ) : (
                <button
                  type="button"
                  className={styles.reportBtn}
                  onClick={() => setIsReportingOpen(!isReportingOpen)}
                >
                  <AlertCircleIcon size={14} />
                  <span>{t('report.open')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Inline Report Disclosure Panel */}
        {isReportingOpen && (
          <form onSubmit={handleReportSubmit} className={styles.reportPanel}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-danger)' }}>
              {t('report.open')}
            </h3>

            {reportError && (
              <p style={{ color: 'var(--color-danger)', fontSize: '14px', fontWeight: 600 }}>
                {reportError}
              </p>
            )}

            <div className={styles.reportReasons} role="radiogroup" aria-label={t('report.reason')}>
              {(['spam', 'abuse', 'unsafe', 'other'] as ReportReason[]).map((reasonKey) => (
                <label key={reasonKey} className={styles.reasonOption}>
                  <input
                    type="radio"
                    name="report_reason"
                    value={reasonKey}
                    checked={reportReason === reasonKey}
                    onChange={() => setReportReason(reasonKey)}
                  />
                  <span>
                    {reasonKey === 'spam'
                      ? t('report.spam')
                      : reasonKey === 'abuse'
                      ? t('report.abuse')
                      : reasonKey === 'unsafe'
                      ? t('report.unsafe')
                      : t('report.other')}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <Button type="button" variant="outline" size="small" onClick={() => setIsReportingOpen(false)}>
                {t('report.cancel')}
              </Button>
              <Button type="submit" variant="danger" size="small">
                {t('report.send')}
              </Button>
            </div>
          </form>
        )}
      </article>

      {/* Discussion Section */}
      <section id="discussion" className={styles.discussionSection} aria-label={t('post.discussion')}>
        <div className={styles.discussionHeader}>
          <h2 className={styles.discussionTitle}>
            {t('post.discussion')} ({commentsData.total})
          </h2>
        </div>

        {/* Comment Composer Box */}
        {isMember && (
          <form onSubmit={handleCommentSubmit} className={styles.commentComposer} noValidate>
            {commentError && (
              <div style={{ color: 'var(--color-danger)', fontSize: '14px', fontWeight: 600 }}>
                {commentError}
              </div>
            )}
            <Textarea
              label={t('comment.write')}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('post.commentPlaceholder')}
              required={!commentAudioUrl}
            />

            <div style={{ marginBottom: '12px' }}>
              <AudioRecorder
                maxDurationSeconds={30}
                audioUrl={commentAudioUrl}
                onAudioRecorded={setCommentAudioUrl}
                label={t('media.recordVoice')}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ width: '160px' }}>
                <Select
                  label={t('post.language')}
                  value={commentLang}
                  onChange={(e) => setCommentLang(e.target.value as Locale)}
                >
                  <option value="kn">{t('lang.kannada')}</option>
                  <option value="en">{t('lang.english')}</option>
                  <option value="hi">{t('lang.hindi')}</option>
                </Select>
              </div>
              <Button type="submit" variant="solid" isLoading={isSubmittingComment}>
                {t('comment.post')}
              </Button>
            </div>
          </form>
        )}

        {isGuest && (
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-paper)', borderRadius: 'var(--radius-control)' }}>
            <Link href={`/login?next=/posts/${post.id}`}>
              <Button variant="solid">{t('auth.signInComment')}</Button>
            </Link>
          </div>
        )}

        {/* Flat Comments List */}
        <div className={styles.commentsList}>
          {commentsData.items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '24px 0' }}>
              {t('empty.comments')}
            </p>
          ) : (
            commentsData.items.map((comment) => (
              <CommentItemRow
                key={comment.id}
                comment={comment}
                locale={locale}
                formatDate={formatDate}
              />
            ))
          )}
        </div>

        {/* Comments Pagination */}
        {(commentsData.hasNewer || commentsData.hasOlder) && (
          <nav className={styles.pagination} aria-label="Comments pagination">
            {commentsData.hasNewer ? (
              <Link
                href={`/posts/${post.id}?page=${currentPage - 1}#discussion`}
                style={{ fontWeight: 700, minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
              >
                ← {t('list.newerComments')}
              </Link>
            ) : (
              <span />
            )}

            {commentsData.hasOlder ? (
              <Link
                href={`/posts/${post.id}?page=${currentPage + 1}#discussion`}
                style={{ fontWeight: 700, minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
              >
                {t('list.olderComments')} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </div>
  );
}

function PostPageWrapper({ postId }: { postId: string }) {
  const { t } = useI18n();
  return (
    <TaskShell backHref="/" backLabel={t('common.back')}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '32px' }}>{t('common.loading')}</div>}>
        <PostDetailContent postId={postId} />
      </Suspense>
    </TaskShell>
  );
}

export default function PostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <PostPageWrapper postId={resolvedParams.id} />;
}
