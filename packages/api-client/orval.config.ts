import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: '../api-spec/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated',
      client: 'react-query',
      // or client: 'axios' for non-React apps
      mock: true,
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});