import express from "express" ; 
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getAllTrucks, getTrucksByRoute } from "../controllers/truck.controller.js";
const router = express.Router(); 


router.get("/all" , isAuthenticated , getAllTrucks);
router.get("/route/:ward" , isAuthenticated , getTrucksByRoute);


export default router ;

