import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { PRODUCTS_API_BASE_PATH } from '../../../modules/products/products.router';
import swaggerConfig from './docs/configs';
import { AUTH_API_BASE_PATH } from '../../../modules/auth';
import { USERS_API_BASE_PATH } from '../../../modules/users/users.router';
import { CART_API_BASE_PATH } from '../../../modules/cart';
import { ORDERS_API_BASE_PATH } from '../../../modules/orders';

export function ApiRouter (
  authRouter: Router, 
  usersRouter: Router,
  productsRouter: Router,
  cartRouter: Router,
  ordersRouter: Router
): Router {
  const router = Router();

  // #region ============================ SWAGGER CONFIG =============================
  // reference: https://swagger.io/specification/#infoObject
  const swaggerDocs = swaggerJSDoc(swaggerConfig);
  router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  // #endregion -----------------------------------------------------------------------

  router.use(AUTH_API_BASE_PATH, authRouter);
  router.use(USERS_API_BASE_PATH, usersRouter);
  router.use(PRODUCTS_API_BASE_PATH, productsRouter);
  router.use(CART_API_BASE_PATH, cartRouter);
  router.use(ORDERS_API_BASE_PATH, ordersRouter);

  return router;
}
