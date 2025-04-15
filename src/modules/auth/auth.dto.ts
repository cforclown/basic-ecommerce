import zod from 'zod';

export const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

export const signupSchema = zod.object({
  name: zod.string().min(3),
  email: zod.string().email(),
  password: zod.string().min(6),
});
