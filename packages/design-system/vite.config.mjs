import {readFileSync} from 'fs';

import {defineConfig} from 'vite';
import {replaceCodePlugin} from 'vite-plugin-replace';
import { resolve } from 'path';
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)),
);

// eslint-disable-next-line import/no-default-export
export default defineConfig(() => ({
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: '{{PROJECT_VERSION}}',
          to: pkg.version,
        },
      ],
    }),
  ],
  css: {
    build: {
      lib: {
        entry: resolve(__dirname, 'web/styles/index.css'),
        name: 'MyDesignSystem',
        fileName: (format) => `my-design-system.${format}.js`,
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'web/styles/index.css'),
        },
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'index.css') return 'my-design-system.css';
            return assetInfo.name;
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        css: {
          charset: false,
        },
      },
    },
    modules: {
      globalModulePaths: [/global\.css$/],
    },
  },
}));