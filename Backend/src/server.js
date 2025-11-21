import express, { application } from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import complaintRoutes from "./routes/complaint.route.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT ; 
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/user.route.js"
import businessRoutes from "./routes/business.route.js";
import truckRoutes from "./routes/truck.route.js";
import adminRoutes from "./routes/admin.route.js"
import cors from "cors"
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth" , authRoutes)
app.use("/business" , businessRoutes) ; 
app.use("/truck" , truckRoutes)
app.use("/complaint" , complaintRoutes);
app.use("/admin", adminRoutes)


app.listen(PORT  , ()=>{
    console.log(`Server is running on ${PORT}`)
    connectDB();
})