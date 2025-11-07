import express from "express";
import {
  uploadAndAnalyze,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getAnalysisStats,
} from "../controllers/userController.js";

const router = express.Router();

// ===== ANALYSIS ROUTES =====

// POST /api/analysis/upload - Carica e analizza un'immagine di cibo
router.post("/analysis/upload", uploadAndAnalyze);

// GET /api/analysis/history - Ottieni lo storico delle analisi
router.get("/analysis/history", getAnalysisHistory);

// GET /api/analysis/stats - Ottieni statistiche sulle analisi
router.get("/analysis/stats", getAnalysisStats);

// GET /api/analysis/:id - Ottieni una singola analisi tramite ID
router.get("/analysis/:id", getAnalysisById);

// DELETE /api/analysis/:id - Elimina un'analisi
router.delete("/analysis/:id", deleteAnalysis);

// ===== HEALTH CHECK =====
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;