'use client';

import React, { useState, useMemo } from 'react';
import { TaskShell } from '@/components/shells/TaskShell';
import { useI18n } from '@/lib/i18n/context';
import { CROP_GUIDES } from '@/lib/services/cropGuidesData';
import { krishiService } from '@/lib/services/krishiService';
import { CropGuide } from '@/types';
import styles from './Guides.module.css';

export default function GuidesPage() {
  const { t, locale } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCropId, setExpandedCropId] = useState<string | null>('tomato');
  const [suggestingCropId, setSuggestingCropId] = useState<string | null>(null);
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionFeedback, setSuggestionFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = [
    { key: 'all', label: t('guides.categoryAll') },
    { key: 'vegetable', label: t('guides.categoryVegetables') },
    { key: 'cereal', label: t('guides.categoryCereals') },
    { key: 'pulse', label: t('guides.categoryPulses') },
    { key: 'commercial', label: t('guides.categoryCommercial') },
    { key: 'fruit', label: t('guides.categoryFruits') },
    { key: 'spice', label: t('guides.categorySpices') },
  ];

  const filteredCrops = useMemo(() => {
    return CROP_GUIDES.filter((crop) => {
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameEn = crop.names.en.toLowerCase();
      const nameKn = crop.names.kn.toLowerCase();
      const nameHi = crop.names.hi.toLowerCase();

      return nameEn.includes(q) || nameKn.includes(q) || nameHi.includes(q);
    });
  }, [searchQuery, selectedCategory]);

  const handleToggleExpand = (id: string) => {
    setExpandedCropId((prev) => (prev === id ? null : id));
    setSuggestingCropId(null);
    setSuggestionFeedback(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSpeakGuide = (crop: CropGuide) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cropName = crop.names[locale] || crop.names.en;
    const sowingText = crop.sowing[locale] || crop.sowing.en;
    const fertilizerText = crop.fertilizer[locale] || crop.fertilizer.en;
    const pestText = crop.pestCare[locale] || crop.pestCare.en;
    const harvestText = crop.harvest[locale] || crop.harvest.en;

    const fullNarration = `${cropName}. ${t('guides.sowing')}: ${sowingText}. ${t('guides.fertilizer')}: ${fertilizerText}. ${t('guides.pestCare')}: ${pestText}. ${t('guides.harvest')}: ${harvestText}.`;

    const utterance = new SpeechSynthesisUtterance(fullNarration);
    utterance.lang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSuggestSubmit = (cropId: string) => {
    if (!suggestionText.trim()) return;

    const res = krishiService.submitGuideSuggestion(cropId, suggestionText.trim());
    if (res.success) {
      setSuggestionFeedback(t('guides.suggestSubmitted'));
      setSuggestionText('');
      setTimeout(() => {
        setSuggestingCropId(null);
        setSuggestionFeedback(null);
      }, 3000);
    } else {
      setSuggestionFeedback(t('error.generic'));
    }
  };

  return (
    <TaskShell backHref="/" backLabel={t('nav.home')} title={t('nav.guides')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('guides.title')}</h1>
          <p className={styles.subtitle}>{t('guides.subtitle')}</p>
        </header>

        {/* Search & Filter Bar */}
        <section className={styles.searchBar} aria-label="Search and category filter">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('guides.searchPlaceholder')}
            className={styles.searchInput}
            aria-label={t('guides.searchPlaceholder')}
          />

          <div className={styles.filterChips} role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`${styles.chip} ${selectedCategory === cat.key ? styles.chipActive : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* 25 Crop List */}
        <div className={styles.cropList} role="region" aria-label="Crop Guides List">
          {filteredCrops.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--p-muted, #3d4d43)' }}>
              <p style={{ fontSize: '16px', fontWeight: 600 }}>{t('guides.noResults')}</p>
            </div>
          ) : (
            filteredCrops.map((crop) => {
              const isExpanded = expandedCropId === crop.id;
              const cropName = crop.names[locale] || crop.names.en;
              const season = crop.season[locale] || crop.season.en;
              const duration = crop.duration[locale] || crop.duration.en;

              return (
                <article key={crop.id} className={styles.cropCard}>
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(crop.id)}
                    className={styles.cropHeader}
                    aria-expanded={isExpanded}
                  >
                    <div className={styles.cropTitleRow}>
                      <span className={styles.cropEmoji} aria-hidden="true">
                        {crop.emoji}
                      </span>
                      <div>
                        <h2 className={styles.cropName}>{cropName}</h2>
                        <p className={styles.cropMeta}>
                          {t('guides.season')}: {season} • {duration}
                        </p>
                      </div>
                    </div>
                    <span className={styles.expandBtn}>
                      {isExpanded ? '▲' : '▼ ' + t('guides.viewGuide')}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className={styles.cropBody}>
                      <div className={styles.verifiedBadge}>
                        <span>✓</span>
                        <span>{t('guides.verifiedBadge')}</span>
                        <span style={{ fontWeight: 400, opacity: 0.85 }}>({t('guides.sampleNote')})</span>
                      </div>

                      <div className={styles.stagesGrid}>
                        {/* 1. Sowing */}
                        <div className={styles.stageBox}>
                          <span className={styles.stageLabel}>🌱 {t('guides.sowing')}</span>
                          <p className={styles.stageText}>
                            {crop.sowing[locale] || crop.sowing.en}
                          </p>
                        </div>

                        {/* 2. Fertilizer */}
                        <div className={styles.stageBox}>
                          <span className={styles.stageLabel}>🌾 {t('guides.fertilizer')}</span>
                          <p className={styles.stageText}>
                            {crop.fertilizer[locale] || crop.fertilizer.en}
                          </p>
                        </div>

                        {/* 3. Pest Care */}
                        <div className={styles.stageBox}>
                          <span className={styles.stageLabel}>🛡️ {t('guides.pestCare')}</span>
                          <p className={styles.stageText}>
                            {crop.pestCare[locale] || crop.pestCare.en}
                          </p>
                        </div>

                        {/* 4. Harvest */}
                        <div className={styles.stageBox}>
                          <span className={styles.stageLabel}>🧺 {t('guides.harvest')}</span>
                          <p className={styles.stageText}>
                            {crop.harvest[locale] || crop.harvest.en}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons: Read aloud & Suggest Edit */}
                      <div className={styles.actionRow}>
                        <button
                          type="button"
                          onClick={() => handleSpeakGuide(crop)}
                          className={styles.speakBtn}
                        >
                          <span>{isSpeaking ? '⏹️' : '🔊'}</span>
                          <span>{isSpeaking ? t('guides.stopAudio') : t('guides.playAudio')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSuggestingCropId((prev) => (prev === crop.id ? null : crop.id))}
                          className={styles.suggestBtn}
                        >
                          ✏️ {t('guides.suggestEdit')}
                        </button>
                      </div>

                      {/* Suggestion Form */}
                      {suggestingCropId === crop.id && (
                        <div className={styles.suggestionForm}>
                          {suggestionFeedback ? (
                            <p style={{ color: '#1e6338', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                              {suggestionFeedback}
                            </p>
                          ) : (
                            <>
                              <textarea
                                value={suggestionText}
                                onChange={(e) => setSuggestionText(e.target.value)}
                                placeholder={t('guides.suggestPlaceholder')}
                                rows={3}
                                className={styles.suggestionInput}
                              />
                              <button
                                type="button"
                                onClick={() => handleSuggestSubmit(crop.id)}
                                className={styles.submitSuggestBtn}
                              >
                                {t('common.submit')}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* KVK Helpline Assistance Card */}
        <aside className={styles.helplineCard} aria-labelledby="kvk-guides-h">
          <div className={styles.helplineText}>
            <h3 id="kvk-guides-h" className={styles.helplineTitle}>
              📞 {t('scanner.expertHelpline')}
            </h3>
            <p className={styles.helplineSub}>
              {t('scanner.expertAdvice')} (1800-180-1551)
            </p>
          </div>
          <a href="tel:18001801551" className={styles.callBtn}>
            <span>📞</span>
            <span>1800-180-1551</span>
          </a>
        </aside>
      </div>
    </TaskShell>
  );
}
