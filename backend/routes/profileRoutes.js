import express from "express"
import {
    setupInformation,
    getDashboard,
    getWeeklyStats,
    getMonthlyStats

} from "../controllers/profileController.js";

const router = express.Router()


router.post("/setup", setupInformation)

router.get("/stats", getDashboard)

router.get("/stas-weekly", getWeeklyStats)

router.get("/stats-monthly", getMonthlyStats)

export default router 