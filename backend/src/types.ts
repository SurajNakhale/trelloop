import { z } from "zod";
import { IssuePriority, Status } from "./generated/prisma/enums";

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

export const createIssueSchema = z.object({
    title: z.string(),
    status: z.enum(Status),
    boardId: z.string(),
    priority: z.enum(IssuePriority),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
})

export type createIssueInput = z.infer<typeof createIssueSchema>;

export const updateIssueSchema = z.object({
    title: z.string().optional(),
        status: z.enum(Status).optional(),
        boardId: z.string().optional(),
        priority: z.enum(IssuePriority).optional(),
        description: z.string().optional(),
        assigneeId: z.string().optional(),
})

export type updateIssueInput = z.infer<typeof updateIssueSchema>