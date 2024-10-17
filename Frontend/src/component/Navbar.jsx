import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Menu, User, LogOut, Info, Phone, FileText, Bookmark, BookOpen, LogIn, ChevronDown } from 'lucide-react';

const Navbar = ({ userType }) => {
  const user = JSON.parse(localStorage.getItem(userType));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(userType);
    navigate(userType === 'user' ? '/' : '/AdminLogin');
  };

  const handleInvoiceClick = () => {
    navigate('/Templates');
  };

  const handleLogoClick = () => {
    navigate('/Templates');
  };

  const NavLink = ({ href, icon: Icon, children }) => (
    <a href={href} className="flex items-center px-4 py-2 text-white hover:bg-yellow-400 hover:text-black rounded-md transition duration-300 ease-in-out">
      <Icon className="mr-2" size={18} />
      {children}
    </a>
  );

  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center text-gray-300 hover:text-white focus:outline-none"
        aria-expanded={isMenuOpen}
      >
        <User className="mr-2" size={18} />
        <span>{user?.username}</span>
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <a href="/SavedTemplates" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Saved Templates
          </a>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </div>
  );

  const LoginButton = () => (
    <a href="/Login" className="flex items-center text-white hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-md transition duration-300 ease-in-out">
      <LogIn className="mr-2" size={18} />
      Login
    </a>
  );

  return (
    <nav className="bg-hero-pattern bg-opacity-90 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/">
              <span className="text-white text-xl hover:text-yellow-500 transition-colors font-bold">DesignEase</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
                className="flex items-center px-4 py-2 text-white hover:bg-yellow-400 hover:text-black rounded-md transition duration-300 ease-in-out"
                aria-expanded={isTemplatesOpen}
              >
                <FileText className="mr-2" size={18} />
                Templates
                <ChevronDown className={`ml-2 transition-transform ${isTemplatesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTemplatesOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-hero-pattern bg-opacity-90 rounded-md shadow-lg py-1 z-10">
                  <button onClick={handleInvoiceClick} className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-400">
                    Invoice Generator
                  </button>
                  <button onClick={handleLogoClick} className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-400">
                    Logo Maker
                  </button>
                </div>
              )}
            </div>
            <NavLink href="/blog" icon={BookOpen}>Blog</NavLink>
            <NavLink href="/AboutUs" icon={Info}>About Us</NavLink>
            <NavLink href="/ContactUs" icon={Phone}>Contact Us</NavLink>
          </div>

          {/* User Menu or Login Button */}
          <div className="hidden md:block">
            {user ? <UserMenu /> : <LoginButton />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <NavLink href="/Templates" icon={FileText}>Templates</NavLink>
            <NavLink href="/Blog" icon={BookOpen}>Blog</NavLink>
            <NavLink href="/AboutUs" icon={Info}>About Us</NavLink>
            <NavLink href="/ContactUs" icon={Phone}>Contact Us</NavLink>
            {user ? (
              <>
                <NavLink href="/SavedTemplates" icon={Bookmark}>Saved Templates</NavLink>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-white hover:bg-yellow-400 hover:text-black rounded-md">
                  <LogOut className="mr-2" size={18} />
                  Logout
                </button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  userType: PropTypes.string.isRequired,
};

export default Navbar;
