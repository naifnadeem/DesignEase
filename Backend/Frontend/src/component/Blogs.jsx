import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const userBlogsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publicblogs`);
        const adminBlogsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/publicblogs`);
        
        if (!userBlogsResponse.ok || !adminBlogsResponse.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const userBlogs = await userBlogsResponse.json();
        const adminBlogs = await adminBlogsResponse.json();
        
        const combinedBlogs = [
          ...userBlogs.map(blog => ({ ...blog, isAdmin: false })),
          ...adminBlogs.map(blog => ({ ...blog, isAdmin: true }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setBlogs(combinedBlogs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blogs: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
            <Navbar userType="user" />
      <div className="bg-hero-pattern min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Heading */}
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            Explore Our Latest Blogs
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => {
              const linkPath = blog.isAdmin ? `/admin/blog/${blog.permalink}` : `/blog/${blog.slug}`;
              
              return (
                <div 
                  key={`${blog.isAdmin ? blog.permalink : blog.slug}-${index}`} 
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <img
                    className="w-full h-48 object-cover"
                    src={blog.featureImage || 'https://via.placeholder.com/400x200'}
                    alt={blog.title}
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
                    <h2 className="text-2xl font-bold text-white mb-2">
                      <Link to={linkPath} className="hover:underline">{blog.title}</Link>
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <Link 
                      to={linkPath} 
                      className="inline-block text-yellow-500 font-semibold hover:text-yellow-400 transition-colors"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Blogs;
