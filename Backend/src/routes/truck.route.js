import express from "express" ; 
import { isAuthenticated } from "../middlewares/authMiddleware";
import { getAllTrucks, getTrucksByRoute } from "../controllers/truck.controller";
const router = express.Router(); 


router.get("/all" , isAuthenticated , getAllTrucks);
router.get("/route/:ward" , isAuthenticated , getTrucksByRoute);


export default router ;

