import type { Item, SearchResult } from "../models/item";
import { ItemRepository } from "../repositories/itemRepository";
import { ZodError } from "zod";
import {
  SearchParamsSchema,
  UpdateSelectionSchema,
  UpdateSortSchema,
} from "../models/item";

export class ItemService {
  constructor(private repository: ItemRepository) {}

  public async getItems(
    page?: string | number,
    limit?: string | number,
    search?: string
  ): Promise<SearchResult> {
    try {
      const params = SearchParamsSchema.parse({
        page: page || 1,
        limit: limit || 20,
        search: search,
      });

      return await this.repository.getItems(
        params.page,
        params.limit,
        params.search
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Invalid search parameters: ${error.message}`);
      }
      throw error;
    }
  }

  public async updateSelection(selectedIds: string[]): Promise<Item[]> {
    try {
      const { selectedIds: validatedIds } = UpdateSelectionSchema.parse({
        selectedIds,
      });

      // Validate that all IDs exist
      if (!this.repository.validateIds(validatedIds)) {
        throw new Error("One or more selected items do not exist");
      }

      return await this.repository.updateSelection(validatedIds);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Invalid selection parameters: ${error.message}`);
      }
      throw error;
    }
  }

  public async updateSort(itemIds: string[]): Promise<Item[]> {
    try {
      const { itemIds: validatedIds } = UpdateSortSchema.parse({ itemIds });

      // Check for duplicates
      const uniqueIds = new Set(validatedIds);
      if (uniqueIds.size !== validatedIds.length) {
        throw new Error("Sort order contains duplicate items");
      }

      // Validate that all IDs exist
      if (!this.repository.validateIds(validatedIds)) {
        throw new Error("One or more items in sort order do not exist");
      }

      return await this.repository.updateSort(validatedIds);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Invalid sort parameters: ${error.message}`);
      }
      throw error;
    }
  }
}
