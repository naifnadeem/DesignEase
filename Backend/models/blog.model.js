import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,  // Ensures that the slug is unique for each blog post
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    featureImage: {
      type: String, // This stores a URL or a base64 string
    },
    keywords: [
      {
        type: String,
      },
    ],
    categories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
