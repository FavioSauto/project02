import { z } from 'zod';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

export type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;
