import axios from 'axios';
import type { Item, SearchResult } from './types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export const getItems = async (
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<SearchResult> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) params.append('search', search);

  const { data } = await api.get<SearchResult>('/items', { params });
  return data;
};

export const updateSelection = async (selectedIds: string[]): Promise<{ success: boolean; selectedItems: Item[] }> => {
  const { data } = await api.post('/items/selection', { selectedIds });
  return data;
};

export const updateSort = async (itemIds: string[]): Promise<{ success: boolean; sortedItems: Item[] }> => {
  const { data } = await api.post('/items/sort', { itemIds });
  return data;
};
