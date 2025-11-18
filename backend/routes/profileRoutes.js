import express from "express";
import {
  getCurrentUser,
  setupInformation,
  editUserInformation,
  getDashboard,
  getWeeklyStats,
  getMonthlyStats
} from "../controllers/profileController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// GET /api/profile/me - Ottiene i dati dell'utente corrente
router.get("/me", authMiddleware, getCurrentUser);

// POST /api/profile/onboarding - Completa l'onboarding
router.post("/onboarding", authMiddleware, setupInformation);

// PUT /api/profile/me - Modifica le informazioni dell'utente
router.put("/edit-user", authMiddleware, editUserInformation);

// GET /api/profile/stats - Dashboard stats
router.get("/stats", authMiddleware, getDashboard);

// GET /api/profile/stats-weekly - Weekly stats
router.get("/stats-weekly", authMiddleware, getWeeklyStats);

// GET /api/profile/stats-monthly - Monthly stats
router.get("/stats-monthly", authMiddleware, getMonthlyStats);

export default router; 