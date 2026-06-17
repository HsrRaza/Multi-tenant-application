import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { assignMemberToProject, getProjectMembers, removeMemberFromProject } from "../controllers/projectMember.controller.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { canAccessProject } from "../middleware/canAccessProject.middleware.js";

const router = express.Router()

router.post(
    "/projects/:projectId/members",
    authenticate,
    authorize(["admin"]),
    assignMemberToProject
);

router.delete(
    "/projects/:projectId/members/:userId",
    authenticate,
    authorize(["admin"]),
    removeMemberFromProject
);

router.get(
    "/projects/:projectId/members",
    authenticate,
    canAccessProject,
    getProjectMembers
);

