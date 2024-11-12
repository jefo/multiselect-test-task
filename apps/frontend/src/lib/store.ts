import { writable, derived, get } from 'svelte/store';
import type { Item, MultiSelectStore } from './types';
import * as api from './api';

function createMultiSelectStore() {
  const initialState: MultiSelectStore = {
    items: [],
    selectedItems: new Set(),
    searchQuery: '',
    loading: false,
    page: 1,
    hasMore: true,
    error: null
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    // Load initial items
    async loadItems(page: number = 1, search?: string) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Use current searchQuery from state if no search parameter provided
        const searchQuery = search !== undefined ? search : get(this).searchQuery;
        const result = await api.getItems(page, 20, searchQuery);
        update(state => ({
          ...state,
          items: page === 1 ? result.items : [...state.items, ...result.items],
          page: result.page,
          hasMore: result.hasMore,
          loading: false
        }));
      } catch (error) {
        update(state => ({ ...state, error: error as Error, loading: false }));
      }
    },

    // Update search query
    async search(query: string) {
      update(state => ({ ...state, searchQuery: query }));
      await this.loadItems(1, query);
    },

    // Toggle item selection
    async toggleSelection(itemId: string) {
      update(state => {
        const newSelectedItems = new Set(state.selectedItems);
        if (newSelectedItems.has(itemId)) {
          newSelectedItems.delete(itemId);
        } else {
          newSelectedItems.add(itemId);
        }
        return { ...state, selectedItems: newSelectedItems };
      });

      // Sync with backend
      try {
        const state = get(this);
        const { selectedItems: selectedIds } = await api.updateSelection(Array.from(state.selectedItems));
        update(state => ({
          ...state,
          items: state.items.map(item => ({
            ...item,
            selected: selectedIds.some(selected => selected.id === item.id)
          }))
        }));
      } catch (error) {
        update(state => ({ ...state, error: error as Error }));
      }
    },

    // Update sort order
    async updateSort(items: Item[]) {
      const itemIds = items.map(item => item.id);
      
      try {
        const { sortedItems } = await api.updateSort(itemIds);
        update(state => ({ ...state, items: sortedItems }));
      } catch (error) {
        update(state => ({ ...state, error: error as Error }));
      }
    },

    // Reset store
    reset() {
      set(initialState);
    }
  };
}

export const multiSelectStore = createMultiSelectStore();
