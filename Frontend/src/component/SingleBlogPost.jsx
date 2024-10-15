import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SingleBlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Fetch attempt from public blogs route
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publicblogsbyslug/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Blog not found');
        }

        // If successful, set the blog state
        setBlog(data);
      } catch (err) {
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="alert alert-warning m-5" role="alert">
        <h4 className="alert-heading">No Blog Found</h4>
        <p>The blog content is missing or unavailable.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <article className="blog-post">
            <h1 className="display-4 mb-4">{blog.title}</h1>

            <div className="d-flex align-items-center mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${blog.author}&background=random`}
                alt={blog.author}
                className="rounded-circle me-3"
                width="50"
                height="50"
              />
              <div>
                <h5 className="mb-0">{blog.author}</h5>
                <small className="text-muted">
                  {new Date(blog.createdAt).toLocaleDateString()} · {blog.readTime || '5 min'} read
                </small>
              </div>
            </div>

            {blog.featureImage && (
              <img
                src={blog.featureImage}
                alt={blog.title}
                className="img-fluid rounded mb-4"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            )}

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPost;
