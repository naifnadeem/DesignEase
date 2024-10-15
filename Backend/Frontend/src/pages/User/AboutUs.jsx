import React from "react";
import Navbar from "../../component/Navbar";

const AboutUs = () => {
  return (
    <>
      <Navbar userType="user" />
      <div className="flex ">
        <div>
          <h1>About Us</h1>
          <p>
            We are a team of passionate developers who believe in creating
            engaging and effective user experiences. Our team of experts has
            years of experience in various fields, including web development,
            product management, and digital marketing. We have a deep
            understanding of the latest technologies and trends, and we are
            always looking for ways to improve our services.
          </p>

        </div>
        <div>
          <img src="https://source.unsplash.com/1600x900/?coding" alt="
          " />
          

        </div>
      </div>
    </>
  );
};

export default AboutUs;
