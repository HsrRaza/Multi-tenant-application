import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/project.controller.js";
import { canAccessProject } from "../middleware/canAccessProject.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router  = express.Router()

router.post(
    "/projects",
    authenticate,
      authorize(["admin"]),
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

router.put(
    "/projects/:projectId",
    authenticate,
    authorize(["admin"]),
    updateProject
);

router.delete(
    "/projects/:projectId",
    authenticate,
    authorize(["admin"]),
    deleteProject
);