import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import Footer from '../../component/Footer';

const Templates = () => {
  const [images, setImages] = useState([]);
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesResponse, htmlResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/images`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/html`)
        ]);
        setImages(imagesResponse.data);
        setHtmlFiles(htmlResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openEditor = (image) => {
    localStorage.setItem('selectedImage', image);
    window.open('/Editor', '_blank');
  };

  const handleHtmlClick = async (fileName) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/uploads/html/${fileName}`);
      localStorage.setItem('htmlContent', response.data);
      window.open('/HtmlEditor', '_blank');
    } catch (error) {
      console.error('Error fetching HTML content:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar userType="user" />
      <div className="bg-hero-pattern min-h-screen py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-12">Design Templates</h1>
          
          {/* Invoice Templates Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Invoice Templates</h2>
              <div className="badge badge-primary badge-outline">{htmlFiles.length} templates</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {htmlFiles.map((htmlFile, index) => (
                <div key={index} className="card bg-gray-800 shadow-xl hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
                  <figure className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/html/${htmlFile.file}.png`}
                      alt={`Template ${htmlFile.file}`}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                  <h3 className="card-title text-lg text-white">{htmlFile.file.replace('.html', '')}</h3>
                    <div className="card-actions justify-end mt-2">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleHtmlClick(htmlFile.file)}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Logo Templates Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Logo Templates</h2>
              <div className="badge badge-secondary badge-outline">{images.length} templates</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <div key={index} className="card bg-gray-800 shadow-xl hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
                  <figure className="relative pt-[100%]"> {/* 1:1 aspect ratio */}
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/images/${image}`}
                      alt={`Logo template ${index + 1}`}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg text-white">Logo Template {index + 1}</h3>
                    <div className="card-actions justify-end mt-2">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditor(image)}
                      >
                        Edit Logo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Templates;