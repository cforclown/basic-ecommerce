import { Router } from 'express';
import { UsersController } from './users.controller';
import { adminMiddleware, authMiddleware } from '../auth';
import { RequestHandler, validateBody } from '../../utils';
import { addAdressSchema, updateUserSchema } from './users.dto';

export const USERS_API_BASE_PATH = '/users';

export function usersRouter(usersController: UsersController): Router {
  const router = Router();

  router.use(authMiddleware());
  
  router.put('/', validateBody(updateUserSchema), RequestHandler(usersController.updateUser));

  router.get('/address', RequestHandler(usersController.getAddresses));
  router.post('/address', validateBody(addAdressSchema), RequestHandler(usersController.addAddress));
  router.delete('/address/:id', RequestHandler(usersController.deleteAddress));
  
  // Admin
  router.get('/', adminMiddleware(), RequestHandler(usersController.getAllUsers));
  router.get('/:id', adminMiddleware(), RequestHandler(usersController.getUserById));

  return router;
}
