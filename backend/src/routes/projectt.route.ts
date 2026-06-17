import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject, getProjects } from "../controllers/project.controller.js";

const router  = express.Router()

router.post(
    "/projects",
    authenticate,
    createProject
);

router.get(
    "/projects",
    authenticate,
    getProjects
);
