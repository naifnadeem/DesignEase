import React from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

const AboutUs = () => {
  return (
    <>
      <Navbar userType="user" />
      <div className="bg-hero-pattern">
      <div className="w-full min-h-screen  text-white flex items-center justify-center py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Text Section */}
          <div className="flex flex-col justify-center transform transition-transform duration-500 hover:scale-105">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
              About Us
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed animate-fadeIn">
              We are a team of passionate developers who believe in creating
              engaging and effective user experiences. Our team of experts has
              years of experience in various fields, including web development,
              product management, and digital marketing. We have a deep
              understanding of the latest technologies and trends, and we are
              always looking for ways to improve our services.
            </p>
            <p className="text-lg md:text-xl leading-relaxed animate-fadeIn">
              With a focus on innovation and creativity, we aim to deliver
              results that exceed expectations and create lasting value for our
              clients. Join us on this exciting journey as we continue to push
              the boundaries of technology and design!
            </p>
          </div>

          {/* Image Section */}
          <div className="relative transform transition-transform duration-500 hover:scale-105">
            <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
              <img
                src="/src/assets/images/adminProfilePic.png"
                alt="Team working on code"
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Section */}
      <div className="w-full py-16 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeIn">
          Our Mission
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-6 leading-relaxed animate-fadeIn">
          Our mission is to create seamless, intuitive, and visually stunning
          user experiences that help brands stand out and achieve their goals.
          We are committed to delivering high-quality solutions by staying
          ahead of the curve in terms of both technology and design trends.
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fadeIn">
          We are not just developers; we are problem solvers, innovators, and
          creatives dedicated to pushing the boundaries of what’s possible.
        </p>
      </div>
      </div>
    
      <Footer />
    </>
  );
};

export default AboutUs;
