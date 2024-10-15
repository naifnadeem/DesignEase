// adminRouter.js
import express from "express";
import {
  adminLogin,
  adminSignup,
  adminUploadFile,
  logout,
} from "../Controller/adminController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/logout", logout);
router.post("/upload", upload.single("file"), adminUploadFile);


export default router;
