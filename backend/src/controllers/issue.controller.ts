import type { NextFunction, Request, Response } from "express";
import { createIssueSchema, updateIssueSchema } from "../types";
import { HTTP_STATUS } from "../utlis/http";
import * as issueService from "../services/issue.service"
import z from "zod";
function validation(res: Response){
    return res.status(HTTP_STATUS.BAD_REQUEST).json("validation error");
}
export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = createIssueSchema.safeParse(req.body);
    const boardId = req.boardId!;

    if(!parsedData.success) return validation(res);

    try{
        const result = await issueService.createIssue(boardId, parsedData.data);

        return res.status(HTTP_STATUS.CREATED).json({
            result
        })
    }
    catch(err){
        next(err);
    }
}
export const getAllIssue = async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.boardId!;

    try{
        const result = await issueService.getAllIssue(boardId);

        res.status(HTTP_STATUS.OK).json({
            issues: result
        })
    }
    catch(err){
        next(err)
    }
}

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = updateIssueSchema.safeParse(req.body);
    const role = req.role!;
    const issueId = req.params.issueId as string;

    if(!parsedData.success) return validation(res);

    try{
        const result = await issueService.updateIssue(parsedData.data, issueId, role);

        res.status(HTTP_STATUS.OK).json({
            message: "issue updated successfully",
            updatedIssue: result
        })
    }
    catch(err){

    }
}
export const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
    const issueId = req.params.issueId as string;
    const role = req.role!;

    try{
        const result = await issueService.deleteIssue(issueId, role);

        res.status(HTTP_STATUS.OK).json({
            message: "deleted success",
            title: result.title
        })
    }
    catch(err){
        next(err);
    }
}