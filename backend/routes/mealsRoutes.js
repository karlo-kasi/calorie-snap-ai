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

// ===== Meals ROUTES =====
router.post("/meal/upload", authMiddleware, createMeals);

router.get("/analysis/stats", authMiddleware, getTodayMeals);

router.get("/analysis/date/:date", authMiddleware, getMealsByDate);

router.get("/analysis/:id", authMiddleware, getMealById);

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