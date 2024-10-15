import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { Sparkles, Palette, Zap, FileText, Layers, Type, Image as ImageIcon, Star } from 'lucide-react';
import FeaturedBlogs from "../../component/FeaturedBlogs";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Add loggedIn state
  const [blogs, setBlogs] = useState([]); // State to store blogs

  const handleGetStarted = () => {
    window.location.href = "/Signup";
  };

  const handleLogin = () => {
    window.location.href = "/Login";
  };

  const handleCreateInvoice = () => {
    console.log("Navigating to invoice creator");
  };

  const [activeDesign, setActiveDesign] = useState(0);
  const designs = [
    { icon: <Layers size={32} />, title: "Layouts", color: "bg-purple-500" },
    { icon: <Type size={32} />, title: "Typography", color: "bg-blue-500" },
    { icon: <ImageIcon size={32} />, title: "Graphics", color: "bg-green-500" },
    { icon: <Star size={32} />, title: "Effects", color: "bg-yellow-500" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDesign((prev) => (prev + 1) % designs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch blogs when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const userBlogsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publicblogs`);
        const adminBlogsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/publicblogs`);

        if (!userBlogsResponse.ok || !adminBlogsResponse.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const userBlogs = await userBlogsResponse.json();
        const adminBlogs = await adminBlogsResponse.json();

        // Combine or process blogs as needed
        setBlogs([...userBlogs, ...adminBlogs]); // Adjust based on your requirements
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar userType="user" />
      <div className="w-full min-h-screen bg-hero-pattern bg-cover bg-center flex flex-col justify-center items-center p-4">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-8 md:p-16 text-center max-w-4xl mb-16">
          <h1 className="text-5xl md:text-7xl mb-6 text-white font-extrabold leading-tight animate-pulse">
            Design & Branding <span className="text-yellow-500">Made Easy</span>
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 leading-relaxed">
            Unlock your creative potential with our powerful yet simple design tools. 
            Create stunning brands, logos, and marketing materials in minutes, not hours.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 ">
            <FeatureCard
              icon={Sparkles}
              title="Intuitive Tools"
              description="User-friendly interface for effortless design creation"
            />
            <FeatureCard
              icon={Palette}
              title="Brand Templates"
              description="Customize pre-made templates for quick branding"
            />
            <FeatureCard
              icon={Zap}
              title="Instant Results"
              description="Generate professional designs in minutes"
            />
          </div>
        
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {loggedIn ? (
              <span className="text-white text-lg">Welcome back! Start designing.</span>
            ) : (
              <>
                <button
                  onClick={handleGetStarted}
                  className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition duration-300 ease-in-out"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>

        {/* Business Invoice Section */}
        <div className="w-full max-w-6xl bg-hero-pattern rounded-xl shadow-lg p-8 md:p-12 transform hover:scale-105 transition-transform duration-300 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white animate-bounce">
                Business Invoice Creator
              </h2>
              <p className="text-white mb-6">
                Generate professional invoices effortlessly. Our user-friendly invoice creator
                empowers you to craft detailed, customized invoices for your business. Whether
                you're a freelancer or a large corporation, create the perfect invoice to maintain
                a professional image and streamline your billing process.
              </p>
              <button
                onClick={handleCreateInvoice}
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out flex items-center animate-pulse"
              >
                <FileText className="mr-2" /> Create an Invoice
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <img
                  src="src/assets/images/invoice.webp"
                  alt="Invoice Example"
                  className="rounded-lg shadow-md animate-float"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Maker Section */} 
        <div className="w-full max-w-6xl bg-hero-pattern rounded-xl shadow-lg p-8 md:p-12 transform hover:scale-105 transition-transform duration-300 mt-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <img
                  src="src/assets/images/logologo.webp"
                  alt="Logo Example"
                  className="rounded-lg shadow-md animate-float"
                />
              </div>
            </div>
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white animate-bounce">
                Professional Logo Maker
              </h2>
              <p className="text-white mb-6">
                Create stunning, professional logos in minutes with our intuitive Logo Maker. 
                Whether you're starting a new business or rebranding, our tool provides endless 
                possibilities to design the perfect logo that represents your brand identity.
              </p>
              <button
                onClick={() => console.log("Navigating to logo maker")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out flex items-center animate-pulse"
              >
                <ImageIcon className="mr-2" /> Create a Logo
              </button>
            </div>
          </div>
        </div>

        {/* Design Showcase Section */}
        <div className="w-full max-w-6xl bg-gray-900 rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white text-center">
            Unleash Your Creativity
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {designs.map((design, index) => (
              <div
                key={design.title}
                className={`w-48 h-48 ${design.color} rounded-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
                  index === activeDesign ? 'scale-110 shadow-lg' : 'scale-90 opacity-50'
                }`}
              >
                {design.icon}
                <span className="text-white font-bold mt-2">{design.title}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-white text-xl mb-6">
              From stunning layouts to eye-catching graphics, bring your vision to life with our powerful design tools.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105 animate-pulse">
              Start Designing Now
            </button>
          </div>
        </div>

        {/* Featured Blogs Section */}
 {/* Featured Blogs Section */}
<FeaturedBlogs blogs={blogs} />

      </div>
      <Footer />
    </>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white bg-opacity-20 rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
    <Icon size={40} className="text-yellow-600 mb-4" />
    <h3 className="text-black text-xl font-bold mb-2">{title}</h3>
    <p className="text-black text-sm">{description}</p>
  </div>
);

export default Home;