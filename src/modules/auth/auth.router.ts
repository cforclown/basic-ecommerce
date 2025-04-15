import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from './auth.middleware';
import { RequestHandler, validateBody } from '../../utils';
import { signinSchema, signupSchema } from './auth.dto';

export const AUTH_API_BASE_PATH = '/auth';

export function authRouter(authController: AuthController) {
  const router: Router = Router();
  
  router.post('/signin', validateBody(signinSchema), RequestHandler(authController.signin));
  router.post('/signup', validateBody(signupSchema), RequestHandler(authController.signup));
  router.get('/me', authMiddleware(), RequestHandler(authController.me));

  return router;
}
