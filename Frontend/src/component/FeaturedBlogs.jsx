import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';

const FeaturedBlogs = ({ blogs }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

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

        setFeaturedBlogs(combinedBlogs);
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
    <div className="w-full max-w-6xl bg-gray-900 rounded-xl shadow-lg p-8 md:p-12 mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white text-center">
        Featured <span className="text-yellow-500">Blogs</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredBlogs.map((blog, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
            {blog.featureImage && (
              <img
                src={blog.featureImage}
                alt={blog.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200';
                }}
              />
            )}
            <div className="p-6">
              <h3 className="text-xl text-yellow-400 font-bold mb-2 line-clamp-2">
                <a href={blog.isAdmin ? `/admin/blog/${blog.permalink}` : `/blog/${blog.slug}`} className="hover:underline">
                  {blog.title}
                </a>
              </h3>
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
              <a 
                href={blog.isAdmin ? `/admin/blog/${blog.permalink}` : `/blog/${blog.slug}`} 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Read more
                <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBlogs;
