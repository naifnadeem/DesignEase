import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  PlusCircle, 
  LogOut, 
  ChevronRight,
  Settings,
  Bell,
  Search,
  Layout,
  MessageSquare,
  User
} from "lucide-react";

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
    // Logout button added as a menu item
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
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1></>
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
          {!isSidebarCollapsed && <h1 className="text-2xl font-bold text-white ml-2">Mera Project</h1>}
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
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronRight className={`transform transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="flex-1 mx-4">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full max-w-xl pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div> */}
          </div>
          
          {/* <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <MessageSquare size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          </div> */}
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeSection === 'dashboard' ? 'Dashboard' : menuItems.find(item => item.id === activeSection)?.label}
            </h1>
            <nav className="text-gray-500 text-sm">
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