import type { NextFunction, Request, Response } from "express";
import { createOrgSchema } from "../types";
import { HTTP_STATUS } from "../utlis/http";
import * as orgService from "../services/org.service"


const validationError = (res: Response) => res.status(HTTP_STATUS.BAD_REQUEST).json("validation error");

export const createOrg = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = createOrgSchema.safeParse(req.body);
    const userId = req.userId!;

    if(!parsedData.success) return validationError(res);
   

    try{
        const result = await orgService.creation(parsedData.data, userId)

        res.status(HTTP_STATUS.CREATED).json({
            message: "org created",
            org: result
        })
    }
    catch(err){
        next(err);
    }
}

export const getAllOrgDetails = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    

    try{
        const result = await orgService.getAllOrgDetails(userId);

        res.status(HTTP_STATUS.OK).json({ 
            orgs: result 
        })
    }
    catch(err){
        next(err);
    }
}

export const orgDetails = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const orgId = req.params.orgId as string;

    if(!orgId) return res.status(HTTP_STATUS.BAD_REQUEST).json("org id required")

    try{
        const result = await orgService.orgDetails(orgId, userId);

        res.status(HTTP_STATUS.OK).json({ 
            org: result 
        })
    }
    catch(err){
        next(err);
    }
}

export const updateOrg = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = createOrgSchema.safeParse(req.body);
    const userId = req.userId!;
    const orgId = req.params.orgId as string;

    if(!parsedData.success) return validationError(res);
    if(!orgId) return res.status(HTTP_STATUS.BAD_REQUEST).json("org id required")

    try{
        const result = await orgService.updateOrg(orgId, parsedData.data, userId);
        
        res.status(HTTP_STATUS.OK).json({ 
            message: "org updated", 
            org: result 
        })
    }
    catch(err){
        next(err);
    }

}

export const deleteOrg = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const orgId = req.params.orgId as string;

    if(!orgId) return res.status(HTTP_STATUS.BAD_REQUEST).json("org id required")

    try{
        await orgService.deleteOrg(orgId, userId);

        res.sendStatus(HTTP_STATUS.OK)
    }
    catch(err){
        next(err);
    }

}

export const addMembers = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const orgId = req.params.orgId as string;
    const memberId = req.body.members;

    if(!orgId) return res.status(HTTP_STATUS.BAD_REQUEST).json("org id required")
    if(!memberId) return res.status(HTTP_STATUS.BAD_REQUEST).json("memberId required")

    try{
        const result = await orgService.addMembers(orgId, memberId, userId);

        res.status(HTTP_STATUS.OK).json({ 
            message: "members added", 
            members: result 
        })
    }
    catch(err){
        next(err);
    }

}

export const getAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const orgId = req.params.orgId as string;

    if(!orgId) return res.status(HTTP_STATUS.BAD_REQUEST).json("org id required")

    try{
        const result = await orgService.getAllMembers(orgId, userId);

        res.status(HTTP_STATUS.OK).json({ 
            members: result
         })
    }
    catch(err){
        next(err);
    }

}

export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const orgId = req.params.orgId as string;
    const memberId = req.params.memberId as string;

    if(!orgId || !memberId) return res.status(HTTP_STATUS.BAD_REQUEST).json("org id and member id required")

    try{
        await orgService.deleteMember(orgId, memberId, userId);

        res.sendStatus(HTTP_STATUS.OK)
    }
    catch(err){
        next(err);
    }

}