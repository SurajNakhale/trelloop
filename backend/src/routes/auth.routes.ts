import { Router } from "express";
import { login, register, userInfo } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, userInfo);


export default authRoutes;