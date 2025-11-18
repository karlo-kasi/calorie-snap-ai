import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { setupProfile } from "../controllers/onboardingController.js";

const router = express.Router();

// POST /api/onboarding/setup - Completa l'onboarding profilo
router.post("/setup", authMiddleware, setupProfile);

export default router;