import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LeavePage extends BasePage {
  readonly applyTab: Locator;
  readonly myLeaveTab: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly applyButton: Locator;
  readonly myLeaveRows: Locator;

  constructor(page: Page) {
    super(page);
    this.applyTab = page.getByRole('link', { name: 'Apply' });
    this.myLeaveTab = page.getByRole('link', { name: 'My Leave' });
    this.leaveTypeDropdown = page.locator('.oxd-input-group:has-text("Leave Type") .oxd-select-text');
    this.fromDateInput = page.locator('.oxd-input-group:has-text("From Date") input');
    this.toDateInput = page.locator('.oxd-input-group:has-text("To Date") input');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.myLeaveRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  async openApplyTab(): Promise<void> {
    await this.applyTab.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async applyLeave(fromDate: string, toDate: string): Promise<void> {
    // Select the first available leave type
    await this.leaveTypeDropdown.click();
    const firstOption = this.page.locator('.oxd-select-option').nth(1);
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    await firstOption.click();

    // Fill dates
    await this.fromDateInput.click();
    await this.fromDateInput.press('ControlOrMeta+a');
    await this.fromDateInput.press('Backspace');
    await this.fromDateInput.fill(fromDate);

    // Some configurations require filling To Date
    if (await this.toDateInput.isVisible()) {
      await this.toDateInput.click();
      await this.toDateInput.press('ControlOrMeta+a');
      await this.toDateInput.press('Backspace');
      await this.toDateInput.fill(toDate);
    }

    // Close any open datepicker popup by clicking outside
    await this.page.locator('h6:has-text("Apply Leave")').click();

    // Click Apply
    await this.applyButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async openMyLeaveTab(): Promise<void> {
    await this.myLeaveTab.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async getLatestLeaveStatus(): Promise<string> {
    const firstRow = this.myLeaveRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    const text = await firstRow.innerText();
    return text;
  }

  async cancelLatestLeave(): Promise<void> {
    const firstRow = this.myLeaveRows.first();
    const cancelButton = firstRow.getByRole('button', { name: 'Cancel' });
    await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await cancelButton.click();
    await this.page.waitForTimeout(2000);
  }
}
