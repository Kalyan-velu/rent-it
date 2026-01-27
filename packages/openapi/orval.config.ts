import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'packages/openapi/openapi.yaml',
    output: {
      target: 'packages/api-client/src/index.ts',
      client: 'axios',
      prettier: true,
      clean: true,
      baseUrl: '{process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}',
    },
  },
});
