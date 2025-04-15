import { User } from '@prisma/client';

export const mockAdmin: Omit<User, 'id'> = {
  name: 'Mock admin 1',
  email: 'mockadmin1@email.com',
  password: 'admin1password',
  role: 'ADMIN',
  defaultShippingAddressId: null,
  defaultBillingAddressId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockUser: Omit<User, 'id'> = {
  name: 'Mock user 1',
  email: 'mockuser1@email.com',
  password: 'user1password',
  role: 'USER',
  defaultShippingAddressId: null,
  defaultBillingAddressId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}
