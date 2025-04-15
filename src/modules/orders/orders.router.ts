import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { adminMiddleware, authMiddleware } from '../auth';
import { RequestHandler } from '../../utils';

export const ORDERS_API_BASE_PATH = '/orders';

export function ordersRouter(ordersController: OrdersController): Router {
  const router: Router = Router();

  router.use(authMiddleware());
  
  // Admin
  router.get('/index', adminMiddleware(), RequestHandler(ordersController.listAllOrders));
  router.get('/users/:id', adminMiddleware(), RequestHandler(ordersController.listUserOrders));
  router.put('/:id/status', adminMiddleware(), RequestHandler(ordersController.changeStatus));

  // User
  router.post('/', RequestHandler(ordersController.createOrder));
  router.get('/', RequestHandler(ordersController.listOrders));
  router.put('/:id/cancel', RequestHandler(ordersController.cancelOrder));
  router.get('/:id', RequestHandler(ordersController.getOrderById));
  
  return router;
}
