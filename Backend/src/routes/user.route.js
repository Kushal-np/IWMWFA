import express from "express" ; 
import { getCurrentUser, login, logout, register } from "../controllers/user.controller";
const router = express.Router();


router.post("/signup" , register); 
router.post("/login " , login);
router.post("/logout" , logout);
router.get("/getMe" , getCurrentUser);


export default router ; 