import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Download, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const SavedTemplatesAndLogos = () => {
  const [invoices, setInvoices] = useState([]);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesResponse, logosResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/templates`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/logos`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          })
        ]);
        setInvoices(invoicesResponse.data);
        setLogos(logosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (item, type) => {
    console.log(`Edit ${type}:`, item);
    toast.info(`Editing ${type}: ${item.name}`);
  };

  const handleDownload = (item) => {
    const link = document.createElement('a');
    link.href = item.image || item.thumbnail;
    link.download = `${item.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded: ${item.name}`);
  };

  const openFullSize = (item) => {
    setSelectedItem(item);
  };

  const closeFullSize = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  const renderGrid = (items, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {items.map((item) => (
        <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <figure className="px-10 pt-10">
            <img
              src={item.image || item.thumbnail || 'https://via.placeholder.com/400x200'}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x200';
              }}
            />
          </figure>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
            <div className="flex justify-between mb-4">
              <button onClick={() => handleEdit(item, type)} className="btn bg-blue-500 text-white hover:bg-blue-600 btn-sm">
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => handleDownload(item)} className="btn bg-green-500 text-white hover:bg-green-600 btn-sm">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
    <div className="min-h-screen bg-hero-pattern py-12 px-4 sm:px-6 lg:px-8">
      <Navbar userType="user" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Saved Templates and Logos</h1>

        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Saved Invoices</h2>
          {renderGrid(invoices, 'invoice')}
        </section>
        
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-6">Saved Logos</h2>
          {renderGrid(logos, 'logo')}
        </section>
      </div>

      {selectedItem && (
        <div className="modal modal-open">
          <div className="modal-box relative bg-gray-900 rounded-lg">
            <button onClick={closeFullSize} className="btn btn-sm btn-circle absolute right-2 top-2">
              <X />
            </button>
            <img
              src={selectedItem.image || selectedItem.thumbnail}
              alt={selectedItem.name}
              className="w-full h-auto object-contain mb-4"
            />
            <h3 className="font-bold text-lg text-white">{selectedItem.name}</h3>
            <div className="modal-action">
              <button
                onClick={() => handleDownload(selectedItem)}
                className="btn bg-blue-500 text-white hover:bg-blue-600"
              >
                <Download size={20} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
    <Footer/>
    
    
    </>
    
    
  );
};

export default SavedTemplatesAndLogos;