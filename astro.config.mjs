import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://petewatters.ie',
  redirects: {
    '/cv/full-stack': '/cv/',
    '/cv/frontend': '/cv/',
    '/cv/product': '/cv/',
    // Old case-study slugs from the pre-split structure → new detail pages.
    // Keeps existing homepage card links resolving.
    '/work/leather': '/work/leather-mobile',
  },
  integrations: [
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'Pete Watters',
        name: 'Pete Watters — Senior Web3 Frontend Engineer',
        description:
          'Portfolio of Pete Watters — senior frontend engineer shipping crypto products across Bitcoin, Stacks, Solana and EVM chains.',
        icons: [
          {
            src: '/img/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/img/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2b2b2b',
      },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,jpg,ico,woff2}'],
      },
    }),
  ],
});
