// admin.route.js
import express from "express";
import {
  getDashboardData,
  addTruck,
  addRoute,
  getAllUsers
} from "../controllers/admin.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-data", isAuthenticated, authorizeRoles("admin"), getDashboardData);
router.post("/add-truck", isAuthenticated, authorizeRoles("admin"), addTruck);
router.post("/add-route", isAuthenticated, authorizeRoles("admin"), addRoute);
router.get("/all-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);

export default router;