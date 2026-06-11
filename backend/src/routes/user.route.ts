import express from "express"
import { createuser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller.ts";

const router = express.Router();

router.post("/user", createuser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;