import express from "express" ; 
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
import { requestPickup } from "../controllers/business.controller";
const router = express.router();


router.post("/request-pickup" , isAuthenticated , authorizeRoles("business") , requestPickup)


export default router ; 