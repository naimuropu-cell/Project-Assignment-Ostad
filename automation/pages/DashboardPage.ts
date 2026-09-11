import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly headerTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.headerTitle = page.locator('.oxd-topbar-header-breadcrumb');
  }

  async isLoaded(): Promise<boolean> {
    await this.userDropdown.waitFor({ state: 'visible', timeout: 15000 });
    return this.userDropdown.isVisible();
  }

  async clickMenu(menuName: string): Promise<void> {
    const item = this.page.locator('.oxd-main-menu-item').filter({ hasText: menuName });
    await item.waitFor({ state: 'visible', timeout: 10000 });
    await item.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutButton.click();
    await this.page.waitForURL('**/auth/login', { timeout: 15000 });
  }
}
