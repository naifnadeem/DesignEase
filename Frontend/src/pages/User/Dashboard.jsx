import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { Calendar, User ,FileText, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/blogs/publicblogs`);
        setBlogs(response.data);
      } catch (error) {
        setError("Failed to load blogs.");
        toast.error("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateInvoice = () => {
    window.location.href = "/Templates";
  };

  const handleCreateLogo = () => {
    window.location.href = "/Templates";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ToastContainer />
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <ToastContainer />
      <Navbar userType="user" />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome message */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white">
              Welcome, <span className="text-yellow-500">{user?.username}</span>!
            </h1>
          </div>

          {/* Latest Blogs Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-8 text-white">Latest Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div key={blog._id} className="card bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <figure className="px-4 pt-4">
                    <img
                      src={blog.featureImage || 'https://via.placeholder.com/400x200'}
                      alt={blog.title}
                      className="h-48 w-full object-cover rounded-xl"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-white text-xl font-semibold">{blog.title}</h2>
                    <p className="text-gray-300">{blog.excerpt}</p>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                {blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary hover:bg-yellow-500 transition-colors duration-300">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Business Tools Section */}
          <section className="space-y-12">
            {/* Business Invoice Creator */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 md:p-12 transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                    Business Invoice Creator
                  </h2>
                  <p className="text-white mb-6">
                    Generate professional invoices effortlessly. Our user-friendly invoice creator
                    empowers you to craft detailed, customized invoices for your business.
                  </p>
                  <button
                    onClick={handleCreateInvoice}
                    className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 ease-in-out flex items-center"
                  >
                    <FileText className="mr-2" /> Create an Invoice
                  </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <img
                    src="src/assets/images/invoice.webp"
                    alt="Invoice Example"
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Logo Maker */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg p-8 md:p-12 transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col md:flex-row-reverse items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                    Professional Logo Maker
                  </h2>
                  <p className="text-white mb-6">
                    Create stunning, professional logos in minutes with our intuitive Logo Maker. 
                    Design the perfect logo that represents your brand identity.
                  </p>
                  <button
                    onClick={handleCreateLogo}
                    className="bg-white text-green-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-100 transition duration-300 ease-in-out flex items-center"
                  >
                    <ImageIcon className="mr-2" /> Create a Logo
                  </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <img
                    src="src/assets/images/logologo.webp"
                    alt="Logo Example"
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;