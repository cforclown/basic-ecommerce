import { asClass, asFunction, asValue, createContainer, InjectionMode } from 'awilix';
import App from './app';
import { MainRouter } from './app/routers';
import { ApiRouter } from './app/routers/api';
import { prismaClient } from './lib/prisma-client';
import { productsRouter, ProductsController } from './modules/products';
import { PrismaClient } from '@prisma/client';
import { AuthController, authRouter } from './modules/auth';
import { UsersController, usersRouter } from './modules/users';
import { CartController, cartRouter } from './modules/cart';
import { OrdersController, ordersRouter } from './modules/orders';

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

export function setupDIContainer (): void {
  container.register({
    app: asFunction(App),
    db: asValue<PrismaClient>(prismaClient as unknown as PrismaClient),

    mainRouter: asFunction(MainRouter),
    apiRouter: asFunction(ApiRouter),
    
    authRouter: asFunction(authRouter),
    authController: asClass(AuthController),

    usersRouter: asFunction(usersRouter),
    usersController: asClass(UsersController),
    
    productsRouter: asFunction(productsRouter),
    productsController: asClass(ProductsController),

    cartRouter: asFunction(cartRouter),
    cartController: asClass(CartController),

    ordersRouter: asFunction(ordersRouter),
    ordersController: asClass(OrdersController),
  });
}
