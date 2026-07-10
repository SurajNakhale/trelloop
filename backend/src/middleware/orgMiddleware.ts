import type { NextFunction, Request, Response } from "express";
import { prisma } from "../client";
import { HTTP_STATUS } from "../utlis/http";

export const orgMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const orgId = req.params.orgId as string;
    
    try{
        const membership = await prisma.member.findFirst({
            where: {
                userId,
                orgId
            },
            select: {
                orgId: true,
                role: true
            }
        })

        if(!membership) return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "you are not member of this org"
        });

        req.orgId = membership.orgId;
        req.role = membership.role;
        next();

    }catch(err){
        next(err);
    }
}