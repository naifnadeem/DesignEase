import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
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
    setMessage(''); // Clear previous messages
    setError(''); // Clear previous errors

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      setMessage('User registered successfully! Redirecting to Login');
      
      setTimeout(() => {
        navigate('/login'); // Redirect after success
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <div className="w-full h-screen bg-sign-up bg-cover bg-center flex justify-center items-center">
      <div className="container mx-auto p-4 pt-6 md:p-12 lg:p-28 bg-black bg-opacity-50 max-w-md md:max-w-lg lg:max-w-xl rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-white text-3xl font-bold text-center">Create an Account</h2>

        {message && <div className="text-green-500 mb-4" aria-live="polite">{message}</div>}
        {error && <div className="text-red-500 mb-4" aria-live="assertive">{error}</div>}

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
              minLength="8" // Keep this for frontend validation
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
          <div className="w-full mb-4">
            <label htmlFor="gender" className="block text-white text-sm mb-2 text-left">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black focus:outline-none"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button type="submit" className="bg-white text-black p-2 rounded-full h-11 w-32 hover:bg-black hover:text-white">
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <p className="text-white text-sm">Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
