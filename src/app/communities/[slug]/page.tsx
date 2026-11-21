'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { PostCard } from '@/components/common/PostCard';
import { InlineComposer } from '@/components/common/InlineComposer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import placesData from '@/lib/services/places.json';
import { Community, Post, UserProfile, PaginatedResult } from '@/types';
import { MapPinIcon } from '@/components/ui/Icons';
import styles from './GroupDetail.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function CommunityDetailContent({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [community, setCommunity] = useState<Community | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const [postsData, setPostsData] = useState<PaginatedResult<Post>>({
    items: [],
    page: 1,
    pageSize: 10,
    total: 0,
    hasOlder: false,
    hasNewer: false,
  });

  const loadData = () => {
    const comm = krishiService.getCommunityBySlug(slug);
    setCommunity(comm);

    const user = krishiService.getCurrentUser(locale);
    setCurrentUser(user);

    if (user && comm) {
      const memberships = krishiService.getMemberships(user.username);
      setIsJoined(memberships.includes(comm.slug));
    } else {
      setIsJoined(false);
    }

    if (comm) {
      const posts = krishiService.getPosts(currentPage, 10, comm.slug, locale);
      setPostsData(posts);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = krishiService.subscribe(loadData);
    return unsub;
  }, [slug, currentPage, locale]);

  if (!community) {
    return (
      <div className={styles.emptyState}>
        <p>{t('common.noPage')}</p>
        <Link href="/communities">
          <Button variant="outline">{t('groups.seeAll')}</Button>
        </Link>
      </div>
    );
  }

  const name = community.labels?.[locale]?.name || community.name;
  const description = community.labels?.[locale]?.description || community.description;
  const isLocation = community.kind === 'location';
  const isMember = currentUser?.role === 'member';
  const isGuest = !currentUser;

  const stateObj = placesData.states.find((s) => s.key === community.stateKey);
  const stateName = (stateObj?.labels as any)?.[locale] || (stateObj?.labels as any)?.en || community.stateKey;

  const handleToggleJoin = () => {
    if (!currentUser) return;
    if (isJoined) {
      setIsLeaveModalOpen(true);
    } else {
      krishiService.setMembership(community.slug, true);
    }
  };

  const handleConfirmLeave = () => {
    krishiService.setMembership(community.slug, false);
    setIsLeaveModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Group Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.headerBanner}>
          <img
            src={community.imageUrl || '/assets/crops/paddy_mandya.jpg'}
            alt={community.imageAlt || name}
            className={styles.headerBannerImg}
          />
        </div>

        <div className={styles.badgeRow}>
          <Badge variant="mint">
            {isLocation ? t('badge.location') : t('badge.topic')}
          </Badge>
          {community.stateKey && (
            <Badge variant="line">
              <MapPinIcon size={12} />
              <span>{stateName}</span>
            </Badge>
          )}
          {isJoined && <Badge variant="sun">{t('status.joined')}</Badge>}
        </div>

        <h1 className={styles.title}>{name}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.actionRow}>
          {isMember && (
            <>
              {isJoined ? (
                <>
                  <Link href={`/posts/new?group=${community.slug}`}>
                    <Button variant="solid">{t('home.write')}</Button>
                  </Link>
                  <Button variant="outline" onClick={handleToggleJoin}>
                    {t('group.leave')}
                  </Button>
                </>
              ) : (
                <Button variant="solid" onClick={handleToggleJoin}>
                  {t('group.join')}
                </Button>
              )}
            </>
          )}

          {isGuest && (
            <Link href={`/login?next=/communities/${community.slug}`}>
              <Button variant="solid">{t('auth.signInJoin')}</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Scoped Posts Feed */}
      <section aria-label="Community Posts">
        <div className={styles.feedHeader}>
          <h2 className={styles.feedTitle}>
            {t('post.discussion')} ({postsData.total})
          </h2>
        </div>

        <div style={{ marginTop: '16px' }}>
          <InlineComposer defaultCommunitySlug={community.slug} onPostCreated={loadData} />
          {postsData.items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{t('empty.groupPosts')}</p>
              {isMember && isJoined && (
                <Link href={`/posts/new?group=${community.slug}`}>
                  <Button variant="solid">{t('home.write')}</Button>
                </Link>
              )}
            </div>
          ) : (
            postsData.items.map((post) => (
              <PostCard key={post.id} post={post} community={community} />
            ))
          )}
        </div>

        {/* Pagination */}
        {(postsData.hasNewer || postsData.hasOlder) && (
          <nav className={styles.pagination} aria-label={t('community.pagination')}>
            {postsData.hasNewer ? (
              <Link
                href={`/communities/${slug}?page=${currentPage - 1}`}
                style={{ fontWeight: 700, minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
              >
                ← {t('list.newerPosts')}
              </Link>
            ) : (
              <span />
            )}

            {postsData.hasOlder ? (
              <Link
                href={`/communities/${slug}?page=${currentPage + 1}`}
                style={{ fontWeight: 700, minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
              >
                {t('list.olderPosts')} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>

      {/* Confirmation Dialog for Leaving Group */}
      <Dialog
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title={t('confirm.leaveTitle')}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={handleConfirmLeave}>
              {t('confirm.confirm')}
            </Button>
          </>
        }
      >
        <p>{t('confirm.leaveNotice')}</p>
      </Dialog>
    </div>
  );
}

function CommunityPageWrapper({ slug }: { slug: string }) {
  const { t } = useI18n();
  return (
    <TaskShell backHref="/communities" backLabel={t('nav.groups')}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '32px' }}>Loading...</div>}>
        <CommunityDetailContent slug={slug} />
      </Suspense>
    </TaskShell>
  );
}

export default function CommunityPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <CommunityPageWrapper slug={resolvedParams.slug} />;
}
