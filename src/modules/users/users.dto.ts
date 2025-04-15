import { z } from 'zod';

export const addAdressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  pinCode: z.string().nullable().optional(),
});

export const updateUserSchema = z.object({
  defaultShippingAddress: z.string().nullable().optional(),
  defaultBillingAddress: z.string().nullable().optional(),
});
