import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import { I18nProvider } from '@/lib/i18n/context';

export const metadata: Metadata = {
  title: 'Krishi: Crop advisory and community for Indian farmers',
  description: 'Ask practical crop questions, share pest observations, and learn from experienced growers in your region.',
  manifest: '/manifest.json',
  other: {
    'site-kind': 'software',
    'page-type': 'software',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f5ec' },
    { media: '(prefers-color-scheme: dark)', color: '#17281d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="soft"
      data-ground="sand"
      data-buttons="solid"
      data-motion
    >
      <head>
        <meta name="site-kind" content="software" />
        <meta name="page-type" content="software" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&family=JetBrains+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/system.css" />
        <link rel="stylesheet" href="/assets/ui/cards.css" />
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <link rel="stylesheet" href="/assets/backgrounds/backgrounds.css" />
        <link rel="stylesheet" href="/assets/layout/layout.css" />
        <link rel="stylesheet" href="/assets/layout/demo.css" />
        <link rel="stylesheet" href="/assets/icons/icon.css" />
        <link rel="stylesheet" href="/assets/moments/cursor-spotlight/moment.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700);`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
:root {
  --p-bg: #f6f5ec; --p-surface: #e9eae0; --p-ink: #17281d; --p-muted: #5d695e;
  --p-accent: #1f5134; --p-accent-ink: #f6f5ec; --p-action: #1f5134; --p-action-ink: #f6f5ec;
  --p-inv-bg: #17281d; --p-inv-surface: #243429; --p-inv-ink: #f6f5ec; --p-inv-muted: #99a096;
  --p-inv-accent: #f6f5ec; --p-inv-accent-ink: #17281d; --p-inv-action: #f6f5ec; --p-inv-action-ink: #17281d;
  --font-display: "Manrope", system-ui, sans-serif;
  --font-text: "Manrope", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 500;
  --display-tracking: -0.035em;
  --display-tracking-xl: -0.045em;
  --ly-scale: 0.97;
}

/* Hero Collage background & lighting */
.hero__art {
  background:
    radial-gradient(70% 60% at 18% 12%, color-mix(in oklab, var(--p-surface) 80%, white), transparent 70%),
    radial-gradient(60% 50% at 90% 100%, color-mix(in oklab, var(--p-bg) 80%, var(--p-accent)), transparent 70%),
    var(--p-bg);
}
.hero__art::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .22; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .3 0 0 0 0 .3 0 0 0 0 .3 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.hero__art > .ly-piece--main {
  left: var(--s-6);
  top: var(--s-6);
  width: calc(100% - 2 * var(--s-6));
  max-width: calc(100% - 2 * var(--s-6));
}
.hero__art > .ly-piece--note { left: var(--s-6); bottom: var(--s-6); width: 280px; z-index: 2; }
.d-note__line { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 13px; color: #3d4247; border-top: 1px solid rgb(0 0 0 / .06); }
.d-note__line:first-of-type { border-top: 0; }
.d-note__line i { width: 18px; height: 18px; border-radius: 50%; flex: none; display: grid; place-items: center; background: #e7f4ec; color: #17673f; font-style: normal; font-size: 13px; font-weight: 700; }
.d-note__line i.warn { background: #fdf0dc; color: #8a5300; }
.d-note__line b { font-weight: 500; color: #16181a; }
.ly-piece--main .d-row { grid-template-columns: 36px minmax(0, 1fr) 56px 96px; }
.ly-piece--main .d-main { padding-right: var(--s-4); }

/* 3 cards across on desktop */
.open-cards > .card { grid-column: 1 / -1; }
@media (min-width: 1024px) {
  .open-cards > .card { grid-column: auto / span 4; }
}
@media (max-width: 1023px) {
  .hero__art > .ly-piece--note { left: var(--s-4); bottom: var(--s-4); width: 260px; }
}
.open-cards .panel {
  --p-h: 175px;
  background:
    radial-gradient(80% 70% at 20% 0%, color-mix(in oklab, var(--p-surface) 80%, white), transparent 70%),
    var(--p-bg);
}
.open-cards .d-card { box-shadow: 0 0 0 1px rgb(0 0 0 / .06), 0 14px 32px -18px rgb(0 0 0 / .35); }
.open-cards .stage > .at-rise { --ax: 20px; --ay: 20px; --fit-max: 280px; }

@media (max-width: 639px) {
  .open-cards .panel { --p-h: 140px; }
  .open-cards > .card > .panel { margin-top: var(--s-3); }
  .btn--xl.btn--wide { padding-inline: var(--s-4, 16px) !important; }
}
`,
          }}
        />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
        <Script src="/assets/system.js" type="module" strategy="afterInteractive" />
        <Script src="/assets/layout/layout.js" type="module" strategy="afterInteractive" />
      </body>
    </html>
  );
}
