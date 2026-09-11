import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly usernameSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableRows: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameSearchInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async searchUser(username: string): Promise<void> {
    await this.usernameSearchInput.click();
    await this.usernameSearchInput.press('ControlOrMeta+a');
    await this.usernameSearchInput.press('Backspace');
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
    // Wait for search results
    await this.page.waitForTimeout(2000);
  }

  async getMatchingRowsCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getFirstRowDetails(): Promise<{ username: string; userRole: string; status: string }> {
    const firstRow = this.tableRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    
    // In OrangeHRM table, cell 2 is Username, cell 3 is User Role, cell 5 is Status
    const cells = firstRow.locator('.oxd-table-cell');
    const username = (await cells.nth(1).innerText()).trim();
    const userRole = (await cells.nth(2).innerText()).trim();
    const status = (await cells.nth(4).innerText()).trim();

    return { username, userRole, status };
  }

  async clickEditFirstUser(): Promise<void> {
    const editBtn = this.tableRows.first().locator('i.bi-pencil-fill');
    await editBtn.waitFor({ state: 'visible', timeout: 10000 });
    await editBtn.click();
    await this.page.waitForURL('**/admin/saveSystemUser/**', { timeout: 15000 });
  }

  async updateStatus(newStatus: 'Enabled' | 'Disabled'): Promise<void> {
    const statusDropdown = this.page.locator('.oxd-input-group:has-text("Status") .oxd-select-text');
    await statusDropdown.click();
    const option = this.page.locator('.oxd-select-option').filter({ hasText: newStatus });
    await option.click();
  }

  async updateRole(newRole: 'Admin' | 'ESS'): Promise<void> {
    const roleDropdown = this.page.locator('.oxd-input-group:has-text("User Role") .oxd-select-text');
    await roleDropdown.click();
    const option = this.page.locator('.oxd-select-option').filter({ hasText: newRole });
    await option.click();
  }

  async saveEdit(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForURL('**/admin/viewSystemUsers', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async refreshAndVerifyUser(username: string): Promise<{ username: string; userRole: string; status: string }> {
    await this.page.reload();
    await this.searchUser(username);
    return await this.getFirstRowDetails();
  }
}
