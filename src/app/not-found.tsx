'use client';

import React from 'react';
import Link from 'next/link';
import { TaskShell } from '@/components/shells/TaskShell';
import { Button } from '@/components/ui/Button';
import { SproutIcon } from '@/components/ui/Icons';
import { useI18n } from '@/lib/i18n/context';

export default function NotFoundPage() {
  const { t } = useI18n();

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
          <div style={{ color: 'var(--color-leaf)' }}>
            <SproutIcon size={40} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-ink)' }}>
            {t('common.notFoundTitle')}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            {t('common.notFoundDesc')}
          </p>
          <div style={{ marginTop: '8px' }}>
            <Link href="/">
              <Button variant="solid">{t('nav.home')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </TaskShell>
  );
}
