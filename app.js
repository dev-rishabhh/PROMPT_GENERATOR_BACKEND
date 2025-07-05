import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "./config/db.js"
import AiRouter from "./router/AiRouter.js"
import authRouter from "./router/authRouter.js"

const app=express()

app.use(express.json())

app.use((err,req,res,next)=>{
    if(err){
       res.status(402).json({message:"Something went wrong"})
    }
    next()
 })

app.use(cors({
   origin:"https://prompt-generator-frontend-kcak.onrender.com",
   credentials:true,
}
))
app.use(cookieParser("my-secret-key"))

app.get("/",(req,res)=>{
res.json({message:"Welcome to backend"})
})

app.use("/ai",AiRouter)
app.use("/auth",authRouter)


app.listen(4000,()=>{
    console.log("server started");
})
