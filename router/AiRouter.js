import express from "express"
import { generateResponse } from "../controller/AiController.js"

const router=express.Router()

router.post("/",generateResponse)

export default router
