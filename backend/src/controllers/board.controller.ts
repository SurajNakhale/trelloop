import type { NextFunction, Request, Response } from "express";
import { createBoardSchema } from "../types";
import { HTTP_STATUS } from "../utlis/http";
import * as boardService from "../services/board.service"
const validation = (res: Response) => res.status(HTTP_STATUS.BAD_REQUEST).json("validation error");

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
    const parseddata = createBoardSchema.safeParse(req.body);
    const role = req.role!;
    const userId = req.userId!;
    const orgId = req.orgId!;
    if(!parseddata.success) validation(res);

    try{
        if(parseddata.data == undefined) return;
        const result = await boardService.createBoard(orgId, parseddata.data, role);

        res.status(HTTP_STATUS.CREATED).json({
            message: "board created successfully",
            board: result
        })
    }catch(err){
        next(err);
    }
    
}

export const getAllBoards = async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.orgId!;

    try{
        const result = await boardService.getAllBoards(orgId);

        res.status(HTTP_STATUS.OK).json({
            boards: result
        })
    }catch(err){
        next(err)
    }
}
export const getBoard = async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.params.boardId as string;
    const orgId = req.orgId!;

    try{
        const result = await boardService.getBoard(orgId, boardId);

        res.status(HTTP_STATUS.OK).json({
            board: result
        })
    }catch(err){
        next(err);
    }
}
export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = createBoardSchema.safeParse(req.body);
    const orgId = req.orgId!;
    const userId = req.userId!;
    const boardId = req.params.boardId as string;
    const role = req.role!;


    if(!parsedData.success) validation(res);
    try{
        if(!parsedData.data) return;
        const result = await boardService.updateBoard(parsedData.data, boardId, orgId, userId, role);

        res.status(HTTP_STATUS.OK).json({
            message: "updated board",
            board: result
        })
    }
    catch(err){
        next(err);
    }
}
export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.params.boardId as string;
    const orgId = req.orgId!;
    const userId = req.userId!;
    const role = req.role!;


    try{
        await boardService.deleteBoard(boardId, orgId, userId, role);

        res.status(HTTP_STATUS.OK).json({
            messsage: "deleted successfully",
        })
    }
    catch(err){
        next(err)
    }
}
