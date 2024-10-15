import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UploadCloud, Plus, X } from 'lucide-react';

const AdminAddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featureImage, setFeatureImage] = useState(null);
  const [featureImageURL, setFeatureImageURL] = useState('');
  const [keywords, setKeywords] = useState(['']);
  const [categories, setCategories] = useState(['']);

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

  const handleAddBlog = () => {
    const token = localStorage.getItem('token');

    if (!featureImageURL) {
      toast.error('Please upload the feature image first.');
      return;
    }

    const blogData = {
      title,
      content,
      featureImage: featureImageURL,
      keywords,
      categories,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/admin/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        toast.success('Blog posted successfully!');
        resetForm();
      })
      .catch((error) => {
        toast.error('Failed to post blog. Please try again.');
        console.error(error);
      });
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFeatureImage(null);
    setFeatureImageURL('');
    setKeywords(['']);
    setCategories(['']);
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleAddKeywordField = () => {
    setKeywords([...keywords, '']);
  };

  const handleRemoveKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleAddCategoryField = () => {
    setCategories([...categories, '']);
  };

  const handleRemoveCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Blog Post</h2>
      
      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Content
          </label>
          <ReactQuill
    id="content"
    value={content}
    onChange={(value) => setContent(value)}
    placeholder="Enter blog content"
    className="ql-toolbar"
    modules={{
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ],
    }}
  />
        </div>

        {/* Feature Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feature Image
          </label>
          <div className="mt-1 flex items-center">
            <label className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm border border-blue-600 cursor-pointer hover:bg-blue-50 transition-colors duration-300">
              <UploadCloud className="mr-2" size={20} />
              <span>Upload Image</span>
              <input
                type="file"
                onChange={(e) => setFeatureImage(e.target.files[0])}
                className="hidden"
              />
            </label>
            {featureImage && (
              <span className="ml-4 text-sm text-gray-500">{featureImage.name}</span>
            )}
          </div>
          {featureImage && (
            <button
              onClick={handleFeatureImageUpload}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Process Image
            </button>
          )}
          {featureImageURL && (
            <p className="mt-2 text-sm text-gray-500">
              Image processed successfully
            </p>
          )}
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords
          </label>
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                placeholder="Enter keyword"
                className="flex-grow p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => handleRemoveKeyword(index)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddKeywordField}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-1" /> Add Keyword
          </button>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          {categories.map((category, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                placeholder="Enter category"
                className="flex-grow p-2 bg-white  border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => handleRemoveCategory(index)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddCategoryField}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-1" /> Add Category
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleAddBlog}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post Blog
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AdminAddBlog;