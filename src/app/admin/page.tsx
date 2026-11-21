'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TaskShell } from '@/components/shells/TaskShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { Report, PaginatedResult } from '@/types';
import styles from './Admin.module.css';

function AdminContent() {
  const { t, formatDate, locale } = useI18n();
  const router = useRouter();

  const [reportsData, setReportsData] = useState<PaginatedResult<Report>>({
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
    hasOlder: false,
    hasNewer: false,
  });

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);

  const loadData = () => {
    const user = krishiService.getCurrentUser(locale);
    if (!user || user.role !== 'admin') {
      router.push('/profile');
      return;
    }
    const res = krishiService.getOpenReports(1, 20, locale);
    setReportsData(res);
  };

  useEffect(() => {
    loadData();
    const unsub = krishiService.subscribe(loadData);
    return unsub;
  }, [router, locale]);

  const handleDismiss = (reportId: string) => {
    krishiService.resolveReport(reportId, 'dismiss');
  };

  const handleConfirmHide = () => {
    if (!selectedReport) return;
    krishiService.resolveReport(selectedReport.id, 'hide');
    setIsHideModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className={styles.container}>
      <section className={styles.headerCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="sun">{t('admin.badge')}</Badge>
          <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
            {t('admin.queue')}
          </span>
        </div>
        <h1 className={styles.title}>{t('admin.open')}</h1>
        <p className={styles.subtitle}>
          {t('admin.subtitle')}
        </p>
      </section>

      <section aria-label={t('admin.open')}>
        {reportsData.items.length === 0 ? (
          <div className={styles.emptyState}>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px' }}>
              {t('empty.reports')}
            </p>
            <Link href="/">
              <Button variant="outline">{t('admin.backToHome')}</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.reportsList}>
            {reportsData.items.map((report) => (
              <article key={report.id} className={styles.reportCard}>
                <div className={styles.reportMeta}>
                  <Badge variant="danger">
                    {t('admin.reasonLabel', { reason: t('report.' + report.reason) })}
                  </Badge>
                  <time dateTime={report.createdAt} style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                    {formatDate(report.createdAt)}
                  </time>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{t('admin.targetPost')}</span>
                  <h3 className={styles.targetTitle}>{report.postTitle}</h3>
                </div>

                <div className={styles.actionsRow}>
                  <Link href={`/posts/${report.postId}`}>
                    <Button variant="outline" size="small">
                      {t('post.openDiscussion')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleDismiss(report.id)}
                  >
                    {t('admin.dismiss')}
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setSelectedReport(report);
                      setIsHideModalOpen(true);
                    }}
                  >
                    {t('admin.hide')}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Hide Post Confirmation Dialog */}
      <Dialog
        isOpen={isHideModalOpen}
        onClose={() => {
          setIsHideModalOpen(false);
          setSelectedReport(null);
        }}
        title={t('confirm.hideTitle')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsHideModalOpen(false);
                setSelectedReport(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={handleConfirmHide}>
              {t('admin.hide')}
            </Button>
          </>
        }
      >
        <p>{t('confirm.hideNotice')}</p>
      </Dialog>
    </div>
  );
}

function AdminPageWrapper() {
  const { t } = useI18n();
  return (
    <TaskShell backHref="/profile" backLabel={t('nav.account')} title={t('footer.moderation')}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '32px' }}>Loading queue...</div>}>
        <AdminContent />
      </Suspense>
    </TaskShell>
  );
}

export default function AdminPage() {
  return <AdminPageWrapper />;
}
