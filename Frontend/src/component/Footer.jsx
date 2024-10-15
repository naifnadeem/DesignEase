import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">DesignEase</h3>
            <p className="text-gray-400">Empowering creativity through intuitive design tools.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-yellow-500 transition-colors">Home</a></li>
              <li><a href="/services" className="hover:text-yellow-500 transition-colors">Services</a></li>
              <li><a href="/pricing" className="hover:text-yellow-500 transition-colors">Pricing</a></li>
              <li><a href="/contact" className="hover:text-yellow-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              <li><a href="/logo-maker" className="hover:text-yellow-500 transition-colors">Logo Maker</a></li>
              <li><a href="/invoice-creator" className="hover:text-yellow-500 transition-colors">Invoice Creator</a></li>
              <li><a href="/brand-templates" className="hover:text-yellow-500 transition-colors">Brand Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-500 transition-colors"><Facebook size={24} /></a>
              <a href="#" className="hover:text-yellow-500 transition-colors"><Twitter size={24} /></a>
              <a href="#" className="hover:text-yellow-500 transition-colors"><Instagram size={24} /></a>
              <a href="#" className="hover:text-yellow-500 transition-colors"><Linkedin size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2024 DesignEase. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/privacy-policy" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Privacy Policy</a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;