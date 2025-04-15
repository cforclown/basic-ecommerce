/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from 'jsonwebtoken';
import { dro, Environment } from '../../utils';
import { HttpStatusCode } from '../../utils/exceptions';

export interface IExcludePath {
  path: string;
  method?: string;
}

export function authMiddlewareRouter (excludePaths: IExcludePath[]) {
  return (req: Request & { user: any }, res: Response, next: NextFunction): any => {
    try {
      for (const excludePath of excludePaths) {
        if (
          req.originalUrl.includes(excludePath.path) &&
          (!excludePath.method || (excludePath.method === req.method))
        ) {
          return next();
        }
      }
      if (!req.headers.authorization) {
        return res.status(HttpStatusCode.Unauthorized).send(dro.error('Unauthorized'));
      }

      const [, token] = req.headers.authorization.split(' ');
      const user = verify(token, Environment.getAccessTokenSecret());
      if (!user) {
        return res.status(HttpStatusCode.Unauthorized).send(dro.error('Invalid access token'));
      }

      req.user = user;

      return next();
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        console.error(err.message);
        return res.status(HttpStatusCode.Unauthorized).send(dro.error(err.message));
      }
      if (err instanceof Error) {
        console.error(err.message);
        return res.status(HttpStatusCode.InternalServerError).send(dro.error(err.message));
      }
    }
  };
}

export function authMiddleware (): any {
  return (req: Request & { user: any }, res: Response, next: NextFunction): any => {
    try {
      if (!req.headers.authorization) {
        return res.status(HttpStatusCode.Unauthorized).send(dro.error('Unauthorized'));
      }

      const [, token] = req.headers.authorization.split(' ');
      const user = verify(token, Environment.getAccessTokenSecret());
      if (!user) {
        return res.status(HttpStatusCode.Unauthorized).send(dro.error('Invalid access token'));
      }

      req.user = user;

      return next();
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        console.error(err.message);
        return res.status(HttpStatusCode.Unauthorized).send(dro.error(err.message));
      }
      if (err instanceof Error) {
        console.error(err.message);
        return res.status(HttpStatusCode.InternalServerError).send(dro.error(err.message));
      }
    }
  };
}

export function adminMiddleware (): any {
  return (req: Request & { user: any }, res: Response, next: NextFunction): any => {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(HttpStatusCode.Unauthorized).send(dro.error('Unauthorized'));
      }

      return next();
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        console.error(err.message);
        return res.status(HttpStatusCode.Unauthorized).send(dro.error(err.message));
      }
      if (err instanceof Error) {
        console.error(err.message);
        return res.status(HttpStatusCode.InternalServerError).send(dro.error(`[AUTH-ADMIN]', ${err.message}`));
      }
    }
  };
}
