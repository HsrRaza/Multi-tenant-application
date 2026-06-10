import express from "express"

const router = express.Router();

router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
