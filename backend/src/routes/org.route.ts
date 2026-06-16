import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { createOrganization } from "../controllers/orgs.controller.js";

const router = express.Router();

router.post("/orgs",authenticate, createOrganization )