import express from "express"
import setupInformation from "../controllers/profileController.js";

const router = express.Router()


router.post("/setup", setupInformation)

export default router 