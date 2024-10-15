import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';

const FeaturedBlogs = ({ blogs }) => {
  return (
    <div className="w-full max-w-6xl bg-gray-900 rounded-xl shadow-lg p-8 md:p-12 mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white text-center">
        Featured <span className="text-yellow-500">Blogs</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
            {blog.featureImage && (
              <img
                src={blog.featureImage}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl text-yellow-400 font-bold mb-2 line-clamp-2">{blog.title}</h3>
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
                href={blog.link} 
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