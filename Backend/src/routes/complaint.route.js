import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
} from "../controllers/complaint.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", isAuthenticated, upload.single("image"), createComplaint); 
router.get("/my-complaints", isAuthenticated, authorizeRoles("admin" , "business") ,  getMyComplaints);
router.get("/all", isAuthenticated, authorizeRoles("admin"), getAllComplaints);
router.put("/status/:id" , isAuthenticated , authorizeRoles("admin" ) ,updateComplaintStatus  )
export default router;