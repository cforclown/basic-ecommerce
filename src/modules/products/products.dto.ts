import { string, z } from 'zod';

export const ProductSchema = z.object({
  name: z.string(),
  description: string().min(10) ,
  price: z.number()
});
