import { reactRouter } from '@react-router/dev/vite';
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: 'daniel-xx',
  project: 'async_gate',
  // An auth token is required for uploading source maps;
  // store it in an environment variable to keep it secure.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // ...
};

// https://vite.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [reactRouter(), tailwindcss(), sentryReactRouter(sentryConfig, config)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: false,
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
