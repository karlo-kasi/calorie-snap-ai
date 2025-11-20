import express from "express";
import {
  createMeals,
  getTodayMeals,
  getMealsByDate,
  getMealById,
  deleteMealById,
} from "../controllers/mealController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// POST /api/meals/meal/upload - Carica i pasti del giorno
router.post("/meal/upload", authMiddleware, createMeals);
// GET /api/meals/analysis/stats - Ottieni le statistiche dei pasti di oggi
router.get("/analysis/stats", authMiddleware, getTodayMeals);
// GET /api/meals/analysis/date/:date - Ottieni i pasti di una data specifica
router.get("/analysis/date/:date", authMiddleware, getMealsByDate);
// GET /api/meals/analysis/:id - Ottieni i dettagli di un pasto specifico
router.get("/analysis/:id", authMiddleware, getMealById);
// DELETE /api/meals/analysis/:id - Elimina un pasto specifico
router.delete("/analysis/:id", authMiddleware, deleteMealById);

// ===== HEALTH CHECK =====
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;