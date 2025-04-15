import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { validateBody } from '../../utils';
import { signinSchema, signupSchema } from './auth.dto';
import { HttpStatusCode } from '../../utils/exceptions';


describe('Auth DTOs', () => {
  describe('Sign-in', () => {
    it('should not pass validation with invalid payload', () => {
      const mockReq = mockRequest({
        body: {
          invalidField: 'test',
          password: 'test123'
        },
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(signinSchema)(mockReq, mockRes, next);
      expect(next).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should not pass validation with invalid email format', () => {
      const mockReq = mockRequest({
        body: {
          email: 'test',
          password: 'test123'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(signinSchema)(mockReq, mockRes, next);
      expect(next).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should pass validation with valid payload', () => {
      const mockReq = mockRequest({
        body: {
          email: 'test@email.com',
          password: 'test123'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(signinSchema)(mockReq, mockRes, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Sign-up', () => {
    it('should not pass validation with invalid payload', () => {
      const mockReq = mockRequest({
        body: {
          name: 'test',
          invalidField: 'test',
          password: 'test123'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(signupSchema)(mockReq, mockRes, next);
      expect(next).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should not pass validation with invalid email format', () => {
      const mockReq = mockRequest({
        body: {
          name: 'test',
          email: 'test',
          password: 'test123'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(signupSchema)(mockReq, mockRes, next);
      expect(next).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should pass validation with valid payload', () => {
      const mockReq = mockRequest({
        body: {
          name: 'test',
          email: 'test@email.com',
          password: 'test123'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(signupSchema)(mockReq, mockRes, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
