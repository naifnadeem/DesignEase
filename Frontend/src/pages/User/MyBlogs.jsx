import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash, FiEdit, FiEye } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featureImage, setFeatureImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedBlog(null);
    setTitle('');
    setContent('');
    setFeatureImage('');
    setShowModal(false);
  };

  const handleDeleteBlog = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog.slug !== slug));
      toast.success('Blog deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete the blog.');
    }
  };

  const handleUpdateBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/blogs/${selectedBlog.slug}`,
        { title, content, featureImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(blogs.map((blog) => (blog.slug === selectedBlog.slug ? response.data.blog : blog)));
      resetModal();
      toast.success('Blog updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update the blog.');
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setFeatureImage(blog.featureImage);
    setShowModal(true);
  };

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setShowContentModal(true);
  };

  const renderGrid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((blog) => (
        <div key={blog._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img
            src={blog.featureImage || 'https://via.placeholder.com/400x200'}
            alt={blog.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200';
            }}
          />
          <div className="p-6">
            <div className="flex items-center mb-4">
              <img
                className="w-10 h-10 rounded-full mr-4"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author)}&background=random`}
                alt={blog.author}
              />
              <div>
                <p className="text-white font-semibold">{blog.author}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()} · {blog.readTime || '5 min'} read
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 truncate">{blog.title}</h2>
            <p className="text-gray-300 mb-4 line-clamp-3">{blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
            <div className="flex justify-between mb-4">
              <button onClick={() => handleReadMore(blog)} className="text-yellow-500 font-semibold hover:text-yellow-400">
                <FiEye size={16} /> Read More
              </button>
              <button onClick={() => handleEditBlog(blog)} className="text-yellow-500 font-semibold hover:text-yellow-400">
                <FiEdit size={16} /> Edit
              </button>
              <button onClick={() => handleDeleteBlog(blog.slug)} className="text-red-500 font-semibold hover:text-red-400">
                <FiTrash size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar userType="user" />
      <div className="min-h-screen bg-hero-pattern py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="bottom-right" />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">My Blogs</h1>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            renderGrid(blogs)
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 border rounded mb-4"
              />
              <ReactQuill
                value={content}
                onChange={(value) => setContent(value)}
                placeholder="Enter blog content"
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={handleUpdateBlog} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save changes
                </button>
                <button onClick={resetModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showContentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{selectedBlog?.title}</h2>
              <img src={selectedBlog?.featureImage || 'https://via.placeholder.com/400x200'} alt="Feature" className="w-full h-64 object-cover rounded-lg mb-4" />
              <div dangerouslySetInnerHTML={{ __html: selectedBlog?.content }} className="prose max-w-none" />
              <button className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={() => setShowContentModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default MyBlogs;
