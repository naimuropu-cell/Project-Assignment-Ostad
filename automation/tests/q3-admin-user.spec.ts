import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';
import { config } from '../utils/config';

test.describe('Q3: Admin - User Management', () => {
  test('should search user, edit role/status, save, and verify change persists after refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);

    // 1. Log in with valid credentials
    await loginPage.open();
    await loginPage.login(
      config.adminCredentials.username,
      config.adminCredentials.password
    );
    await expect(page).toHaveURL(/.*dashboard.*/);

    // 2. Navigate to Admin
    await dashboardPage.clickMenu('Admin');
    await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);

    // Wait for users table to populate
    await page.waitForSelector('.oxd-table-body .oxd-table-row', { timeout: 15000 });

    // 3. Find a user to test with (prefer a non-Admin user if available to allow status/role edits safely)
    const rows = page.locator('.oxd-table-body .oxd-table-row');
    const totalRows = await rows.count();
    expect(totalRows).toBeGreaterThan(0);

    // Pick target row (use 2nd row if available, otherwise 1st)
    const targetRowIndex = totalRows > 1 ? 1 : 0;
    const targetRow = rows.nth(targetRowIndex);
    const targetUsername = (await targetRow.locator('.oxd-table-cell').nth(1).innerText()).trim();

    // 4. Search for that user by username
    await adminPage.searchUser(targetUsername);

    // 5. Verify the results table shows the correct matching row(s)
    const matchingCount = await adminPage.getMatchingRowsCount();
    expect(matchingCount).toBeGreaterThan(0);

    const initialDetails = await adminPage.getFirstRowDetails();
    expect(initialDetails.username).toBe(targetUsername);

    // 6. Click edit on the user
    await adminPage.clickEditFirstUser();

    // Determine new status to toggle (Enabled <-> Disabled)
    const newStatus = initialDetails.status === 'Enabled' ? 'Disabled' : 'Enabled';
    await adminPage.updateStatus(newStatus);

    // 7. Save the change
    await adminPage.saveEdit();

    // 8. Refresh the page and verify the change persisted
    const updatedDetails = await adminPage.refreshAndVerifyUser(targetUsername);
    expect(updatedDetails.status).toBe(newStatus);
  });
});
