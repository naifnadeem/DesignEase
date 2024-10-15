import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';

const AdminBlogDetail = () => {
  const { permalink } = useParams();
  const [adminBlog, setAdminBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminBlog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/publicblogsbypermalink/${permalink}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin blog');
        }
        
        const adminBlogData = await response.json();
        setAdminBlog(adminBlogData);
      } catch (err) {
        console.error('Error fetching admin blog:', err);
        setError('Failed to load admin blog: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminBlog();
  }, [permalink]);

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
    if (!adminBlog.featureImage) return null;
    
    const imgClass = "w-full h-64 object-cover rounded-lg shadow-lg mb-6";
    
    if (adminBlog.featureImage.startsWith('data:image')) {
      return <img src={adminBlog.featureImage} alt="Feature" className={imgClass} />;
    } else {
      return <img src={adminBlog.featureImage} alt="Feature" className={imgClass} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 font-montserrat">
      <a href="#" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ChevronLeft className="mr-2" size={20} />
        Back to Blog List
      </a>
      <article className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-4">{adminBlog.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <Calendar className="mr-2" size={20} />
          <span className="mr-4">{new Date(adminBlog.createdAt).toLocaleDateString()}</span>
          <Clock className="mr-2" size={20} />
          <span>{adminBlog.readTime || '5 min'} read</span>
        </div>
        {renderFeatureImage()}
        <div 
          className="prose lg:prose-sm max-w-none blog-content"
          dangerouslySetInnerHTML={createMarkup(adminBlog.content)} 
        />
      </article>
    </div>
  );
};

export default AdminBlogDetail;