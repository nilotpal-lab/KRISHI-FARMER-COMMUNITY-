'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import { UserProfile } from '@/types';
import styles from './DemoBar.module.css';

export const DemoBar: React.FC = () => {
  const { t, locale } = useI18n();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(krishiService.getCurrentUser(locale));
    const unsub = krishiService.subscribe(() => {
      setCurrentUser(krishiService.getCurrentUser(locale));
    });
    return unsub;
  }, [locale]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    krishiService.switchAccount(val === 'guest' ? null : val);
  };

  return (
    <div className={styles.bar} role="region" aria-label={t('common.demo')}>
      <div className={styles.notice}>
        <span className={styles.badge}>{t('demo.badge')}</span>
        <span>{t('common.demo')}</span>
      </div>
      <div className={styles.controls}>
        <label htmlFor="demo-account-select" className={styles.label}>
          {t('demo.bar.user')}
        </label>
        <select
          id="demo-account-select"
          className={styles.select}
          value={currentUser ? currentUser.username : 'guest'}
          onChange={handleAccountChange}
          aria-label={t('demo.bar.switch')}
        >
          <option value="guest">{t('demo.guest')}</option>
          <option value="gowri_demo">{t('demo.gowri')}</option>
          <option value="ravi_demo">{t('demo.ravi')}</option>
          <option value="admin_demo">{t('demo.admin')}</option>
        </select>
      </div>
    </div>
  );
};
