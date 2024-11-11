import { z } from 'zod';

export interface Item {
  id: string;
  label: string;
  value: any;
  order: number;
  selected: boolean;
  metadata?: Record<string, any>;
}

export const ItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.any(),
  order: z.number(),
  selected: z.boolean(),
  metadata: z.record(z.any()).optional()
});

export const SearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(100).regex(/^[a-zA-Z0-9\s-_]*$/).optional()
});

export const UpdateSelectionSchema = z.object({
  selectedIds: z.array(z.string())
});

export const UpdateSortSchema = z.object({
  itemIds: z.array(z.string())
});

export interface SearchResult {
  items: Item[];
  total: number;
  hasMore: boolean;
  page: number;
}
