import express from "express";



import { authenticate }
from "../middleware/auth.middleware.js";
import { createOrganization, getMyOrganization, getOrganizationMembers, joinOrganization, leaveOrganization } from "../controllers/orgs.controller.js";

const router = express.Router();

router.post(
    "/organizations",
    authenticate,
    createOrganization
);

router.post(
    "/organizations/join",
    authenticate,
    joinOrganization
);

router.get(
    "/organizations/me",
    authenticate,
    getMyOrganization
);

router.get(
    "/organizations/members",
    authenticate,
    getOrganizationMembers
);

router.delete(
    "/organizations/leave",
    authenticate,
    leaveOrganization
);
export default router;