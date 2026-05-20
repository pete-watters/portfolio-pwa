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
        short_name: "Pete's PWA",
        name: "Pete's Progressive Web App Portfolio",
        icons: [
          {
            src: 'img/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'img/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
        start_url: '/',
        display: 'fullscreen',
        background_color: '#000000',
        theme_color: '#000000',
      },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,jpg,ico,woff2}'],
      },
    }),
  ],
});
