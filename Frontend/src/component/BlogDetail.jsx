import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import Footer from './Footer';
import Navbar from './Navbar';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
    const fallbackImage = "/images/default.jpg";

    return (
      <img 
        src={blog.featureImage || fallbackImage} 
        alt={blog.title} 
        onError={(e) => e.target.src = fallbackImage} 
        className={imgClass} 
      />
    );
  };

  return (
    <>
    <Navbar userType="user"/>
     <div className="container mx-auto px-4 py-8 font-montserrat">
      <button
        onClick={() => navigate('/blog')}
        className="inline-flex items-center text-blue-600 hover:underline mb-4"
      >
        <ChevronLeft className="mr-2" size={20} />
        Back to Blog List
      </button>
      <article className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <Calendar className="mr-2" size={20} />
          <span className="mr-4">{new Date(blog.createdAt).toLocaleDateString()}</span>
          <Clock className="mr-2" size={20} />
          <span>{blog.readTime || '5 min'} read</span>
        </div>
        {renderFeatureImage()}
        <div 
          className="prose lg:prose-sm max-w-none blog-content"
          dangerouslySetInnerHTML={createMarkup(blog.content)} 
        />
      </article>
    </div>
    <Footer/>
    </>
   
  );
};

export default BlogDetail;
