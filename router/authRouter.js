import express from "express"
import { setUser, handleLogin, handleRegister, handleLogout, loginWithGoogle, } from "../controller/authController.js"
import checkAuth from "../middleware/auth.js"

const router=express.Router()

router.get("/", checkAuth,setUser)

router.post("/login",handleLogin)
router.post("/register",handleRegister)
router.post("/logout",handleLogout)
router.post("/google",loginWithGoogle)



export default router