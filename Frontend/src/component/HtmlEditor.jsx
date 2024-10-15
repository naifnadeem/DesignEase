import React, { useEffect, useState, useRef } from 'react';
import { tableLogic, saveTemplate } from '../component/assets/js/tableLogic';
import '../component/assets/css/style.css';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

const HtmlEditorWithJS = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    const storedHtmlContent = localStorage.getItem('htmlContent');
    const storedLogo = localStorage.getItem('logoUrl');
    if (storedHtmlContent) {
      setHtmlContent(storedHtmlContent);
    }
    if (storedLogo) {
      const logoElement = contentRef.current?.querySelector('#logoImage');
      if (logoElement) {
        logoElement.src = storedLogo;
      }
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoElement = contentRef.current?.querySelector('#logoImage');
        if (logoElement) {
          logoElement.src = reader.result;
          logoElement.style.width = '100px';
          logoElement.style.height = '100px';
          localStorage.setItem('logoUrl', reader.result);
          toast.success('Logo uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const tableElement = contentRef.current.querySelector('#sortableTable');
      if (tableElement) {
        tableLogic();
      }

      const saveButton = contentRef.current.querySelector('.print_btn');
      if (saveButton) {
        saveButton.addEventListener('click', () => {
          saveTemplate();
          toast.success('Template saved successfully!');
        });
      }

      const logoUploadInput = contentRef.current.querySelector('#logoUpload');
      if (logoUploadInput) {
        logoUploadInput.addEventListener('change', handleLogoUpload);
      }
    }

    return () => {
      const saveButton = contentRef.current?.querySelector('.print_btn');
      if (saveButton) {
        saveButton.removeEventListener('click', saveTemplate);
      }

      const logoUploadInput = contentRef.current?.querySelector('#logoUpload');
      if (logoUploadInput) {
        logoUploadInput.removeEventListener('change', handleLogoUpload);
      }
    };
  }, [htmlContent]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar userType="user" />

      <div className="container mx-auto p-5" ref={contentRef}>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center text-2xl font-bold text-primary mb-4">Invoice Editor</h2>
            <p className="text-center text-secondary mb-6">Easily edit your Invoice. Click on the text to get started.</p>

            <div className="form-control w-full max-w-xs mx-auto mb-6">
              <label htmlFor="logoUpload" className="label">
                <span className="label-text">Upload Logo</span>
              </label>
              <input type="file" id="logoUpload" className="file-input file-input-bordered file-input-primary w-full max-w-xs" accept="image/*" />
            </div>

            <div id="html-content" className="border rounded p-4 bg-base-200 min-h-[300px]" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
      <Footer/>
    </div>
  );
};

export default HtmlEditorWithJS;