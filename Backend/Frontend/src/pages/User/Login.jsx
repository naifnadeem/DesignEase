import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../component/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (email === '' || password === '') {
      setMessage('');
      setError('Please fill in all fields');
      return;
    }
    try {
      setError('');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.token) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Store user data
        const userData = {
          _id: data._id,
          username: data.username,
          email: data.email,
          profilePic: data.profilePic,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Stored user data:', userData);
        
        setMessage('Login successful! Redirecting...');
        setError('');
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1000);
      } else {
        setError(data.message || 'Invalid email or password');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-screen bg-gradient-to-br from-blue-700 via-blue-900 to-blue-900 flex justify-center items-center relative overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute w-32 h-32 bg-white opacity-20 rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-40 h-40 bg-white opacity-20 rounded-full bottom-20 right-20 animate-pulse"></div>

        {/* Login Form */}
        <div className="container mx-auto p-8 md:p-16 bg-gradient-to-br  bg-opacity-100 max-w-md md:max-w-lg lg:max-w-xl rounded-2xl flex flex-col justify-center items-center shadow-2xl">
          <h2 className="text-white text-4xl font-extrabold mb-6 text-center">Welcome Back</h2>
          
          {message && <div className="text-green-500 mb-4">{message}</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-4">
            <div className="w-full">
              <label htmlFor="email" className="block text-gray-300 text-sm mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="block text-gray-300 text-sm mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>
            
            <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg w-full font-bold hover:bg-blue-600 transition-all duration-300 ease-in-out">
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <p className="text-gray-400 text-sm">Don't have an account? <a href="/Signup" className="text-blue-400 hover:underline">Signup here</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
