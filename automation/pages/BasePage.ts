import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  async waitForSuccessToast(): Promise<string> {
    const toast = this.page.locator('.oxd-text--toast-message');
    await toast.waitFor({ state: 'visible', timeout: 10000 });
    return (await toast.textContent()) || '';
  }
}
