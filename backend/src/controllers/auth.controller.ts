import type { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service"
import { loginSchema, registerSchema } from "../types";
import { HTTP_STATUS } from "../utlis/http";



export const register = async (req: Request , res: Response, next: NextFunction) => {
    const parsedData = registerSchema.safeParse(req.body);

    if(!parsedData.success) return res.status(HTTP_STATUS.BAD_REQUEST).json("validation error");
    try{
        const result = await authService.register(parsedData.data);
        console.log(result);
        res.status(HTTP_STATUS.CREATED).json({result});
    }
    catch(err){
        next(err);
    }

};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = loginSchema.safeParse(req.body);

    if(!parsedData.success) return res.status(HTTP_STATUS.BAD_REQUEST).json("validation error");

    try{
        const result = await authService.login(parsedData.data);
    
        res.status(HTTP_STATUS.OK).json(result);
    }
    catch(err){
        next(err)
    }
};

export const userInfo = async (req: Request, res:Response, next: NextFunction) => {
    const userId = req.userId;
    if(!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json("unauthorized user login first!!");

    try{
        const result = await authService.userInfo(userId);

        res.status(HTTP_STATUS.OK).json(result);

    }catch(err){
        next(err);
    }
}