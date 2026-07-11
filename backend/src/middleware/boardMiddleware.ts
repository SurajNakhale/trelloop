import type { NextFunction, Request, Response } from "express";
import { prisma } from "../client";
import { HTTP_STATUS } from "../utlis/http";

export const boardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.orgId!;
    const boardId = req.params.boardId as string;

    try{
        const board = await prisma.board.findUnique({
            where: {
                id: boardId
            }
        })

        if(!board){
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "board not found"
            })
        }

        if(orgId != board.orgId){
            return res.status(HTTP_STATUS.NOT_FOUND).json("board does not belong to this org")
        }

        req.boardId = board.id;
        next();
    }
    catch(err){
        next(err);
    }
    
}