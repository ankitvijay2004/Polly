import express from "express";
import SignUp from "../controllers/signup.js";
import SignIn from "../controllers/signin.js";

const router = express.Router();
router.post("/signup", SignUp);
router.post("/signin", SignIn);
export default router;
