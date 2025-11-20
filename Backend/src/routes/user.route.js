import express from "express" ; 
import { getCurrentUser, login, logout, register } from "../controllers/user.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post("/signup" , register); 
router.post("/signin", login);
router.post("/logout" , logout);
router.get("/getMe" , isAuthenticated , authorizeRoles("user" , "business") , getCurrentUser);


export default router ; 