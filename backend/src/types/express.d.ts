import "express";
import type { OrgRole } from "../generated/prisma/enums";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    orgId?: string;
    role?: OrgRole
  }
}

export {};