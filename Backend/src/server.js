import express from "express";
import dotenv from "dotenv"
dotenv.config();
const app = express();
const PORT = process.env.PORT ; 
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/user.route.js"
app.get("/" , (req , res)=>{
    res.send('Hello')
})
app.use(express.json());
app.use("/auth" , authRoutes)
app.listen(8000 , ()=>{
    console.log(`Server is running on ${PORT}`)
    connectDB();
})