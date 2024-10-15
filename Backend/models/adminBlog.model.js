import mongoose from "mongoose";

const adminblogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },
    permalink: { 
      type: String, 
      unique: true, 
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

const AdminBlog = mongoose.model("AdminBlog", adminblogSchema);
export default AdminBlog;
