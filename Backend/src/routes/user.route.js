import express from "express" ; 
const router = express.Router();


router.post("/signup" , register); 
router.post("/login " , login);
router.post("/logout" , logout);


export default router ; 