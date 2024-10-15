// AdminSignup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' // add a role field to distinguish admin accounts
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/signup`, formData);
      setMessage('Admin account created successfully! Redirecting to Admin Dashboard');
      setError('');
      setTimeout(() => {
        setMessage('');
        navigate('/AdminDashboard');
      }, 3000);
    } catch (error) {
      setError('Error creating admin account: ' + error.response.data.message);
      setMessage('');
      setTimeout(() => {
        setError('');
      }, 10000);
    }
  };

  return (
    <div className="w-full h-screen bg-sign-up bg-cover bg-center flex justify-center items-center">
      <div className="container mx-auto p-4 pt-6 md:p-12 lg:p-28 bg-black bg-opacity-50 max-w-md md:max-w-lg lg:max-w-xl rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-white text-3xl mb-10 font-bold text-center">Create Admin Account</h2>

        {message && <div className="text-green-500 mb-4">{message}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="w-full mb-4">
            <label htmlFor="username" className="block text-white text-sm mb-2 text-left">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black focus:outline-none"
              required
            />
          </div>
          <div className="w-full mb-4">
            <label htmlFor="email" className="block text-white text-sm mb-2 text-left">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black focus:outline-none"
              required
            />
          </div>
          <div className="w-full mb-4">
            <label htmlFor="password" className="block text-white text-sm mb-2 text-left">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black focus:outline-none"
              required
              minLength="6"
            />
          </div>
          <div className="w-full mb-4">
            <label htmlFor="confirmPassword" className="block text-white text-sm mb-2 text-left">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black focus:outline-none"
              required
              minLength="8"
            />
          </div>
          <button type="submit" className="bg-white text-black p-1 mt-5 h-10 w-full rounded-full  hover:bg-black hover:text-white">
            Create Admin Account
          </button>
        </form>
        <div className="mt-4">
          <p className="text-white text-sm">Already have an admin account? <a href="/AdminLogin" className="text-blue-400 hover:underline">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;