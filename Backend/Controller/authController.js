import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

const validateInput = (req, res, next) => {
    const { username, email, password, confirmPassword, gender } = req.body;

    if (!username || !email || !password || !confirmPassword || !gender) {
        return next(errorHandler(400, "All fields are required"));
    }

    if (password.length < 8) {
        return next(errorHandler(400, "Password must be at least 8 characters long"));
    }

    if (password !== confirmPassword) {
        return next(errorHandler(400, "Passwords do not match"));
    }

    next();
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
    );
};

export const signup = async (req, res, next) => {
    try {
        await validateInput(req, res, next);

        const existingUser  = await User.findOne({ email: req.body.email });
        if (existingUser ) {
            return next(errorHandler(400, "User  already exists"));
        }

        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        const profilePic = `https://avatar.iran.liara.run/public/${req.body.gender === "male" ? "boy" : "girl"}?username=${req.body.username}`;

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            role: "user",
            profilePic,
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        }).status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(errorHandler(400, "Email and password are required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, "User  not found"));
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials"));
        }

        const token = generateToken(user);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        }).status(200).json({
            token,
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};