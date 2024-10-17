// controllers/total.controller.js

import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import AdminBlog from "../models/adminBlog.model.js";

// Controller to get total counts for users, blogs, logos, and templates
export const getTotals = async (req, res) => {
  try {
    // Fetch totals from respective collections
    const totalUsers = await User.countDocuments();
    const totalBlogs = await AdminBlog.countDocuments();

    // Define the paths to your upload directories
    const logosDirectory = path.join('C:', 'Users', 'mnade', 'Desktop', 'Naif', 'New folder', 'Backend', 'uploads', 'images');
    const templatesDirectory = path.join('C:', 'Users', 'mnade', 'Desktop', 'Naif', 'New folder', 'Backend', 'uploads', 'html');

    // Count files in logos directory
    const totalLogos = fs.existsSync(logosDirectory) ? fs.readdirSync(logosDirectory).length : 0;

    // Count only .html files in templates directory
    const totalTemplates = fs.existsSync(templatesDirectory)
      ? fs.readdirSync(templatesDirectory).filter(file => path.extname(file).toLowerCase() === '.html').length
      : 0;

    // Send response with all totals
    res.json({
      users: totalUsers,
      blogs: totalBlogs,
      logos: totalLogos,
      templates: totalTemplates
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
