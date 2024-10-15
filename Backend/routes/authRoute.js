import express from "express";
import { login, logout, signup } from "../Controller/authController.js";

const router = express.Router();

// User routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);


export default router;


