import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3),
    password: z.string().max(8)
})
export type registerInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().max(8)
})
export type loginInput = z.infer<typeof registerSchema>;
