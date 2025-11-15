import express from "express";
import {
  createMeals,
  getTodayMeals,
  getMealById,
  deleteMealById,
} from "../controllers/mealController.js";

const router = express.Router();

// ===== Meals ROUTES =====
router.post("/meal/upload", createMeals);

router.get("/analysis/stats", getTodayMeals);

router.get("/analysis/:id", getMealById);

router.delete("/analysis/:id", deleteMealById);

// ===== HEALTH CHECK =====
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;