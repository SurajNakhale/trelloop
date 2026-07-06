import { Router } from "express";
import { login, register, userInfo } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, userInfo);


export default authRouter;