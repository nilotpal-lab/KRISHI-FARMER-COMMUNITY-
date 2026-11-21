'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import styles from './Login.module.css';

function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    const user = krishiService.getCurrentUser();
    if (user) {
      router.push('/profile');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError(t('auth.invalidCredentials'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await krishiService.login(username, password);
      setIsLoading(false);

      if (res.success) {
        router.push(nextUrl.startsWith('/') ? nextUrl : '/');
      } else {
        setError(t(res.error || 'auth.invalidCredentials'));
        setPassword(''); // Clear password on failure per spec
      }
    } catch {
      setIsLoading(false);
      setError(t('auth.invalidCredentials'));
      setPassword('');
    }
  };

  const handleContinueAsGuest = () => {
    krishiService.logout();
    router.push('/');
  };

  const handleFillDemo = (demoUser: string) => {
    setUsername(demoUser);
    setPassword('demo_pass_123');
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{t('auth.signIn')}</h1>
          <p className={styles.notice}>{t('auth.prepared')}</p>
        </div>

        {/* Demo Helper Box for Testing / Academic grading */}
        <div className={styles.demoHelpBox}>
          <span className={styles.demoHelpTitle}>{t('login.demoLogins')}</span>
          <div>
            •{' '}
            <button
              type="button"
              onClick={() => handleFillDemo('gowri_demo')}
              style={{ background: 'none', border: 'none', color: 'var(--color-leaf)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              gowri_demo
            </button>{' '}
            ({t('login.farmerMember')})
          </div>
          <div>
            •{' '}
            <button
              type="button"
              onClick={() => handleFillDemo('ravi_demo')}
              style={{ background: 'none', border: 'none', color: 'var(--color-leaf)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              ravi_demo
            </button>{' '}
            ({t('login.farmerMember')})
          </div>
          <div>
            •{' '}
            <button
              type="button"
              onClick={() => handleFillDemo('admin_demo')}
              style={{ background: 'none', border: 'none', color: 'var(--color-leaf)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              admin_demo
            </button>{' '}
            ({t('login.demoModerator')})
          </div>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label={t('auth.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="e.g. gowri_demo"
          />

          <div className={styles.passwordWrapper}>
            <Input
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            </button>
          </div>

          <Button type="submit" variant="solid" fullWidth isLoading={isLoading}>
            {t('auth.signIn')}
          </Button>
        </form>

        <div className={styles.secondaryActions}>
          <div style={{ textAlign: 'center', margin: '8px 0 4px 0' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              {t('auth.noAccountPrompt')}{' '}
            </span>
            <Link
              href="/signup"
              style={{
                fontWeight: 700,
                color: 'var(--color-leaf)',
                textDecoration: 'underline',
                fontSize: '14px',
              }}
            >
              {t('auth.createAccount')}
            </Link>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleContinueAsGuest}
            style={{ marginTop: '8px' }}
          >
            {t('auth.continueAsGuest')}
          </Button>
        </div>

        <div className={styles.footerLinks}>
          <Link href="/about">{t('nav.about')}</Link>
        </div>
      </div>
    </div>
  );
}

function LoginPageWrapper() {
  const { t } = useI18n();
  return (
    <TaskShell backHref="/" backLabel={t('nav.home')}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '24px' }}>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </TaskShell>
  );
}

export default function LoginPage() {
  return <LoginPageWrapper />;
}
