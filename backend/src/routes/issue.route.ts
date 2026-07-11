import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { orgMiddleware } from "../middleware/orgMiddleware";
import { createIssue, deleteIssue, getAllIssue, updateIssue } from "../controllers/issue.controller";
import { boardMiddleware } from "../middleware/boardMiddleware";


const issueRoutes = Router();

issueRoutes.post("/", authMiddleware, orgMiddleware, boardMiddleware, createIssue );
issueRoutes.get("/", authMiddleware, orgMiddleware, boardMiddleware, getAllIssue);
issueRoutes.patch("/:issueId", authMiddleware, orgMiddleware, boardMiddleware, updateIssue);
issueRoutes.delete("/:issueId", authMiddleware, orgMiddleware, boardMiddleware, deleteIssue)

export default issueRoutes