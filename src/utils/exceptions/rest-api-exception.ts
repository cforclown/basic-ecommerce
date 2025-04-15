export enum RestApiErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  ADDRESS_NOT_FOUND = 1004,
  ADDRESS_DOES_NOT_BELONG = 1005,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  UNAUTHORIZED = 4001,
  PRODUCT_NOT_FOUND = 5001,
  ORDER_NOT_FOUND = 6001,
}


export interface IRestApiException {
  code: RestApiErrorCode;
  status: HttpStatusCode;
}

export class RestApiException extends Error implements IRestApiException {
  code : number;
  status: HttpStatusCode;

  constructor (
    message: string, 
    code: RestApiErrorCode,
    httpCode = HttpStatusCode.BadRequest, ) {
    super(message);
    this.code = code;
    this.status = httpCode;
  }
}

export class BadRequestException extends RestApiException {
  constructor (
    message: string,
    code: RestApiErrorCode,
  ) {
    super(message, code, HttpStatusCode.BadRequest);
  }
}
export class NotFoundException extends RestApiException {
  constructor (
    message: string,
    code: RestApiErrorCode,
  ) {
    super(message, code, HttpStatusCode.NotFound);
  }
}
export class UnauthorizedException extends RestApiException {
  constructor (
    message: string,
    code: RestApiErrorCode,
  ) {
    super(message, code, HttpStatusCode.Unauthorized);
  }
}
export class InternalException extends RestApiException {
  constructor (
    message: string,
    code: RestApiErrorCode,
  ) {
    super(message, code, HttpStatusCode.InternalServerError);
  }
}

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}
