import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utlis/ApiError";
import { verifyJWT } from "../lib/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")){
        throw new ApiError(401, "Unauthrized access");
    }

    const token = header.split(" ")[1];

    if(token == undefined) return;

    const decoded = verifyJWT(token);

    req.userId = decoded.userId;
    next();
}