import { Page, Locator } from '@playwright/test';

export class MultiSelectPage {
  readonly page: Page;
  readonly container: Locator;
  readonly searchInput: Locator;
  readonly itemsList: Locator;
  readonly selectedCounter: Locator;
  readonly loadingSpinner: Locator;
  readonly noItemsMessage: Locator;
  readonly noMoreItemsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.w-full.max-w-2xl');
    this.searchInput = page.locator('input[type="text"][placeholder="Search items..."]');
    this.itemsList = page.locator('.overflow-y-auto');
    this.selectedCounter = page.locator('text=/\\d+ items? selected/');
    this.loadingSpinner = page.locator('.animate-spin');
    this.noItemsMessage = page.locator('text=No items found');
    this.noMoreItemsMessage = page.locator('text=No more items to load');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
    // Wait for debounced search to complete
    await this.page.waitForTimeout(300);
    // Wait for API response
    await this.page.waitForResponse(response => 
      response.url().includes('/items') && 
      response.request().method() === 'GET'
    );
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForResponse(response => 
      response.url().includes('/items') && 
      response.request().method() === 'GET'
    );
  }

  async getItems() {
    return this.itemsList.locator('> div').all();
  }

  async getItemTexts() {
    const items = await this.getItems();
    return Promise.all(items.map(item => item.textContent()));
  }

  async selectItem(index: number) {
    const items = await this.getItems();
    await items[index].click();
    // Wait for selection to sync with backend
    await this.page.waitForResponse(response => 
      response.url().includes('/items/selection') && 
      response.request().method() === 'POST'
    );
  }

  async dragAndDrop(sourceIndex: number, targetIndex: number) {
    const items = await this.getItems();
    const source = items[sourceIndex];
    const target = items[targetIndex];
    
    // Get source item text for verification
    const sourceText = await source.textContent();
    
    // Perform drag and drop
    await source.dragTo(target);
    
    // Wait for sort update
    await this.page.waitForResponse(response => 
      response.url().includes('/items/sort') && 
      response.request().method() === 'POST'
    );
    
    return sourceText;
  }

  async scrollToBottom() {
    await this.itemsList.evaluate(element => {
      element.scrollTop = element.scrollHeight;
    });
  }

  async getSelectedCount() {
    const counterText = await this.selectedCounter.textContent();
    const match = counterText?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isLoading() {
    return this.loadingSpinner.isVisible();
  }

  async hasNoItems() {
    return this.noItemsMessage.isVisible();
  }

  async hasNoMoreItems() {
    return this.noMoreItemsMessage.isVisible();
  }
}
