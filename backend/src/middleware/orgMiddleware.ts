import type { NextFunction, Request, Response } from "express";
import { prisma } from "../client";
import { HTTP_STATUS } from "../utlis/http";

export const orgMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    
    try{
        const org = await prisma.member.findFirst({
            where: {
                userId
            },
            include: {
                org: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        if(!org?.org) return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "org does not exists"
        });

        req.orgId = org.org.id;
        next();

    }catch(err){
        next(err);
    }
}