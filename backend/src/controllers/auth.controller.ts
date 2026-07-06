import type { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service"
import { loginSchema, registerSchema } from "../types";
import { ApiError } from "../utlis/ApiError";



export const register = async (req: Request , res: Response, next: NextFunction) => {
    const parsedData = registerSchema.safeParse(req.body);

    if(!parsedData.success) return res.status(400).json("validation error");
    try{
        const result = await authService.register(parsedData.data);
        console.log(result);
        res.status(201).json({result});
    }
    catch(err){
        next(err);
    }

};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = loginSchema.safeParse(req.body);

    if(!parsedData.success) return res.status(400).json("validation error");

    try{
        const result = await authService.login(parsedData.data);
    
        res.status(200).json(result);
    }
    catch(err){
        next(err)
    }
};

export const userInfo = async (req: Request, res:Response, next: NextFunction) => {
    const userId = req.userId;
    if(!userId) return res.status(401).json("unauthorized user login first!!");

    try{
        const result = await authService.userInfo(userId);

        res.status(200).json(result);

    }catch(err){
        next(err);
    }
}