import React, { useEffect, useState } from "react";
import axios from "axios";
import { Image, Video, FileText, Loader, ExternalLink } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingHtml, setLoadingHtml] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/images`);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoadingImages(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/videos`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };
    
    const fetchHtml = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/html`);
        setHtmlFiles(response.data);
      } catch (error) {
        console.error("Error fetching HTML files:", error);
      } finally {
        setLoadingHtml(false);
      }
    };

    fetchImages();
    fetchVideos();
    fetchHtml();
  }, []);

  if (loadingImages || loadingVideos || loadingHtml) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const MediaCard = ({ type, src, alt, filename }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        {type === 'image' && (
          <img src={src} alt={alt} className="w-full h-48 object-cover rounded" />
        )}
        {type === 'video' && (
          <video controls className="w-full h-48 object-cover rounded">
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {type === 'html' && (
          <img src={src} alt={alt} className="w-full h-48 object-cover rounded" />
        )}
      </div>
      <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
        <span className="text-sm text-gray-600 truncate flex-1">{filename}</span>
        {type === 'image' && <Image size={20} className="text-blue-600" />}
        {type === 'video' && <Video size={20} className="text-blue-600" />}
        {type === 'html' && <FileText size={20} className="text-blue-600" />}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Media Gallery</h2>
      
      {/* Images Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <MediaCard
              key={index}
              type="image"
              src={`${import.meta.env.VITE_API_URL}/uploads/images/${image}`}
              alt={`Uploaded image ${index}`}
              filename={image}
            />
          ))}
        </div>
      </div>

      {/* Videos Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <MediaCard
              key={index}
              type="video"
              src={`${import.meta.env.VITE_API_URL}/uploads/videos/${video}`}
              filename={video}
            />
          ))}
        </div>
      </div>

      {/* HTML Files Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">HTML Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {htmlFiles.map((htmlFile, index) => (
            <MediaCard
              key={index}
              type="html"
              src={`${import.meta.env.VITE_API_URL}/uploads/html/${htmlFile.file}.png`}
              alt={`Thumbnail for ${htmlFile.file}`}
              filename={htmlFile.file}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;