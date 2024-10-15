import express from "express";
import { 
  createBlog, 
  getBlogs, 
  getBlog, 
  updateBlog, 
  deleteBlog, 
  publicblogs,  
  publicblogsbypermalinks
} from "../Controller/adminBlogController.js";
import authenticateUser  from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js"; // Import isAdmin middleware

const router = express.Router();

// Public Routes (accessible to everyone)
router.get('/publicblogs', publicblogs); // Fetch all public blogs
router.get('/publicblogsbypermalink/:permalink', publicblogsbypermalinks); // Fetch a specific public blog by its slug (no auth required)

// Admin Routes (restricted to authenticated users with admin access)
router.post("/", authenticateUser , isAdmin, createBlog); // Admin: Create a blog
router.get("/", authenticateUser , isAdmin, getBlogs); // Admin: Get all blogs
router.get("/:slug", authenticateUser , isAdmin, getBlog); // Admin: Get blog by ID
router.put("/:slug", authenticateUser , isAdmin, updateBlog); // Admin: Update blog by ID
router.delete("/:slug", authenticateUser , isAdmin, deleteBlog); // Admin: Delete blog by ID

export default router;