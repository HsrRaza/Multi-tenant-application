import express from "express"
import { signUp, deleteUser,  getUserById, updateUser, login, profile } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sign", signUp);
router.post("/login", login);
router.get("/profile", authenticate , profile)

export default router;