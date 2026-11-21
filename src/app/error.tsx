'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { TaskShell } from '@/components/shells/TaskShell';
import { Button } from '@/components/ui/Button';
import { AlertCircleIcon } from '@/components/ui/Icons';
import { useI18n } from '@/lib/i18n/context';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')}>
      <div style={{ maxWidth: '440px', margin: '48px auto', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: 'var(--radius-card)',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          <div style={{ color: 'var(--color-danger)' }}>
            <AlertCircleIcon size={36} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-ink)' }}>
            {t('common.loadError')}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            {t('common.errorDesc')}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="solid" onClick={() => reset()}>
              {t('common.retry')}
            </Button>
            <Link href="/">
              <Button variant="outline">{t('nav.home')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </TaskShell>
  );
}
