import type { Request, Response, NextFunction } from "express";
import { ItemService } from "../services/itemService";
import { logger } from "../utils/logger";

export class ItemController {
  constructor(private service: ItemService) {}

  public getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search } = req.query;

      logger.info("Getting items", { page, limit, search });
      const result = await this.service.getItems(
        page as string,
        limit as string,
        search as string
      );

      res.json(result);
    } catch (error) {
      logger.error("Error getting items", { error });
      next(error);
    }
  };

  public updateSelection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { selectedIds } = req.body;

      logger.info("Updating selection", { selectedIds });
      const selectedItems = await this.service.updateSelection(selectedIds);

      res.json({
        success: true,
        selectedItems,
      });
    } catch (error) {
      logger.error("Error updating selection", { error });
      next(error);
    }
  };

  public updateSort = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { itemIds } = req.body;

      logger.info("Updating sort order", { itemIds });
      const sortedItems = await this.service.updateSort(itemIds);

      res.json({
        success: true,
        sortedItems,
      });
    } catch (error) {
      logger.error("Error updating sort order", { error });
      next(error);
    }
  };
}
