import {readFileSync} from 'fs';

import {defineConfig} from 'vite';
import {replaceCodePlugin} from 'vite-plugin-replace';

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
    modules: {
      globalModulePaths: [/global\.css$/],
    },
  },
}));