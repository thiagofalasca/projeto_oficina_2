import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  timeout: 120_000,
  testDir: './__tests-e2e__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: path.resolve('./__tests-e2e__/setup/global-setup'),
  globalTeardown: path.resolve('./__tests-e2e__/setup/global-teardown'),
  use: {
    storageState: '__tests-e2e__/setup/state.json',
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
