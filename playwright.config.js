import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './.kiro/specs',
  testMatch: '**/*.test.js',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
});
