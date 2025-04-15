/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { dro } from './dro';
import { HttpStatusCode, RestApiException } from './exceptions';

export function RequestHandler (event: (req: Request, res: Response, next: NextFunction) => Promise<any>): any {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await event(req, res, next);
      res.send(dro.response(data));
    } catch (err) {
      console.error(err);

      if (err instanceof RestApiException) {
        return res.status(err.status).send(dro.error(err.message));
      }

      if (err instanceof Error) {
        return res.status(HttpStatusCode.InternalServerError).send(dro.error(err.message));
      } else {
        return res.status(HttpStatusCode.InternalServerError).send(dro.error('Unknown error'));
      }
    }
  };
}
