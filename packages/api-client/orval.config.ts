import { defineConfig } from 'orval';

export default defineConfig({
  // React Query hooks
  api: {
    input: {
      target: '../api-spec/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'react-query',
      target: './src/generated/endpoints',
      schemas: './src/generated/schemas',
      mock: true,
      clean: true,
      indexFiles: true, // Creates index.ts in each tag folder
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  
  // Zod schemas
  apiZod: {
    input: {
      target: '../api-spec/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: './src/generated/endpoints',
      fileExtension: '.zod.ts',
      clean: false, // Don't clean since api output runs first
      indexFiles: false, // api output already creates index files
    },
  },
});