import AdminBlog from "../models/adminBlog.model.js";
import { errorHandler } from "../utils/error.js";
import slugify from "slugify"; 


export const publicblogs = async (req, res, next) => {
  try {
    // Fetch all blogs
    const blogs = await AdminBlog.find();
    res.status(200).json(blogs); // Send blogs as JSON response
  } catch (error) {
    next(error);
  }
};

// Public Route: Get a specific blog by ID (accessible by everyone)
export const publicblogsbypermalinks = async (req, res, next) => {
  try {
    const permalink = req.params.permalink; // replace slug with permalink
    const blog = await AdminBlog.findOne({ permalink });

    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    res.status(200).json(blog); // Send the blog as a JSON response
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, content, featureImage, images, keywords, categories } = req.body;
    const author = req.user?.username; // Assuming you're using some authentication middleware

    // Validate the required fields
    if (!title || !content) {
      return next(errorHandler(400, "Title and content are required"));
    }

    const slug = slugify(title, { lower: true, strict: true });
    const permalink = `${slug}`; // Generate permalink with slug

    const newBlog = new AdminBlog({
      title,
      content,
      author,
      slug,
      permalink, // Add slug to the new blog
      featureImage,
      images,
      keywords,
      categories,
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(errorHandler(400, error.message));
    }
    next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await AdminBlog.find();
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const blog = await AdminBlog.findBySlug({slug});

    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const { title, content, featureImage, images, keywords, categories } = req.body;

    const blog = await AdminBlog.findOne({ slug });


    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    // Admin can update any blog, so no author check here
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (featureImage) blog.featureImage = featureImage;
    if (images) blog.images = images;
    if (keywords) blog.keywords = keywords;
    if (categories) blog.categories = categories;

    if (title) {
      blog.slug = slugify(title, { lower: true, strict: true });
    }

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const blog = await AdminBlog.findOne({ slug });
    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    // Admin can delete any blog, so no author check here
    await AdminBlog.deleteOne({ slug });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
}; 