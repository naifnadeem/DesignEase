import express from "express";
import { createBlog, getBlogs, getBlog, updateBlog, deleteBlog } from "../Controller/blogController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get('/publicblogs', getBlogs); // Public: Get all blogs
router.get('/publicblogsbyslug/:slug', getBlog); // Public: Get a single blog by slug

// Authenticated routes
router.post("/", authenticateUser, createBlog); // Authenticated: Create a new blog
router.get("/", authenticateUser, getBlogs); // Authenticated: Get all blogs
router.get("/:slug", authenticateUser, getBlog); // Authenticated: Get a single blog by slug
router.put("/:slug", authenticateUser, updateBlog); // Authenticated: Update a blog by slug
router.delete("/:slug", authenticateUser, deleteBlog); // Authenticated: Delete a blog by slug

export default router;
