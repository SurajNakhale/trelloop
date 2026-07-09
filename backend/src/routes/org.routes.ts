import { Router } from "express";
import { addMembers, createOrg, deleteMember, deleteOrg, getAllMembers, getAllOrgDetails, orgDetails, updateOrg } from "../controllers/org.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const orgRoutes = Router();

orgRoutes.post("/", authMiddleware, createOrg);
orgRoutes.get("/", authMiddleware, getAllOrgDetails);
orgRoutes.get("/:orgId", authMiddleware, orgDetails);
orgRoutes.patch("/:orgId", authMiddleware, updateOrg);
orgRoutes.delete("/:orgId", authMiddleware, deleteOrg);
orgRoutes.post("/:org/members", authMiddleware, addMembers);
orgRoutes.get("/:org/members", authMiddleware, getAllMembers);
orgRoutes.delete("/:orgId/members/:userId", deleteMember);

export default orgRoutes;