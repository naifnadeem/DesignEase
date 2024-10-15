/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Fetch user from localStorage
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      toast.error('No token found. Please log in.');
      setLoading(false);
      return;
    }

    // Fetch blogs
    const fetchBlogs = async () => {
      try {
        const blogResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(blogResponse.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load blogs.');
        toast.error('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ToastContainer />
        <div className="alert alert-error">
          <div className="flex-1">
            <label>{error}</label>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <Navbar userType="user" />
      <div className="min-h-screen bg-hero-pattern py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome message */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold">
              Welcome, <span className="text-yellow-500">{user?.username}</span>!
            </h1>
            <p className="text-gray-400 mt-2">Here are your latest blogs:</p>
          </div>

          {/* Blog list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="card bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <figure>
                  <img
                    src={blog.featureImage || 'https://via.placeholder.com/400x200'}
                    alt={blog.title}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-white text-lg font-semibold">{blog.title}</h2>
                  <p className="text-gray-300">{blog.excerpt}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary hover:bg-yellow-500 transition-colors duration-300">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
