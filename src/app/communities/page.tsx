'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BrowseShell } from '@/components/shells/BrowseShell';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import placesData from '@/lib/services/places.json';
import { Community, UserProfile, PaginatedResult } from '@/types';
import { MapPinIcon, UsersIcon } from '@/components/ui/Icons';
import styles from './Communities.module.css';

function CommunitiesContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const kindParam = searchParams.get('kind') || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [activeKind, setActiveKind] = useState<string>(kindParam);
  const [commsData, setCommsData] = useState<PaginatedResult<Community>>({
    items: [],
    page: 1,
    pageSize: 12,
    total: 0,
    hasOlder: false,
    hasNewer: false,
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [memberships, setMemberships] = useState<string[]>([]);

  const loadData = () => {
    const user = krishiService.getCurrentUser(locale);
    setCurrentUser(user);
    if (user) {
      setMemberships(krishiService.getMemberships(user.username));
    } else {
      setMemberships([]);
    }
    const result = krishiService.getCommunities(activeKind, currentPage, 12, locale);
    setCommsData(result);
  };

  useEffect(() => {
    setActiveKind(kindParam);
  }, [kindParam]);

  useEffect(() => {
    loadData();
    const unsub = krishiService.subscribe(loadData);
    return unsub;
  }, [activeKind, currentPage, locale]);

  const isMember = currentUser?.role === 'member';

  const handleToggleJoin = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser || !isMember) return;
    const isJoined = memberships.includes(slug);
    krishiService.setMembership(slug, !isJoined);
  };

  return (
    <div className={styles.container}>
      {/* Header and Filter Section */}
      <section className={styles.headerSection}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>{t('nav.groups')}</h1>
            <p style={{ fontSize: '14px', color: 'var(--p-muted)', marginTop: '4px' }}>
              {t('groups.subtitle')}
            </p>
          </div>
          {isMember ? (
            <Link href="/communities/new">
              <Button variant="solid">{t('groups.create')}</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="solid">{t('groups.signInToCreate')}</Button>
            </Link>
          )}
        </div>

        {/* 3 Strict Category Tabs */}
        <div className={styles.filterTabs} role="tablist">
          <Link
            href="/communities?kind=all"
            className={`${styles.tabBtn} ${activeKind === 'all' ? styles.activeTabBtn : ''}`}
            role="tab"
            aria-selected={activeKind === 'all'}
          >
            {t('groups.all')}
          </Link>
          <Link
            href="/communities?kind=location"
            className={`${styles.tabBtn} ${activeKind === 'location' ? styles.activeTabBtn : ''}`}
            role="tab"
            aria-selected={activeKind === 'location'}
          >
            {t('groups.stateGroups')}
          </Link>
          <Link
            href="/communities?kind=topic"
            className={`${styles.tabBtn} ${activeKind === 'topic' ? styles.activeTabBtn : ''}`}
            role="tab"
            aria-selected={activeKind === 'topic'}
          >
            {t('groups.cropTopics')}
          </Link>
        </div>
      </section>

      {/* Compact, Sleek 3-Column Community Cards Grid */}
      {commsData.items.length === 0 ? (
        <div className={styles.emptyState}>
          <p style={{ color: 'var(--p-muted)' }}>{t('empty.groups')}</p>
          <Link href="/communities">
            <Button variant="outline">{t('groups.seeAll')}</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {commsData.items.map((comm) => {
            const name = comm.labels?.[locale]?.name || comm.name;
            const desc = comm.labels?.[locale]?.description || comm.description;
            const isLocation = comm.kind === 'location';
            const stateObj = placesData.states.find((s) => s.key === comm.stateKey);
            const stateName = (stateObj?.labels as any)?.[locale] || (stateObj?.labels as any)?.en || comm.stateKey;
            const isJoined = memberships.includes(comm.slug);

            return (
              <article key={comm.id} className={styles.groupCard}>
                <div className={styles.cardTopRow}>
                  <div className={styles.thumbWrapper}>
                    <img
                      src={comm.imageUrl || '/assets/crops/paddy_mandya.jpg'}
                      alt={comm.imageAlt || name}
                      className={styles.thumbImg}
                      loading="eager"
                    />
                  </div>
                  <div className={styles.cardHeadInfo}>
                    <Link href={`/communities/${comm.slug}`} className={styles.groupName}>
                      {name}
                    </Link>
                    <div className={styles.badgeRow}>
                      <span className={styles.compactBadge}>
                        {isLocation ? t('badge.location') : t('badge.topic')}
                      </span>
                      {comm.stateKey && (
                        <span className={styles.stateTag}>
                          <MapPinIcon size={11} />
                          <span>{stateName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className={styles.groupDesc}>{desc}</p>

                <div className={styles.cardBottomRow}>
                  <span className={styles.memberCount}>
                    {isLocation ? '1.8k farmers' : '940 growers'}
                  </span>
                  <div className={styles.cardActions}>
                    {isMember && (
                      <button
                        type="button"
                        onClick={(e) => handleToggleJoin(comm.slug, e)}
                        className={isJoined ? styles.joinedBtn : styles.joinBtn}
                        aria-label={isJoined ? `Leave ${name}` : `Join ${name}`}
                      >
                        {isJoined ? `✓ ${t('status.joined')}` : `+ ${t('community.join')}`}
                      </button>
                    )}
                    <Link
                      href={`/communities/${comm.slug}`}
                      className={styles.openLink}
                    >
                      {t('groups.open')} →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(commsData.hasNewer || commsData.hasOlder) && (
        <nav className={styles.pagination} aria-label="Communities pagination">
          {commsData.hasNewer ? (
            <Link
              href={`/communities?kind=${activeKind}&page=${currentPage - 1}`}
              className={styles.openLink}
            >
              ← {t('list.previousGroups')}
            </Link>
          ) : (
            <span />
          )}

          {commsData.hasOlder ? (
            <Link
              href={`/communities?kind=${activeKind}&page=${currentPage + 1}`}
              className={styles.openLink}
            >
              {t('list.moreGroups')} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}

export default function CommunitiesPage() {
  return (
    <BrowseShell>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '32px' }}>Loading groups...</div>}>
        <CommunitiesContent />
      </Suspense>
    </BrowseShell>
  );
}
