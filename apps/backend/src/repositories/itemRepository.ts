import type { Item, SearchResult } from '../models/item';

export class ItemRepository {
  private items: Map<string, Item> = new Map();
  private orderMap: Map<string, number> = new Map();
  private selectedIds: Set<string> = new Set();
  private labelIndex: Map<string, Set<string>> = new Map(); // For optimized search

  constructor() {
    // Initialize with sample data
    const sampleItems: Item[] = Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i + 1}`,
      label: `Item ${i + 1}`,
      value: i + 1,
      order: i,
      selected: false,
    }));

    sampleItems.forEach(item => {
      this.addItem(item);
    });
  }

  private addItem(item: Item): void {
    this.items.set(item.id, item);
    this.orderMap.set(item.id, item.order);
    
    // Index the item's label words for faster search
    const words = item.label.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (!this.labelIndex.has(word)) {
        this.labelIndex.set(word, new Set());
      }
      this.labelIndex.get(word)?.add(item.id);
    });
  }

  private searchItems(query: string): Set<string> {
    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);
    
    // Find items that match all words in the query
    const matchingSets = words.map(word => {
      const matches = new Set<string>();
      for (const [indexWord, itemIds] of this.labelIndex.entries()) {
        if (indexWord.includes(word)) {
          itemIds.forEach(id => matches.add(id));
        }
      }
      return matches;
    });

    // Return intersection of all matching sets
    return matchingSets.reduce((acc, curr) => {
      const intersection = new Set<string>();
      for (const id of acc) {
        if (curr.has(id)) {
          intersection.add(id);
        }
      }
      return intersection;
    });
  }

  public async getItems(page: number = 1, limit: number = 20, search?: string): Promise<SearchResult> {
    let matchingIds: Set<string>;
    
    if (search) {
      matchingIds = this.searchItems(search);
    } else {
      matchingIds = new Set(this.items.keys());
    }

    // Convert to array and sort by order
    const filteredItems = Array.from(matchingIds)
      .map(id => this.items.get(id)!)
      .sort((a, b) => (this.orderMap.get(a.id) ?? 0) - (this.orderMap.get(b.id) ?? 0));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      hasMore: endIndex < filteredItems.length,
      page
    };
  }

  public async updateSelection(ids: string[]): Promise<Item[]> {
    // Validate all ids exist
    for (const id of ids) {
      if (!this.items.has(id)) {
        throw new Error(`Item with id ${id} not found`);
      }
    }

    // Reset all selections
    for (const item of this.items.values()) {
      item.selected = false;
    }

    // Update selected items
    this.selectedIds = new Set(ids);
    ids.forEach(id => {
      const item = this.items.get(id);
      if (item) {
        item.selected = true;
      }
    });

    return Array.from(this.items.values()).filter(item => item.selected);
  }

  public async updateSort(ids: string[]): Promise<Item[]> {
    // Validate all ids exist
    for (const id of ids) {
      if (!this.items.has(id)) {
        throw new Error(`Item with id ${id} not found`);
      }
    }

    // Update order map
    ids.forEach((id, index) => {
      this.orderMap.set(id, index);
      const item = this.items.get(id);
      if (item) {
        item.order = index;
      }
    });

    // Return sorted items
    return ids.map(id => this.items.get(id)!);
  }

  public validateIds(ids: string[]): boolean {
    return ids.every(id => this.items.has(id));
  }
}
