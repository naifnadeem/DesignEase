import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Trash2, Eye, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

const ManageBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("user");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const blogsPerPage = 5;

  useEffect(() => {
    fetchBlogs();
  }, [activeTab]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const url = activeTab === "user" ? `${import.meta.env.VITE_API_URL}/api/blogs` : `${import.meta.env.VITE_API_URL}/api/admin/blogs`;
      const response = await axios.get(url, { headers });
      setBlogs(response.data);
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setError("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const url = activeTab === "user" ? `${import.meta.env.VITE_API_URL}/api/blogs/${slug}` : `${import.meta.env.VITE_API_URL}/api/admin/blogs/${permalinks}`;
        await axios.delete(url, { headers });
        setBlogs(blogs.filter((blog) => blog.slug !== slug));
      } catch (err) {
        setError("Error deleting blog");
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleView = (slug) => {
    if (activeTab === "admin") {
      navigate(`/admin/blog/${slug}`);
    } else {
      navigate(`/blog/${slug}`);
    }
  };
  

  const handleUpdateBlog = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const url = activeTab === "user" 
        ? `${import.meta.env.VITE_API_URL}/api/blogs/${editingBlog.slug}` 
        : `${import.meta.env.VITE_API_URL}/api/admin/blogs/${editingBlog.slug}`;
      
      await axios.put(url, editingBlog, { headers });
      setIsEditModalOpen(false);
      fetchBlogs(); // Refresh the blogs list
    } catch (err) {
      setError("Error updating blog");
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Blogs</h2>

      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded-md ${activeTab === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            User Blogs
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-md ${activeTab === "admin" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Admin Blogs
          </button>
        </div>
        {/* <div className="relative">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBlogs.map((blog) => (
              <tr key={blog.slug}>
                <td className="px-6 py-4 whitespace-nowrap">{blog.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{blog.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleView(blog.slug)} className="text-blue-600 hover:text-blue-900 mr-2">
                    <Eye size={20} />
                  </button>
                  <button onClick={() => handleEdit(blog)} className="text-yellow-600 hover:text-yellow-900 mr-2">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(blog.slug)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstBlog + 1}</span> to <span className="font-medium">{Math.min(indexOfLastBlog, filteredBlogs.length)}</span> of{' '}
            <span className="font-medium">{filteredBlogs.length}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastBlog >= filteredBlogs.length}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingBlog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>
            <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editingBlog.title}
              onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">Content</label>
            <ReactQuill
              value={editingBlog.content}
              onChange={(value) => setEditingBlog({ ...editingBlog, content: value })}
              className="h-64 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleUpdateBlog} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
