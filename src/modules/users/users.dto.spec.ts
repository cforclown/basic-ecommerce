import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { validateBody } from '../../utils';
import { addAdressSchema, updateUserSchema } from './users.dto';
import { HttpStatusCode } from '../../utils/exceptions';


describe('Users DTOs', () => {
  describe('addAdressSchema', () => {
    it('should not pass validation with invalid payload', () => {
      const mockReq = mockRequest({
        body: {
          addresses: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        },
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(addAdressSchema)(mockReq, mockRes, next);
      expect(next).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should pass validation with valid payload', () => {
      const mockReq = mockRequest({
        body: {
          address: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(addAdressSchema)(mockReq, mockRes, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('updateUserSchema', () => {
    it('should pass validation with valid payload', () => {
      const mockReq = mockRequest({
        body: {
          defaultShippingAddress: 'mockAddressId',
          defaultBillingAddress: 'mockBillingAddressId',
        }
      });
      const mockRes = mockResponse();
      const next = jest.fn();
      validateBody(updateUserSchema)(mockReq, mockRes, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
