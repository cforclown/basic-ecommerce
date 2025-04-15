import { Router } from 'express';
import { CartController } from './cart.controller';
import { RequestHandler } from '../../utils';
import { authMiddleware } from '../auth';

export const CART_API_BASE_PATH = '/cart';

export function cartRouter(cartController: CartController): Router {
  const router: Router = Router();

  router.use(authMiddleware());

  router.post('/', RequestHandler(cartController.addItemToCart));
  router.get('/', RequestHandler(cartController.getCart));
  router.delete('/:id', RequestHandler(cartController.deleteItemFromCart));
  router.put('/:id', RequestHandler(cartController.changeQuantity));

  return router;
}
