import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  readonly addEmployeeNav: Locator;
  readonly employeeListNav: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly searchEmployeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeNav = page.getByRole('link', { name: 'Add Employee' });
    this.employeeListNav = page.getByRole('link', { name: 'Employee List' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.searchEmployeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  async openAddEmployee(): Promise<void> {
    await this.addEmployeeNav.click();
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async createEmployee(firstName: string, lastName: string, employeeId: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    // Clear auto-generated id and type our random id
    await this.employeeIdInput.click();
    await this.employeeIdInput.press('ControlOrMeta+a');
    await this.employeeIdInput.press('Backspace');
    await this.employeeIdInput.fill(employeeId);

    await this.saveButton.click();
    
    // Wait for OrangeHRM to finish saving and redirect to Personal Details
    await this.page.waitForURL('**/pim/viewPersonalDetails/**', { timeout: 20000 });
    await this.page.waitForTimeout(1500);
  }

  async openEmployeeList(): Promise<void> {
    await this.employeeListNav.click();
    await this.searchEmployeeIdInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.searchEmployeeIdInput.click();
    await this.searchEmployeeIdInput.press('ControlOrMeta+a');
    await this.searchEmployeeIdInput.press('Backspace');
    await this.searchEmployeeIdInput.fill(employeeId);
    await this.searchButton.click();
    // Wait for search result table to update
    await this.page.waitForTimeout(2000);
  }

  async isEmployeeInTable(employeeId: string, firstName: string): Promise<boolean> {
    const rows = await this.tableRows.allInnerTexts();
    return rows.some(rowText => rowText.includes(employeeId) && rowText.includes(firstName));
  }
}
