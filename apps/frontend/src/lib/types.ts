export interface Item {
  id: string;
  label: string;
  value: any;
  order: number;
  selected: boolean;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  items: Item[];
  total: number;
  hasMore: boolean;
  page: number;
}

export interface MultiSelectStore {
  items: Item[];
  selectedItems: Set<string>;
  searchQuery: string;
  loading: boolean;
  page: number;
  hasMore: boolean;
  error: Error | null;
}
