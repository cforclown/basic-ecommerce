/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from './request-handler';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { HttpStatusCode, RestApiErrorCode, RestApiException } from './exceptions';

describe('request-handler', () => {
  const data = {
    message: 'message'
  };
  const event = jest.fn().mockImplementation(async (): Promise<Record<string, any>> => data);
  const req = mockRequest({});
  const res = mockResponse({});
  const next = (): any => ({});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send data successfully', async () => {
    const result = RequestHandler(event);
    expect(typeof result).toBe('function');
    await result(req, res, next);
    expect(res.send).toHaveBeenCalled();
  });

  it('should should send error response with given http code', async () => {
    event.mockRejectedValueOnce(new RestApiException('not found', RestApiErrorCode.USER_NOT_FOUND, HttpStatusCode.NotFound));
    const result = RequestHandler(event);
    expect(typeof result).toBe('function');
    await result(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(res.status.mock.calls[0][0]).toEqual(HttpStatusCode.NotFound);
    expect(res.send).toHaveBeenCalled();
    expect(res.send.mock.calls[0][0]).toEqual({
      error: 'not found'
    });
  });

  it('should should send error response with http code internal server error', async () => {
    event.mockRejectedValueOnce(new Error('Unexpected error occured'));
    const result = RequestHandler(event);
    expect(typeof result).toBe('function');
    await result(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(res.status.mock.calls[0][0]).toEqual(HttpStatusCode.InternalServerError);
    expect(res.send).toHaveBeenCalled();
    expect(res.send.mock.calls[0][0]).toEqual({
      error: 'Unexpected error occured'
    });
  });
});
