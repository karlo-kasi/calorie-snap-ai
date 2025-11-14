import express from "express";
import { loginUser, newUser } from "../controllers/userAuth.js";

const router = express.Router();

router.post("/register", newUser);
router.post("/login", loginUser);

export default router;
