import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { HttpStatusCode } from '../../utils/exceptions';
import { adminMiddleware, authMiddleware } from './auth.middleware';
import { mockAdmin, mockUser } from '../../test/mock-data/users';

const mockJwtSign = jest.fn();
const mockJwtVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn().mockImplementation((): string => mockJwtSign()),
  verify: jest.fn().mockImplementation((): string => mockJwtVerify())
}));

describe('Auth middleware', () => {
  describe('authentication middleware', () => {
    mockJwtVerify.mockReturnValue({ ...mockUser });

    // afterEach(() => {
    //   jest.clearAllMocks();
    // });

    it('should not pass when there is no token in header', () => {
      const mockReq = mockRequest({
        headers: {}
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      authMiddleware()(mockReq, mockRes, next);
      expect(mockJwtVerify).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
      expect(mockRes.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should not pass when token is not valid', () => {
      mockJwtVerify.mockReturnValueOnce(null);

      const mockReq = mockRequest({
        headers: {
          authorization: 'Bearer invalidtoken'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      authMiddleware()(mockReq, mockRes, next);
      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
      expect(mockRes.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass validation with valid payload', () => {
      const mockReq = mockRequest({
        headers: {
          authorization: 'Bearer mock-valid-token'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      authMiddleware()(mockReq, mockRes, next);
      expect(mockJwtVerify).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authenticate admin', () => {
    it('should not pass when user role is not ADMIN', () => {
      const mockReq = mockRequest({
        user: { ...mockUser }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      adminMiddleware()(mockReq, mockRes, next);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
      expect(mockRes.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should not pass when user role is not ADMIN', () => {
      const mockReq = mockRequest({
        user: { ...mockAdmin }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      adminMiddleware()(mockReq, mockRes, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
