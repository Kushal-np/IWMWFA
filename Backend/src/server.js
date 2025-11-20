import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config();
const app = express();
const PORT = process.env.PORT ; 
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/user.route.js"
import businessRoutes from "./routes/business.route.js";
app.use(express.json());
app.use(cookieParser());
app.use("/auth" , authRoutes)
app.use("/business" , businessRoutes) ; 
app.listen(PORT  , ()=>{
    console.log(`Server is running on ${PORT}`)
    connectDB();
})