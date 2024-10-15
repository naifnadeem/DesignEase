import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UploadCloud } from 'lucide-react';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featureImage, setFeatureImage] = useState(null);
  const [featureImageURL, setFeatureImageURL] = useState('');
  const [keywords, setKeywords] = useState(['']);
  const [categories, setCategories] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);

  const handleFeatureImageUpload = () => {
    if (!featureImage) {
      toast.error('Please select a feature image.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(featureImage);

    reader.onloadend = () => {
      setFeatureImageURL(reader.result);
      toast.success('Feature image processed successfully!');
    };

    reader.onerror = (error) => {
      toast.error('Failed to process feature image.');
      console.error('Image upload error: ', error);
    };
  };

  const handleAddBlog = async () => {
    if (!title || !content || !featureImageURL) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');

    const blogData = {
      title,
      content,
      featureImage: featureImageURL,
      keywords: keywords.filter(k => k.trim()),
      categories: categories.filter(c => c.trim()),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Blog posted successfully!');
      resetForm();
    } catch (error) {
      toast.error('Failed to post blog. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFeatureImage(null);
    setFeatureImageURL('');
    setKeywords(['']);
    setCategories(['']);
  };

  const handleArrayInputChange = (index, value, array, setArray) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const handleAddArrayField = (array, setArray) => {
    setArray([...array, '']);
  };

  return (
    <>
      <Navbar userType="user" />
      <div className="min-h-screen flex items-center justify-center py-10 bg-hero-pattern">
        <div className="max-w-3xl w-full mx-auto p-10 bg-opacity-80 bg-gray-800 rounded-xl shadow-xl">
          <h1 className="text-4xl text-white font-bold text-center mb-8">
            Add New Blog Post
          </h1>

          {/* Title Input */}
          <div className="mb-6">
            <label className="text-white font-semibold mb-2 block">Blog Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title"
              className="input input-bordered w-full bg-white border-gray-600 text-black p-3 rounded-lg"
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
  <label className="text-white font-semibold mb-2 block">Content</label>
  <div className="bg-gray-700 rounded-lg">
    <ReactQuill
      value={content}
      onChange={(value) => setContent(value)}
      placeholder="Write your blog content here..."
      className="h-48 text-white ql-container"
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      }}
    />
  </div>,
</div>

          {/* Feature Image Upload */}
          <div className="mt-20 mb-6">
            <label className="text-white font-semibold mb-2 block">Feature Image</label>
            <div className="flex items-center space-x-4">
              <label className="btn btn-primary text-white flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                <UploadCloud />
                <span>Choose Image</span>
                <input
                  type="file"
                  onChange={(e) => setFeatureImage(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              {featureImage && (
                <button
                  onClick={handleFeatureImageUpload}
                  className="btn btn-secondary bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Process Image
                </button>
              )}
            </div>
            {featureImage && (
              <p className="mt-2 text-sm text-gray-400">Selected: {featureImage.name}</p>
            )}
            {featureImageURL && (
              <div className="mt-4">
                <img
                  src={featureImageURL}
                  alt="Feature preview"
                  className="max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="mb-6">
            <label className="text-white font-semibold mb-2 block">Keywords</label>
            {keywords.map((keyword, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, keywords, setKeywords)
                  }
                  placeholder="Enter keyword"
                  className="input input-bordered w-full bg-white border-gray-600 text-black p-3 rounded-lg"
                />
                {index === keywords.length - 1 && (
                  <button
                    onClick={() => handleAddArrayField(keywords, setKeywords)}
                    className="btn btn-outline border-gray-600 text-white hover:bg-gray-700"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="text-white font-semibold mb-2 block">Categories</label>
            {categories.map((category, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, categories, setCategories)
                  }
                  placeholder="Enter category"
                  className="input input-bordered w-full bg-white border-gray-600 text-black p-3 rounded-lg"
                />
                {index === categories.length - 1 && (
                  <button
                    onClick={() => handleAddArrayField(categories, setCategories)}
                    className="btn btn-outline border-gray-600 text-white hover:bg-gray-700"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              onClick={handleAddBlog}
              className={`btn bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Blog'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
      <Footer/>
    </>
  );
};

export default AddBlog;