import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'text/html'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPEG, PNG, SVG, MP4, and HTML files are allowed');
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('File size exceeds the maximum limit of 10MB');
      return;
    }

    setFile(selectedFile);
    setUploaded(false);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError(null);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploading(false);
      setUploaded(true);
    } catch (err) {
      setUploading(false);
      setError("File upload failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Media</h2>
      <form className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG, MP4 or HTML (MAX. 10MB)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full ${
            !file || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded-lg transition duration-300`}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      {uploaded && !uploading && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <p>File uploaded successfully!</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;