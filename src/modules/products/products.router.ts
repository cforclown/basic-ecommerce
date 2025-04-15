import { Router } from 'express';
import { ProductsController } from './products.controller';
import { RequestHandler } from '../../utils';
import { adminMiddleware, authMiddleware } from '../auth';

export const PRODUCTS_API_BASE_PATH = '/products';

export function productsRouter(productsController: ProductsController) {
  const router: Router = Router();

  router.use(authMiddleware());
  
  router.post('/', adminMiddleware(), RequestHandler(productsController.createProduct));
  router.put('/:id', adminMiddleware(), RequestHandler(productsController.updateProduct));
  router.delete('/:id', adminMiddleware(), RequestHandler(productsController.deleteProduct));
  router.get('/', adminMiddleware(), RequestHandler(productsController.listProduct));
  
  // public
  router.get('/search', RequestHandler(productsController.searchProducts));
  router.get('/:id', RequestHandler(productsController.getProductById));

  return router;
}
