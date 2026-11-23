'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { BrowseShell } from '@/components/shells/BrowseShell';
import { PostCard } from '@/components/common/PostCard';
import { InlineComposer } from '@/components/common/InlineComposer';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { Post, Community, UserProfile, PaginatedResult } from '@/types';
import styles from './Home.module.css';

function HomeContent() {
  const { t, locale } = useI18n();

  const [postsData, setPostsData] = useState<PaginatedResult<Post>>({
    items: [],
    page: 1,
    pageSize: 3,
    total: 0,
    hasOlder: false,
    hasNewer: false,
  });

  const [communities, setCommunities] = useState<Community[]>([]);
  const [communitiesMap, setCommunitiesMap] = useState<Record<string, Community>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const loadData = () => {
    setCurrentUser(krishiService.getCurrentUser(locale));
    const posts = krishiService.getPosts(1, 3, undefined, locale);
    setPostsData(posts);

    const commsResult = krishiService.getCommunities('all', 1, 4, locale);
    setCommunities(commsResult.items);
    const map: Record<string, Community> = {};
    commsResult.items.forEach((c) => {
      map[c.slug] = c;
    });
    setCommunitiesMap(map);
  };

  useEffect(() => {
    loadData();
    const unsub = krishiService.subscribe(loadData);
    return unsub;
  }, [locale]);

  const isMember = currentUser?.role === 'member';

  return (
    <BrowseShell>
      {/* SCREEN 1: THE HERO (100svh) */}
      <section
        className="hero hero--collage section"
        data-enter
        aria-labelledby="hero-h"
        style={{ '--h': 1 } as React.CSSProperties}
      >
        <div className="wrap">
          <div className="hero-text grid hero__grid">
            <div className="hero__text span-5">
              <p className="hero__kicker">
                <span className="dot" aria-hidden="true" />
                {t('home.heroKicker')}
              </p>
              <h1 id="hero-h">{t('home.heroTitle')}</h1>
              <p className="hero__lead">
                {t('home.heroLead')}
              </p>
              <div className="btn-row">
                <a href="#discussions" className="btn btn--primary">
                  {t('home.heroExplore')}
                </a>
                <Link href="/communities" className="btn btn--secondary">
                  {t('home.heroBrowse')}
                </Link>
              </div>
              <p className={styles.heroProof}>
                {t('home.heroProof')}
              </p>
            </div>

            {/* HERO ART COLLAGE WITH CURSOR SPOTLIGHT MOMENT */}
            <div
              className="hero__art span-6 start-7"
              role="img"
              aria-label={t('home.deskTitle')}
              data-edge-free
              data-moment="cursor-spotlight"
              data-moment-opts='{"rest": [0.72, 0.28], "radius": 460}'
            >
              <div className="ly-piece ly-piece--main d-win" aria-hidden="true">
                <div className="d-win__bar">
                  <span className="d-win__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>{t('home.deskTitle')}</span>
                </div>
                <div className="d-win__body">
                  <div className="d-side">
                    <span className="is-on">
                      <i />
                      {t('home.recent')}
                    </span>
                    <span>
                      <i />
                      {t('home.pestAlerts')}
                    </span>
                    <span>
                      <i />
                      {t('home.irrigation')}
                    </span>
                    <span>
                      <i />
                      {t('home.nutrients')}
                    </span>
                    <span className="d-side__label">{t('home.districts')}</span>
                    <span>
                      <i />
                      {t('district.dharwad')}
                    </span>
                    <span>
                      <i />
                      {t('district.mandya')}
                    </span>
                    <span>
                      <i />
                      {t('district.nashik')}
                    </span>
                  </div>
                  <div className="d-main">
                    <div className="d-main__head">
                      <h4>{t('home.liveQueries')}</h4>
                      <Link href={isMember ? '/posts/new' : '/login'} className="d-btn">
                        {t('home.askQuestion')}
                      </Link>
                    </div>
                    <div className="d-tabs">
                      <span className="is-on">{t('home.allCrops', { n: 10 })}</span>
                      <span>{t('home.cropChilli')}</span>
                      <span>{t('home.cropTomato')}</span>
                      <span>{t('home.cropPaddy')}</span>
                    </div>
                    <div className="d-rows">
                      <div className="d-row">
                        <img
                          src="/assets/crops/chilli_crop.jpg"
                          alt={t('home.mockQuery1Alt')}
                          className="d-thumb"
                          style={{ objectFit: 'cover', borderRadius: '4px', width: '32px', height: '32px' }}
                        />
                        <div>
                          <b>{t('home.mockQuery1')}</b>
                          <small>{t('home.mockQuery1Sub')}</small>
                        </div>
                        <span className="num">{t('home.mockQuery1Replies')}</span>
                        <span className="d-chip">{t('home.statusActive')}</span>
                      </div>
                      <div className="d-row">
                        <img
                          src="/assets/crops/tomato_crop.jpg"
                          alt={t('home.mockQuery2Alt')}
                          className="d-thumb"
                          style={{ objectFit: 'cover', borderRadius: '4px', width: '32px', height: '32px' }}
                        />
                        <div>
                          <b>{t('home.mockQuery2')}</b>
                          <small>{t('home.mockQuery2Sub')}</small>
                        </div>
                        <span className="num">{t('home.mockQuery2Replies')}</span>
                        <span className="d-chip d-chip--low">{t('home.statusAdvisory')}</span>
                      </div>
                      <div className="d-row">
                        <img
                          src="/assets/crops/paddy_mandya.jpg"
                          alt={t('home.mockQuery3Alt')}
                          className="d-thumb"
                          style={{ objectFit: 'cover', borderRadius: '4px', width: '32px', height: '32px' }}
                        />
                        <div>
                          <b>{t('home.mockQuery3')}</b>
                          <small>{t('home.mockQuery3Sub')}</small>
                        </div>
                        <span className="num">{t('home.mockQuery3Replies')}</span>
                        <span className="d-chip">{t('home.statusSolved')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floated Result Note Card */}
              <div
                className="ly-piece ly-piece--note d-card"
                aria-hidden="true"
                data-ly-steps="700"
              >
                <div className="d-card__row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src="/assets/farmers/gowri_avatar.jpg"
                      alt=""
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <h5>{t('home.verifiedAdvisory')}</h5>
                  </div>
                  <span className="d-chip">{t('home.statusActive')}</span>
                </div>
                <div className="d-note__line">
                  <i className="warn">!</i>
                  <span>
                    <b>{t('home.verifiedLine1')}</b>
                  </span>
                </div>
                <div className="d-note__line">
                  <i>✓</i>
                  <span>
                    <b>{t('home.verifiedLine2')}</b>
                  </span>
                </div>
                <div className="d-note__line">
                  <i>✓</i>
                  <span>
                    <b>{t('home.verifiedLine3')}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN 2: DISCUSSIONS */}
      <section
        className={`section ${styles.contentSection}`}
        id="discussions"
        aria-labelledby="discussions-h"
      >
        <div className="wrap">
          <div className="section-head">
            <h2 id="discussions-h">
              {t('home.discussionsTitle')} <span className="muted">{t('home.discussionsMuted')}</span>
            </h2>
          </div>

          {/* Layman Action Cards Grid */}
          <div className={styles.laymanCardsGrid} role="navigation" aria-label="Farmer Quick Tools">
            <Link href="/scanner" className={styles.laymanCard}>
              <span className={styles.laymanCardIcon} aria-hidden="true">📸</span>
              <h3 className={styles.laymanCardTitle}>{t('nav.scanner')}</h3>
              <p className={styles.laymanCardSub}>{t('scanner.subtitle')}</p>
            </Link>

            <Link href="/mandi" className={styles.laymanCard}>
              <span className={styles.laymanCardIcon} aria-hidden="true">💰</span>
              <h3 className={styles.laymanCardTitle}>{t('nav.mandi')}</h3>
              <p className={styles.laymanCardSub}>{t('mandi.subtitle')}</p>
            </Link>

            <Link href="/guides" className={styles.laymanCard}>
              <span className={styles.laymanCardIcon} aria-hidden="true">🌾</span>
              <h3 className={styles.laymanCardTitle}>{t('nav.guides')}</h3>
              <p className={styles.laymanCardSub}>{t('guides.subtitle')}</p>
            </Link>

            <Link href="/schemes" className={styles.laymanCard}>
              <span className={styles.laymanCardIcon} aria-hidden="true">🏛️</span>
              <h3 className={styles.laymanCardTitle}>{t('nav.schemes')}</h3>
              <p className={styles.laymanCardSub}>{t('schemes.subtitle')}</p>
            </Link>
          </div>

          <InlineComposer onPostCreated={loadData} />
          <div className="grid open-cards">
            {postsData.items.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                community={communitiesMap[post.communitySlug]}
              />
            ))}
          </div>
          <div className={`btn-row ${styles.feedActions}`} style={{ marginTop: '16px' }}>
            <Link
              href={isMember ? '/posts/new' : '/login'}
              className="btn btn--primary"
            >
              {t('home.write')}
            </Link>
            <Link href="/communities" className="btn btn--secondary">
              {t('home.findGroups')}
            </Link>
          </div>
        </div>
      </section>

      {/* SCREEN 3: REGIONAL CIRCLES */}
      <section
        className={`section ${styles.contentSection}`}
        id="groups"
        aria-labelledby="groups-h"
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-5">
              <div className="section-head">
                <h2 id="groups-h">
                  {t('home.circlesTitle')} <span className="muted">{t('home.circlesMuted')}</span>
                </h2>
                <p className="hero__lead" style={{ fontSize: '15px', marginTop: '12px' }}>
                  {t('home.circlesLead')}
                </p>
              </div>

              <div className={styles.circleList} data-edge-free>
                {communities.map((comm) => {
                  const displayName =
                    comm.labels?.[locale]?.name || comm.name;
                  return (
                    <Link
                      key={comm.id}
                      href={`/communities/${comm.slug}`}
                      className={styles.circleItem}
                      style={{ minHeight: '48px' }}
                    >
                      <div className={styles.circleMeta}>
                        <img
                          src={comm.imageUrl || '/assets/crops/paddy_mandya.jpg'}
                          alt=""
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            flexShrink: 0,
                            border: '1px solid rgba(23, 40, 29, 0.12)',
                          }}
                        />
                        <span className={styles.circleName}>{displayName}</span>
                      </div>
                      <span className={styles.circleBadge}>
                        {comm.kind === 'topic' ? t('groups.cropTopic') : t('groups.district')}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="btn-row" style={{ marginTop: '32px' }}>
                <Link href="/communities" className="btn btn--secondary">
                  {t('home.exploreAll')}
                </Link>
              </div>
            </div>

            <div className="span-6 start-7">
              <div
                className="frame frame--split"
                data-edge-free
                style={{
                  height: '100%',
                  minHeight: '440px',
                  background: 'var(--p-surface, #e9eae0)',
                  borderRadius: 'var(--r-lg, 16px)',
                  padding: '24px',
                  border: '1px solid var(--color-line, rgba(23, 40, 29, 0.12))',
                }}
                role="img"
                aria-label={t('home.calendarTitle')}
              >
                <div className={styles.calendarDesk}>
                  <div style={{ position: 'relative', height: '110px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                    <img
                      src="/assets/crops/paddy_mandya.jpg"
                      alt={t('home.calendarAlt')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23, 40, 29, 0.88) 0%, rgba(23, 40, 29, 0.25) 60%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '10px 14px',
                      color: '#ffffff',
                    }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#17281d', background: '#e9efe8', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 700, marginBottom: '4px' }}>
                        {t('home.activeSurveillance')}
                      </span>
                      <b style={{ fontSize: '14px' }}>{t('home.calendarStations')}</b>
                    </div>
                  </div>
                  <div className={styles.calendarHead}>
                    {t('home.calendarTitle')}
                  </div>
                  <div className={styles.calendarTable}>
                    <div className={styles.calendarRow}>
                      <span className={styles.calDistrict}>{t('district.dharwad')}</span>
                      <span className={styles.calCrop}>{t('home.calRow1Crop')}</span>
                      <span className={styles.calStatus}>{t('home.statusActive')}</span>
                    </div>
                    <div className={styles.calendarRow}>
                      <span className={styles.calDistrict}>{t('district.mandya')}</span>
                      <span className={styles.calCrop}>{t('home.calRow2Crop')}</span>
                      <span className={styles.calStatus}>{t('home.statusNormal')}</span>
                    </div>
                    <div className={styles.calendarRow}>
                      <span className={styles.calDistrict}>{t('district.nashik')}</span>
                      <span className={styles.calCrop}>{t('home.calRow3Crop')}</span>
                      <span className={styles.calStatus}>{t('home.statusAdvisory')}</span>
                    </div>
                    <div className={styles.calendarRow}>
                      <span className={styles.calDistrict}>{t('district.guntur')}</span>
                      <span className={styles.calCrop}>{t('home.calRow4Crop')}</span>
                      <span className={styles.calStatus}>{t('home.statusAlert')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BrowseShell>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="wrap" style={{ padding: '80px 0' }}>
          Loading Krishi...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
