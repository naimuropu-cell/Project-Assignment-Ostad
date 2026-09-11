import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../utils/config';

test.describe('Q1: Authentication Tests', () => {
  test('should display error message when logging in with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.open();

    // Enter invalid credentials and submit
    await loginPage.login(
      config.invalidCredentials.username,
      config.invalidCredentials.password
    );

    // Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
  });
});
