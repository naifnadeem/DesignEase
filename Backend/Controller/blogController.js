import Blog from "../models/blog.model.js";
import { errorHandler } from "../utils/error.js";
import slugify from "slugify"; // To generate slugs

// Public Route: Get all blogs (accessible by everyone)
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

// Public Route: Get a specific blog by slug (accessible by everyone)
export const getBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

// Admin/Author-only Route: Create a new blog (restricted to authenticated users)
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, featureImage, images, keywords, categories } = req.body;
    const author = req.user?.username;

    if (!title || !content) {
      return next(errorHandler(400, "Title and content are required"));
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    const newBlog = new Blog({
      title,
      content,
      author,
      slug, // Add slug to the new blog
      featureImage,
      images,
      keywords,
      categories,
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(errorHandler(400, error.message));
    }
    next(error);
  }
};

// Admin/Author-only Route: Update an existing blog (restricted to admins or the blog author)
export const updateBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const { title, content, featureImage, images, keywords, categories } = req.body;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    if (req.user.role !== "admin" && blog.author !== req.user.username) {
      return next(errorHandler(403, "You are not authorized to update this blog"));
    }

    // Update the blog's details
    blog.title = title;
    blog.content = content;
    blog.featureImage = featureImage;
    blog.images = images;
    blog.keywords = keywords;
    blog.categories = categories;

    // If title is updated, regenerate the slug
    if (title) {
      blog.slug = slugify(title, { lower: true, strict: true });
    }

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    next(error);
  }
};

// Admin/Author-only Route: Delete a blog (restricted to admins or the blog author)
export const deleteBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    if (req.user.role !== "admin" && blog.author !== req.user.username) {
      return next(errorHandler(403, "You are not authorized to delete this blog"));
    }

    await Blog.deleteOne({ slug });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};
