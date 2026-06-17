import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { assignMemberToProject } from "../controllers/projectMember.controller.js";

const router = express.Router()

router.post(
    "/projects/:projectId/members",
    authenticate,
    assignMemberToProject
);