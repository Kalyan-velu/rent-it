import { defineConfig } from 'orval';

export default defineConfig({
  // HTTP client generation with React Query
  api: {
    input: {
      target: '../api-spec/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'react-query',
      target: './src/generated/endpoints',
      schemas: './src/generated/schemas',
      mock: false,
      clean: true,
      indexFiles: true,
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  // Zod schema generation
  apiZod: {
    input: {
      target: '../api-spec/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: './src/generated/endpoints',
      fileExtension: '.zod.ts',
      clean: false,
      indexFiles: true,
    },
  },
});