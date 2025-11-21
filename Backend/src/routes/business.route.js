import express from "express" ; 
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { getAllPickupRequests, requestPickup } from "../controllers/business.controller.js";
const router = express.Router();


router.post("/request-pickup" , isAuthenticated , authorizeRoles("business") , requestPickup)
router.get("/request-pickup" , isAuthenticated , authorizeRoles("admin") , getAllPickupRequests)

export default router ; 