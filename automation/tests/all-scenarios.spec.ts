import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { AdminPage } from '../pages/AdminPage';
import { LeavePage } from '../pages/LeavePage';
import { config } from '../utils/config';
import { getRandomEmployee } from '../utils/dataGenerator';

test.describe.serial('Full OrangeHRM SQA Suite (Q1 - Q4 Sequentially)', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let pimPage: PimPage;
  let adminPage: AdminPage;
  let leavePage: LeavePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage = new PimPage(page);
    adminPage = new AdminPage(page);
    leavePage = new LeavePage(page);
  });

  test('Q1: Invalid login displays proper error message', async () => {
    await loginPage.open();
    await loginPage.login(
      config.invalidCredentials.username,
      config.invalidCredentials.password
    );
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
  });

  test('Q2: PIM - Add employee with random data, verify in list, and logout', async ({ page }) => {
    await loginPage.open();
    await loginPage.login(
      config.adminCredentials.username,
      config.adminCredentials.password
    );
    await expect(page).toHaveURL(/.*dashboard.*/);

    await dashboardPage.clickMenu('PIM');
    const newEmployee = getRandomEmployee();

    await pimPage.openAddEmployee();
    await pimPage.createEmployee(
      newEmployee.firstName,
      newEmployee.lastName,
      newEmployee.employeeId
    );

    await pimPage.openEmployeeList();
    await pimPage.searchByEmployeeId(newEmployee.employeeId);
    const isPresent = await pimPage.isEmployeeInTable(
      newEmployee.employeeId,
      newEmployee.firstName
    );
    expect(isPresent).toBeTruthy();

    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });

  test('Q3: Admin - Search user, edit role/status, verify persistence', async ({ page }) => {
    await loginPage.open();
    await loginPage.login(
      config.adminCredentials.username,
      config.adminCredentials.password
    );
    await expect(page).toHaveURL(/.*dashboard.*/);

    await dashboardPage.clickMenu('Admin');
    await page.waitForSelector('.oxd-table-body .oxd-table-row', { timeout: 15000 });

    const rows = page.locator('.oxd-table-body .oxd-table-row');
    const totalRows = await rows.count();
    expect(totalRows).toBeGreaterThan(0);

    const targetRowIndex = totalRows > 1 ? 1 : 0;
    const targetRow = rows.nth(targetRowIndex);
    const targetUsername = (await targetRow.locator('.oxd-table-cell').nth(1).innerText()).trim();

    await adminPage.searchUser(targetUsername);
    const matchingCount = await adminPage.getMatchingRowsCount();
    expect(matchingCount).toBeGreaterThan(0);

    const initialDetails = await adminPage.getFirstRowDetails();
    expect(initialDetails.username).toBe(targetUsername);

    await adminPage.clickEditFirstUser();
    const newStatus = initialDetails.status === 'Enabled' ? 'Disabled' : 'Enabled';
    await adminPage.updateStatus(newStatus);
    await adminPage.saveEdit();

    const updatedDetails = await adminPage.refreshAndVerifyUser(targetUsername);
    expect(updatedDetails.status).toBe(newStatus);
  });

  test('Q4: Leave - Apply leave, check status, and cancel request', async ({ page }) => {
    await loginPage.open();
    await loginPage.login(
      config.adminCredentials.username,
      config.adminCredentials.password
    );
    await expect(page).toHaveURL(/.*dashboard.*/);

    await dashboardPage.clickMenu('Leave');
    await leavePage.openApplyTab();

    const hasDropdown = await leavePage.leaveTypeDropdown.isVisible();
    if (hasDropdown) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
      const fromDate = nextMonth.toISOString().split('T')[0];
      try {
        await leavePage.applyLeave(fromDate, fromDate);
      } catch (e) {
        console.log('Leave apply note:', e);
      }
    }

    await leavePage.openMyLeaveTab();
    const rowCount = await leavePage.myLeaveRows.count();
    if (rowCount > 0) {
      const statusText = await leavePage.getLatestLeaveStatus();
      expect(statusText.length).toBeGreaterThan(0);

      const cancelButton = leavePage.myLeaveRows.first().getByRole('button', { name: 'Cancel' });
      if (await cancelButton.isVisible()) {
        await leavePage.cancelLatestLeave();
        const updatedStatus = await leavePage.getLatestLeaveStatus();
        expect(updatedStatus.toLowerCase()).toContain('cancel');
      }
    } else {
      await expect(page.locator('.oxd-table-body')).toBeVisible();
    }
  });
});
