import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { ItemService } from '../services/itemService';
import { ItemRepository } from '../repositories/itemRepository';

export function createItemRouter(): Router {
  const router = Router();
  const repository = new ItemRepository();
  const service = new ItemService(repository);
  const controller = new ItemController(service);

  // Bind the methods to ensure correct 'this' context
  router.get('/items', controller.getItems.bind(controller));
  router.post('/items/selection', controller.updateSelection.bind(controller));
  router.post('/items/sort', controller.updateSort.bind(controller));

  return router;
}
