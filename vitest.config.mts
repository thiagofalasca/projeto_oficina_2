import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    alias: {
      '@/auth': '__tests__/mocks/auth.ts',
      'next-auth/providers/credentials':
        '__tests__/mocks/next-auth-providers-credentials.ts',
      'next-auth': '__tests__/mocks/next-auth.ts',
    },
    setupFiles: ['dotenv/config'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/__tests-e2e__/**',
    ],
  },
});
