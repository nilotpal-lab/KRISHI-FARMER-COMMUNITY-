'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { blobToDataUrl } from '@/lib/utils/mediaUtils';
import styles from './AudioRecorder.module.css';

interface AudioRecorderProps {
  maxDurationSeconds?: number;
  audioUrl: string | null;
  onAudioRecorded: (url: string | null) => void;
  label?: string;
}

export function AudioRecorder({
  maxDurationSeconds = 60,
  audioUrl,
  onAudioRecorded,
  label,
}: AudioRecorderProps) {
  const { t } = useI18n();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop recording and clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);

    if (
      typeof window === 'undefined' ||
      !navigator?.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setErrorMessage(t('media.micUnsupported'));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        try {
          const dataUrl = await blobToDataUrl(audioBlob);
          onAudioRecorded(dataUrl);
        } catch {
          setErrorMessage(t('common.errorDesc'));
        }

        // Stop all audio tracks to turn off hardware indicator
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(250); // Slice data every 250ms
      setIsRecording(true);
      setElapsed(0);

      const interval = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= maxDurationSeconds) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
      timerIntervalRef.current = interval;
    } catch (err: unknown) {
      if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
        setErrorMessage(t('media.micDenied'));
      } else {
        setErrorMessage(t('media.micDenied'));
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleDiscard = () => {
    onAudioRecorded(null);
    setElapsed(0);
    setErrorMessage(null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.container}>
      {errorMessage && (
        <div className={styles.errorBox} role="alert">
          <span>{errorMessage}</span>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {audioUrl ? (
        <div className={styles.recorderBox}>
          <div className={styles.previewContainer}>
            <audio controls src={audioUrl} className={styles.audioPlayer} />
            <button
              type="button"
              onClick={handleDiscard}
              className={styles.discardBtn}
              title={t('media.removeAudio')}
            >
              <Trash2 size={16} />
              <span>{t('media.removeAudio')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.recorderBox}>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`${styles.micBtn} ${isRecording ? styles.micBtnRecording : ''}`}
            aria-label={isRecording ? t('media.stopRecording') : label || t('media.recordVoice')}
            title={isRecording ? t('media.stopRecording') : label || t('media.recordVoice')}
          >
            {isRecording ? <Square size={20} /> : <Mic size={22} />}
          </button>

          <div className={styles.statusText}>
            <span className={styles.label}>
              {isRecording ? t('media.recording') : label || t('media.recordVoice')}
            </span>
            <span className={styles.timer}>
              {formatTimer(elapsed)} / {formatTimer(maxDurationSeconds)}
            </span>
          </div>

          {isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className={styles.stopBtn}
            >
              <Square size={16} />
              <span>{t('media.stopRecording')}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
