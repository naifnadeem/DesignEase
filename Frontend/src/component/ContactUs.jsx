import React from 'react';
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'; // Importing social icons
import Navbar from './Navbar';
import Footer from './Footer';

const ContactUs = () => {
  return (
    <>
      <Navbar userType="user" />
      <div className="bg-hero-pattern">
        <div className="w-full min-h-screen bg-hero-pattern text-white flex items-center justify-center py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Text Section */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl mb-8 leading-relaxed animate-fadeIn">
                We would love to hear from you! Whether you have questions, feedback, or suggestions, feel free to reach out to us using the form below.
              </p>
              <p className="text-lg md:text-xl leading-relaxed animate-fadeIn">
                Our team is dedicated to providing you with the best support possible. Let us help you with any inquiries or concerns you may have.
              </p>

              {/* Social Media Icons Section */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold mb-4">Connect with Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Facebook size={28} /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Twitter size={28} /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Instagram size={28} /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Linkedin size={28} /></a>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="relative">
              <form 
                action="#" 
                className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
              >
                <Typography variant="h6" className="text-gray-900 mb-4">
                  Contact Form
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="small" className="mb-2 text-left font-medium">
                      First Name
                    </Typography>
                    <Input 
                      color="blue" 
                      size="lg" 
                      placeholder="First Name" 
                      className="transition-transform transform focus:scale-105 duration-300" 
                    />
                  </div>
                  <div>
                    <Typography variant="small" className="mb-2 text-left font-medium">
                      Last Name
                    </Typography>
                    <Input 
                      color="blue" 
                      size="lg" 
                      placeholder="Last Name" 
                      className="transition-transform transform focus:scale-105 duration-300" 
                    />
                  </div>
                </div>
                <div>
                  <Typography variant="small" className="mb-2 text-left font-medium">
                    Your Email
                  </Typography>
                  <Input 
                    color="blue" 
                    size="lg" 
                    placeholder="name@email.com" 
                    className="transition-transform transform focus:scale-105 duration-300" 
                  />
                </div>
                <div>
                  <Typography variant="small" className="mb-2 text-left font-medium">
                    Your Message
                  </Typography>
                  <Textarea 
                    rows={6} 
                    color="blue" 
                    placeholder="Message" 
                    className="transition-transform transform focus:scale-105 duration-300"
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all transform hover:scale-105 duration-300"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Section */}
        <div className="w-full text-white py-16 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeIn">
            We're Here to Help
          </h2>
          <p className="text-lg md:text-xl text-white max-w-4xl mx-auto mb-6 leading-relaxed animate-fadeIn">
            Our dedicated support team is always ready to assist you. Reach out for any questions, suggestions, or concerns.
          </p>
          <p className="text-lg md:text-xl text-white max-w-4xl mx-auto leading-relaxed animate-fadeIn">
            We look forward to hearing from you!
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
