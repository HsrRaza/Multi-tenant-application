import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject, getProjectById, getProjects } from "../controllers/project.controller.js";
import { canAccessProject } from "../middleware/canAccessProject.middleware.js";

const router  = express.Router()

router.post(
    "/projects",
    authenticate,
    createProject
);

router.get(
    "/projects/my",
    authenticate,
    getProjects
);

router.get(
    "/projects/:projectId",
    authenticate,
    canAccessProject,
    getProjectById
);
