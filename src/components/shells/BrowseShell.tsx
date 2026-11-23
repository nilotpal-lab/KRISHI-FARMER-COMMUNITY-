'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { UserProfile } from '@/types';
import { LanguageModal } from '@/components/common/LanguageModal';
import { DemoBar } from '@/components/common/DemoBar';
import { KisanChatbot } from '@/components/common/KisanChatbot';
import { HomeIcon, UsersIcon, UserIcon, LogInIcon, GlobeIcon } from '@/components/ui/Icons';
import styles from './BrowseShell.module.css';

interface BrowseShellProps {
  children: React.ReactNode;
}

export const BrowseShell: React.FC<BrowseShellProps> = ({ children }) => {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(krishiService.getCurrentUser(locale));
    const unsub = krishiService.subscribe(() => {
      setUser(krishiService.getCurrentUser(locale));
    });
    return unsub;
  }, [locale]);

  const isHome = pathname === '/';
  const isCommunities = pathname.startsWith('/communities');

  const langDisplay = locale === 'kn' ? 'ಕನ್ನಡ' : locale === 'hi' ? 'हिन्दी' : 'English';

  const groupLabels: Record<string, string> = {
    'karnataka-farmers': locale === 'kn' ? 'ಕರ್ನಾಟಕದ ರೈತರು' : locale === 'hi' ? 'कर्नाटक के किसान' : 'Karnataka Farmers',
    'tomato-growers': locale === 'kn' ? 'ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗಾರರು' : locale === 'hi' ? 'टमाटर उगाने वाले किसान' : 'Tomato Growers',
    'maharashtra-farmers': locale === 'kn' ? 'ಮಹಾರಾಷ್ಟ್ರದ ರೈತರು' : locale === 'hi' ? 'महाराष्ट्र के किसान' : 'Maharashtra Farmers',
    'chilli-growers': locale === 'kn' ? 'ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಗಾರರು' : locale === 'hi' ? 'मिर्च उगाने वाले किसान' : 'Chilli Growers',
  };

  return (
    <>
      <header className={`nav ${isNavOpen ? 'is-open' : ''}`}>
        <div className="wrap nav__bar">
          <a className="skip-link" href="#main-content">
            {t('nav.skip')}
          </a>
          <Link href="/" className="nav__logo" onClick={() => setIsNavOpen(false)}>
            <span className="mark" data-mark="leaf" aria-hidden="true" />
            <span>{t('brand.title')}</span>
          </Link>

          <nav className="nav__links" aria-label={t('nav.mainNav')}>
            <div className="nav__item">
              <Link
                href="/"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={isHome ? 'page' : undefined}
              >
                {t('nav.home')}
              </Link>
            </div>
            <div className="nav__item">
              <Link
                href="/communities"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={isCommunities ? 'page' : undefined}
              >
                {t('nav.groups')}
              </Link>
            </div>
            <div className="nav__item">
              <Link
                href="/scanner"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={pathname === '/scanner' ? 'page' : undefined}
              >
                {t('nav.scanner')}
              </Link>
            </div>
            <div className="nav__item">
              <Link
                href="/mandi"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={pathname === '/mandi' ? 'page' : undefined}
              >
                {t('nav.mandi')}
              </Link>
            </div>
            <div className="nav__item">
              <Link
                href="/schemes"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={pathname === '/schemes' ? 'page' : undefined}
              >
                {t('nav.schemes')}
              </Link>
            </div>
            <div className="nav__item">
              <Link
                href="/guides"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={pathname === '/guides' ? 'page' : undefined}
              >
                {t('nav.guides')}
              </Link>
            </div>
            <div className="nav__item">
              <Link
                href="/about"
                className="nav__link"
                onClick={() => setIsNavOpen(false)}
                aria-current={pathname === '/about' ? 'page' : undefined}
              >
                {t('nav.about')}
              </Link>
            </div>
          </nav>

          <button
            type="button"
            className={styles.mobileLangBtn}
            onClick={() => setIsLangOpen(true)}
            aria-label={t('nav.language')}
          >
            <GlobeIcon size={16} />
            <span>{langDisplay}</span>
          </button>

          <div className="nav__actions">
            <DemoBar />
            <button
              type="button"
              className={styles.langBtn}
              onClick={() => setIsLangOpen(true)}
              aria-label={t('nav.language')}
            >
              <GlobeIcon size={14} />
              <span>{langDisplay}</span>
            </button>
            {user ? (
              <Link href="/profile" className="btn btn--secondary btn--sm" onClick={() => setIsNavOpen(false)}>
                {user.displayName}
              </Link>
            ) : (
              <Link href="/login" className="btn btn--primary btn--sm" onClick={() => setIsNavOpen(false)}>
                {t('auth.signIn')}
              </Link>
            )}
          </div>

          <button
            className="nav__toggle"
            type="button"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-expanded={isNavOpen}
            aria-label={t('nav.menu')}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
              {isNavOpen ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <main id="main-content" className={!isHome ? styles.subpageMain : undefined}>
        {isHome ? children : <div className="wrap">{children}</div>}
      </main>

      <footer className={`footer closing ${styles.footerOverride}`} aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--type">
            <div className="section-head">
              <h2 id="close-h">{t('footer.joinTitle')}</h2>
              <p>{t('footer.joinDesc')}</p>
            </div>
            <Link href="/login" className="btn btn--primary btn--xl btn--wide">
              {t('footer.getStarted')}
              <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                <path className="m-arrow__stem" d="M1 6h8" />
                <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
              </svg>
            </Link>
          </div>

          <div className="closing__links">
            <div className="grid">
              <div className="span-6 stack-5">
                <Link href="/" className="nav__logo">
                  <span className="mark" data-mark="leaf" aria-hidden="true" />
                  <span>{t('brand.title')}</span>
                </Link>
                <p className="footer__lede">
                  {t('footer.lede')}
                </p>
              </div>
              <div className="span-3 start-7 footer__col">
                <h4>{t('footer.communities')}</h4>
                <ul>
                  <li><Link href="/communities/karnataka-farmers">{groupLabels['karnataka-farmers']}</Link></li>
                  <li><Link href="/communities/tomato-growers">{groupLabels['tomato-growers']}</Link></li>
                  <li><Link href="/communities/maharashtra-farmers">{groupLabels['maharashtra-farmers']}</Link></li>
                  <li><Link href="/communities/chilli-growers">{groupLabels['chilli-growers']}</Link></li>
                </ul>
              </div>
              <div className="span-3 footer__col">
                <h4>{t('footer.platform')}</h4>
                <ul>
                  <li><Link href="/about">{t('footer.about')}</Link></li>
                  <li><Link href="/admin">{t('footer.moderation')}</Link></li>
                  <li><Link href="/login">{t('footer.signIn')}</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer__legal">
              <span>{t('footer.legal')}</span>
              <span className={styles.credits}>{t('footer.credits')}</span>
            </div>
          </div>
        </div>
        <KisanChatbot />
      </footer>

      <nav className="actionbar" data-bar="always" aria-label={t('nav.bottomNav')}>
        <Link
          href="/"
          className={`actionbar__item ${isHome ? 'is-active' : ''}`}
        >
          <HomeIcon size={20} />
          <span>{t('nav.home')}</span>
        </Link>
        <Link
          href="/scanner"
          className={`actionbar__item ${pathname === '/scanner' ? 'is-active' : ''}`}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }} aria-hidden="true">📸</span>
          <span>{t('nav.scanner')}</span>
        </Link>
        <Link
          href="/mandi"
          className={`actionbar__item ${pathname === '/mandi' ? 'is-active' : ''}`}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }} aria-hidden="true">💰</span>
          <span>{t('nav.mandi')}</span>
        </Link>
        <Link
          href="/communities"
          className={`actionbar__item ${isCommunities ? 'is-active' : ''}`}
        >
          <UsersIcon size={20} />
          <span>{t('nav.groups')}</span>
        </Link>
        <Link
          href={user ? '/profile' : '/login'}
          className={`actionbar__item ${pathname === '/profile' || pathname === '/login' ? 'is-active' : ''}`}
        >
          {user ? <UserIcon size={20} /> : <LogInIcon size={20} />}
          <span>{user ? t('nav.account') : t('auth.signIn')}</span>
        </Link>
      </nav>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </>
  );
};
