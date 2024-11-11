import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { ItemService } from '../services/itemService';
import { ItemRepository } from '../repositories/itemRepository';

export function createItemRouter(): Router {
  const router = Router();
  const repository = new ItemRepository();
  const service = new ItemService(repository);
  const controller = new ItemController(service);

  router.get('/items', controller.getItems);
  router.post('/items/selection', controller.updateSelection);
  router.post('/items/sort', controller.updateSort);

  return router;
}
