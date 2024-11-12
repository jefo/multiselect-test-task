import { test, expect } from '@playwright/test';
import { MultiSelectPage } from './multi-select.page';

test.describe('MultiSelect Component', () => {
  let page: MultiSelectPage;

  test.beforeEach(async ({ page: p }) => {
    page = new MultiSelectPage(p);
    await page.goto();
  });

  test('should load initial items and display them', async () => {
    // Wait for initial items to load
    await expect(page.container).toBeVisible();
    
    // Should show loading state initially
    await expect(page.loadingSpinner).toBeVisible();
    
    // Should load items
    const items = await page.getItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(20); // Default page size
  });

  test('should filter items by search query', async () => {
    // Search for specific term
    await page.searchFor('test');
    
    // Should show loading state while searching
    await expect(page.loadingSpinner).toBeVisible();
    
    // Get filtered items
    const items = await page.getItemTexts();
    
    // All items should contain search term (case insensitive)
    items.forEach(text => {
      expect(text?.toLowerCase()).toContain('test');
    });
    
    // Clear search
    await page.clearSearch();
    
    // Should reset to initial state
    const resetItems = await page.getItems();
    expect(resetItems.length).toBeGreaterThan(0);
  });

  test('should maintain search query during pagination', async () => {
    // Search for specific term
    await page.searchFor('item');
    
    // Get initial filtered items
    const initialItems = await page.getItemTexts();
    const initialCount = initialItems.length;
    
    // Scroll to load more items
    await page.scrollToBottom();
    
    // Wait for loading state
    await expect(page.loadingSpinner).toBeVisible();
    
    // Get new items
    const newItems = await page.getItemTexts();
    
    // Should have more items than initial load
    expect(newItems.length).toBeGreaterThan(initialCount);
    
    // All new items should still match search query
    newItems.forEach(text => {
      expect(text?.toLowerCase()).toContain('item');
    });
  });

  test('should handle item selection and update counter', async () => {
    // Select first item
    await page.selectItem(0);
    
    // Counter should show 1 selected
    expect(await page.getSelectedCount()).toBe(1);
    
    // Select second item
    await page.selectItem(1);
    
    // Counter should show 2 selected
    expect(await page.getSelectedCount()).toBe(2);
    
    // Deselect first item
    await page.selectItem(0);
    
    // Counter should show 1 selected
    expect(await page.getSelectedCount()).toBe(1);
  });

  test('should load more items on scroll', async () => {
    // Get initial items count
    const initialItems = await page.getItems();
    const initialCount = initialItems.length;
    
    // Scroll to bottom
    await page.scrollToBottom();
    
    // Wait for loading state
    await expect(page.loadingSpinner).toBeVisible();
    
    // Should load more items
    const newItems = await page.getItems();
    expect(newItems.length).toBeGreaterThan(initialCount);
  });

  test('should handle drag and drop reordering', async () => {
    // Get initial items
    const items = await page.getItems();
    expect(items.length).toBeGreaterThan(2);
    
    // Get text of first item for verification
    const sourceText = await page.dragAndDrop(0, 2);
    
    // Get new items order
    const newItems = await page.getItemTexts();
    
    // Verify item was moved to new position
    expect(newItems[2]).toBe(sourceText);
  });

  test('should handle empty search results', async () => {
    // Search for non-existent term
    await page.searchFor('xyznonexistent123');
    
    // Should show no items message
    await expect(page.noItemsMessage).toBeVisible();
  });

  test('should handle end of list', async () => {
    // Scroll until no more items
    while (!(await page.hasNoMoreItems())) {
      await page.scrollToBottom();
      // Wait for potential loading
      await page.page.waitForTimeout(500);
    }
    
    // Should show no more items message
    await expect(page.noMoreItemsMessage).toBeVisible();
  });

  test('should maintain selection state after search', async () => {
    // Select first item
    await page.selectItem(0);
    const initialCount = await page.getSelectedCount();
    
    // Perform search
    await page.searchFor('test');
    
    // Selection count should remain the same
    expect(await page.getSelectedCount()).toBe(initialCount);
    
    // Clear search
    await page.clearSearch();
    
    // Selection count should still remain the same
    expect(await page.getSelectedCount()).toBe(initialCount);
  });

  test('should handle mobile viewport', async ({ page: p }) => {
    // Set mobile viewport
    await p.setViewportSize({ width: 375, height: 812 });
    
    // Component should be responsive
    await expect(page.container).toBeVisible();
    
    // All functionality should work
    await page.searchFor('test');
    await page.selectItem(0);
    await page.dragAndDrop(0, 1);
    
    // Verify selection worked
    expect(await page.getSelectedCount()).toBe(1);
  });
});
