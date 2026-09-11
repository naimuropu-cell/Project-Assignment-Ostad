import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { config } from '../utils/config';
import { getRandomEmployee } from '../utils/dataGenerator';

test.describe('Q2: PIM - Employee Management', () => {
  test('should add new employee with random data, verify in list, and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PimPage(page);

    // 1. Log in with valid admin credentials
    await loginPage.open();
    await loginPage.login(
      config.adminCredentials.username,
      config.adminCredentials.password
    );
    await expect(page).toHaveURL(/.*dashboard.*/);

    // 2. Navigate to PIM
    await dashboardPage.clickMenu('PIM');
    await expect(page).toHaveURL(/.*pim.*/);

    // 3. Add a new employee using randomly generated data
    const newEmployee = getRandomEmployee();
    await pimPage.openAddEmployee();
    await pimPage.createEmployee(
      newEmployee.firstName,
      newEmployee.lastName,
      newEmployee.employeeId
    );

    // 4. Navigate to Employee List and search
    await pimPage.openEmployeeList();
    await pimPage.searchByEmployeeId(newEmployee.employeeId);

    // 5. Verify the employee appears in the search results table
    const isPresent = await pimPage.isEmployeeInTable(
      newEmployee.employeeId,
      newEmployee.firstName
    );
    expect(isPresent).toBeTruthy();

    // 6. Log out
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });
});
