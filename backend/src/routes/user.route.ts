import express from "express"
import { signUp,  login, profile, refreshToken, logout } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/auth/sign", signUp);
router.post("/auth/login", login);
router.get("/auth/profile", authenticate , profile)
router.post("/auth/logout", authenticate, logout);
router.post(
    "/auth/refresh",
    refreshToken
);

export default router;