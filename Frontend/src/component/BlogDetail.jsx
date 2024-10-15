import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publicblogsbyslug/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        const blogData = await response.json();
        setBlog(blogData);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-400 text-white px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const createMarkup = (content) => {
    return { __html: decodeHtml(content) };
  };

  const renderFeatureImage = () => {
    if (!blog.featureImage) return null;
    
    const imgClass = "w-full h-64 object-cover rounded-lg shadow-lg mb-6";
    
    return <img src={blog.featureImage} alt={blog.title} className={imgClass} />;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <a href="#" className="inline-flex items-center text-blue-400 hover:underline mb-4">
          <ChevronLeft className="mr-2" size={20} />
          Back to Blog List
        </a>
        <article className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center text-gray-400 mb-6">
            <Calendar className="mr-2" size={20} />
            <span className="mr-4">{new Date(blog.createdAt).toLocaleDateString()}</span>
            <Clock className="mr-2" size={20} />
            <span>{blog.readTime || '5 min'} read</span>
          </div>
          {renderFeatureImage()}
          <div 
            className="prose prose-invert lg:prose-lg max-w-none"
            dangerouslySetInnerHTML={createMarkup(blog.content)} 
          />
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;