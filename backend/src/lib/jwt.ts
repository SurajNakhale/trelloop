import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { ApiError } from "../utlis/ApiError";
   
export const generateToken = (userId: string) =>{
    return jwt.sign(
        {
            userId
        }, 
        JWT_SECRET,
        {
            expiresIn: "7d",
        });
} 

export const verifyJWT = (token: string) => {

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if(typeof decoded === "string"){
        throw new Error("invalid token payload");
    }

    return decoded
}