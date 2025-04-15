import { Address } from '@prisma/client';

export const mockAddress: Omit<Address, 'id' | 'userId'> = {
  address: 'Mock address 1',
  city: 'Mock address city',
  state: 'Mock address country',
  zipCode: 'Mock address zipcode',
  pinPoint: 'Mock address pin point',
  createdAt: new Date(),
  updatedAt: new Date(),
}
