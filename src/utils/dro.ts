/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-extraneous-class */

export interface ResponseObj<T> {
  data: T,
  error?: string | object | [] | null | undefined;
}

/**
 * DATA RESPONSE OBJECT
 */
export class dro {
  static response<T> (data: T): ResponseObj<T> {
    return ({ data });
  }

  static error (error: any): ResponseObj<undefined> {
    return { data: undefined, error };
  }
}
