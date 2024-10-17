import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  PlusCircle, 
  LogOut, 
  ChevronRight,
  Layout,
  Users,
  File,
} from "lucide-react";
import axios from 'axios'; // Import axios for API calls

// Assumed components (to be implemented separately)
import UploadComponent from "../../component/UploadComponent";
import Gallery from "../../component/Gallery";
import ManageBlogs from "../../component/ManageBlogs";
import AdminAddBlog from "./AdminAddBlog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [totals, setTotals] = useState({
    users: 0,
    blogs: 0,
    logos: 0,
    templates: 0
  });

  // Fetching the totals from the backend API
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/totals`); // API call to your backend route
        const { users, blogs, logos, templates } = response.data;
        setTotals({ users, blogs, logos, templates });
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };

    fetchTotals();
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin");
    navigate("/Adminlogin");
  }, [navigate]);

  const menuItems = [
    { id: 'dashboard', icon: <Layout size={20} />, label: 'Dashboard' },
    { id: 'upload', icon: <Upload size={20} />, label: 'Upload Media' },
    { id: 'addBlog', icon: <PlusCircle size={20} />, label: 'Add Blog' },
    { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Manage Gallery' },
    { id: 'blogs', icon: <FileText size={20} />, label: 'Manage Blogs' },
    { id: 'logout', icon: <LogOut size={20} />, label: 'Logout', onClick: handleLogout }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return <UploadComponent />;
      case 'gallery':
        return <Gallery />;
      case 'blogs':
        return <ManageBlogs />;
      case 'addBlog':
        return <AdminAddBlog />;
      default:
        return (
          <>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <div className="flex items-center mt-2">
                  <Users size={24} />
                  <span className="ml-2 text-3xl font-bold">{totals.users}</span>
                </div>
              </div>
              <div className="bg-green-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Blogs</h3>
                <div className="flex items-center mt-2">
                  <FileText size={24} />
                  <span className="ml-2 text-3xl font-bold">{totals.blogs}</span>
                </div>
              </div>
              <div className="bg-yellow-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Logos</h3>
                <div className="flex items-center mt-2">
                  <ImageIcon size={24} />
                  <span className="ml-2 text-3xl font-bold">{totals.logos}</span>
                </div>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total HTML Templates</h3>
                <div className="flex items-center mt-2">
                  <File size={24} />
                  <span className="ml-2 text-3xl font-bold">{totals.templates}</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#1C2434] transition-all duration-300`}>
        <div className="p-6 flex items-center justify-center">
          <div className="bg-blue-600 p-2 rounded">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="4" fill="currentColor"/>
            </svg>
          </div>
          {!isSidebarCollapsed && <h1 className="text-2xl font-bold text-white ml-2">DesignEase</h1>}
        </div>
        
        <div className="px-4">
          <div className="mb-4 px-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-center mb-4">
                <img
        src={admin?.profilePic || "/src/assets/images/adminProfilePic.png"}
        alt="Profile"
        className="w-16 h-12 rounded-full border-2 border-blue-500"
      />
              </div>
            )}
            {!isSidebarCollapsed && (
              <div className="text-center">
                <h6 className="text-white text-sm font-semibold">{admin?.username || "Admin User"}</h6>
                <p className="text-gray-400 text-xs">{admin?.role || "Administrator"}</p>
              </div>
            )}
          </div>
          
          <p className="text-gray-400 text-xs font-semibold mb-4 px-4">
            {!isSidebarCollapsed && 'MENU'}
          </p>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={item.onClick || (() => setActiveSection(item.id))}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200
                    ${item.id === 'logout' ? 'mt-8 text-gray-400 hover:text-white hover:bg-red-600' :
                    activeSection === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  {item.icon}
                  {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

     
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-hero-pattern h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronRight className={`transform transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-hero-pattern">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">
              {activeSection === 'dashboard' ? 'Dashboard' : menuItems.find(item => item.id === activeSection)?.label}
            </h1>
            <nav className="text-white text-sm">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-blue-600">{menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}</span>
            </nav>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
