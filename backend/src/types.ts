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

export const createOrgSchema = z.object({
    name: z.string(),
    description: z.string().optional()
})

export type createOrgData = z.infer<typeof createOrgSchema>;

export const createBoardSchema = z.object({
    title: z.string()
})

export type createBoardInput = z.infer<typeof createBoardSchema>;
