import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { orgMiddleware } from "../middleware/orgMiddleware";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller";


const boardRoutes = Router();

boardRoutes.post("/", authMiddleware, orgMiddleware, createBoard);
boardRoutes.get("/", authMiddleware, orgMiddleware, getAllBoards);
boardRoutes.get("/:boardId", authMiddleware, orgMiddleware, getBoard);
boardRoutes.patch("/:boardId", authMiddleware, orgMiddleware, updateBoard);
boardRoutes.delete("/:boardId", authMiddleware, orgMiddleware, deleteBoard);

export default boardRoutes;
