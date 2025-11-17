import express from "express"
import {
    setupInformation,
    getDashboard,
    getWeeklyStats,
    getMonthlyStats

} from "../controllers/profileController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router()


router.post("/onboarding", authMiddleware, setupInformation)

router.get("/stats", getDashboard)

router.get("/stas-weekly", getWeeklyStats)

router.get("/stats-monthly", getMonthlyStats)

export default router 