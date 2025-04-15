/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodObject as Schema, ZodIssue } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { dro } from './dro';
import { HttpStatusCode } from './exceptions';

export interface IValidateDtoParams { 
  source: 'body' | 'params' | 'query', 
  schema: Schema<Record<string, any>>, 
  returnNormalizedValue?: boolean,
}

export function validateDto ({
  source,
  schema,
  returnNormalizedValue = false,
}: IValidateDtoParams) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(HttpStatusCode.BadRequest).send(dro.error(normalizeZodError(result.error.issues)));
      return;
    }

    if(returnNormalizedValue) {
      req[source] = result.data;
    }

    return next();
  };
}

const normalizeZodError = (error: ZodIssue[]): string => {
  return error.reduce((acc, issue) => {
    const path = issue.path.join('.');
    acc = `${acc}, ${path} ${issue.message}`;

    return acc;
  }, '');
}

export const validateBody = (
  schema: Schema<Record<string, any>>
): (req: Request, res: Response, next: NextFunction) => void => validateDto({
  source: 'body',
  schema,
  returnNormalizedValue: true
});

export const validateParams = (
  schema: Schema<Record<string, any>>
): (req: Request, res: Response, next: NextFunction) => void => validateDto({
  source: 'params',
  schema
});

export const validateQuery = (
  schema: Schema<Record<string, any>>
): (req: Request, res: Response, next: NextFunction) => void => validateDto({
  source: 'query',
  schema
});
