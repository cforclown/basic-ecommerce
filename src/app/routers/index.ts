import { Router } from 'express';

export function MainRouter (apiRouter: Router): Router {
  const router = Router();
  router.use('/api', apiRouter);

  return router;
}
