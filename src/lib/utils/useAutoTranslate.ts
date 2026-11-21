'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/types';
import { useI18n } from '@/lib/i18n/context';

interface TranslationProps {
  contentId: string;
  originalText: string;
  originalLang: Locale;
  currentLocale: Locale;
  seededTranslation?: string;
  isFieldTitleAndBody?: boolean;
  originalTitle?: string;
  originalBody?: string;
  seededTitle?: string;
  seededBody?: string;
}

export function useAutoTranslate({
  contentId,
  originalText,
  originalLang,
  currentLocale,
  seededTranslation,
  isFieldTitleAndBody,
  originalTitle,
  originalBody,
  seededTitle,
  seededBody,
}: TranslationProps) {
  const { t } = useI18n();

  const isCrossLanguage = originalLang !== currentLocale;
  const hasSeeded = isFieldTitleAndBody
    ? Boolean(seededTitle && seededBody)
    : Boolean(seededTranslation);

  const [showOriginal, setShowOriginal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>(
    seededTranslation || originalText
  );
  const [translatedTitle, setTranslatedTitle] = useState<string>(
    seededTitle || originalTitle || ''
  );
  const [translatedBody, setTranslatedBody] = useState<string>(
    seededBody || originalBody || ''
  );
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    // If same language, no translation needed
    if (!isCrossLanguage) {
      setShowOriginal(false);
      setIsLoading(false);
      setTranslatedText(originalText);
      setTranslatedTitle(originalTitle || '');
      setTranslatedBody(originalBody || '');
      return;
    }

    // If human seeded translation exists, use it immediately
    if (hasSeeded) {
      setIsLoading(false);
      if (isFieldTitleAndBody) {
        setTranslatedTitle(seededTitle || '');
        setTranslatedBody(seededBody || '');
      } else {
        setTranslatedText(seededTranslation || '');
      }
      return;
    }

    // Check localStorage cache
    const cacheKey = `krishi_trans_${contentId}_${currentLocale}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        if (isFieldTitleAndBody) {
          const parts = cached.split('\n---SEP---\n');
          if (parts.length >= 2) {
            setTranslatedTitle(parts[0]);
            setTranslatedBody(parts.slice(1).join('\n---SEP---\n'));
          } else {
            setTranslatedTitle(cached);
            setTranslatedBody(originalBody || '');
          }
        } else {
          setTranslatedText(cached);
        }
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // Storage access error or quota
    }

    // Call /api/translate
    setIsLoading(true);
    setIsFailed(false);

    let isCancelled = false;

    const textToTranslate = isFieldTitleAndBody
      ? `${originalTitle || ''}\n---SEP---\n${originalBody || ''}`
      : originalText;

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: textToTranslate,
        from: originalLang,
        to: currentLocale,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Translation API returned status ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (isCancelled) return;
        if (data.translatedText) {
          const result = data.translatedText;
          try {
            localStorage.setItem(cacheKey, result);
          } catch (e) {
            // Storage quota warning handled defensively
          }

          if (isFieldTitleAndBody) {
            const parts = result.split(/\n?---SEP---\n?/);
            if (parts.length >= 2) {
              setTranslatedTitle(parts[0].trim());
              setTranslatedBody(parts.slice(1).join('\n').trim());
            } else {
              setTranslatedTitle(result);
              setTranslatedBody(originalBody || '');
            }
          } else {
            setTranslatedText(result);
          }
        } else {
          setIsFailed(true);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsFailed(true);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [
    contentId,
    currentLocale,
    originalLang,
    isCrossLanguage,
    hasSeeded,
    isFieldTitleAndBody,
    originalText,
    originalTitle,
    originalBody,
    seededTranslation,
    seededTitle,
    seededBody,
  ]);

  const toggleShowOriginal = () => {
    setShowOriginal((prev) => !prev);
  };

  const sourceLangName =
    originalLang === 'kn'
      ? t('lang.kannada')
      : originalLang === 'hi'
      ? t('lang.hindi')
      : t('lang.english');

  return {
    isCrossLanguage,
    showOriginal,
    isLoading,
    isFailed,
    displayTitle: showOriginal ? (originalTitle || '') : translatedTitle,
    displayBody: showOriginal ? (originalBody || '') : translatedBody,
    displayText: showOriginal ? originalText : translatedText,
    toggleShowOriginal,
    sourceLangName,
  };
}
