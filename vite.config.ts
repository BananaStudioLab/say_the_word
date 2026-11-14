import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  const isStore = mode === 'store';

  return {
    base: process.env.VITE_APP_ORIGIN || '/',
    ...(isBuild
      ? {
          define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
          },
        }
      : {}),
    plugins: [
      react(),
      tailwindcss(),
      ...(isStore
        ? [
            cssInjectedByJsPlugin({
              injectCodeFunction: function injectCSS(cssCode: string) {
                try {
                  if (typeof document !== 'undefined') {
                    const elementStyle = document.createElement('style');
                    elementStyle.setAttribute('data-sub-app-style', 'true');
                    elementStyle.appendChild(document.createTextNode(cssCode));
                    document.head.appendChild(elementStyle);
                  }
                } catch (e) {
                  console.error('vite-plugin-css-injected-by-js', e);
                }
              },
            }),
          ]
        : []),
    ],
    build: isStore
      ? {
          emptyOutDir: false,
          lib: {
            entry: 'src/store-entry.tsx',
            formats: ['es'],
            fileName: () => 'entry.js',
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
          },
        }
      : {
          emptyOutDir: true,
        },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
