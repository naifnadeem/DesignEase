import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const adminSignup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return next(errorHandler(400, "Passwords do not match"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Admin already exists"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await admin.save();

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      token,
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return next(errorHandler(404, "Admin not found"));
    }

    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid password"));
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      token,
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    next(error);
  }
};
const adminUploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const filePath = path.join(__dirname, "../uploads/", file.originalname);

    if (!file.buffer) {
      return res.status(400).json({ message: "File buffer is empty" });
    }

    fs.writeFileSync(filePath, file.buffer);

    res.status(201).json({ message: "File uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading file" });
  }
};
export { adminUploadFile };

export const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
