import express from "express" ; 
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { requestPickup } from "../controllers/business.controller.js";
const router = express.Router();


router.post("/request-pickup" , isAuthenticated , authorizeRoles("business") , requestPickup)


export default router ; 