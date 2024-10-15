import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
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

const handleSubmit = async (event) => {
  event.preventDefault();
  const { email, password } = formData;

  if (email === '' || password === '') {
    setMessage('');
    setError('Please fill in all fields');
    return;
  }

  try {
    setError('');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
    
  const data = await response.json();
      console.log(data); 
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data));
        setMessage('Login successful! Redirecting...');
        setError('');
        setTimeout(() => {
          navigate('/AdminDashboard');
        }, 1000);
    } else {
      setError('Invalid email or password');
      setTimeout(() => {
        setError('');
      }, 1000);
    }
  } catch (error) {
    console.error(error); // Log any errors
    setError(error.message);
    setTimeout(() => {
      setError('');
    }, 1000);
  }
};

  
  return (
    <div className="w-full h-screen bg-sign-up bg-cover bg-center flex justify-center items-center">
      <div className="container mx-auto p-4 pt-6 md:p-12 lg:p-28 bg-black bg-opacity-50 max-w-md md:max-w-lg lg:max-w-xl rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-white text-3xl font-bold mb-3 text-center">Admin Login</h2>

        {message && <div className="text-green-500 mb-4">{message}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
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

          <button type="submit" className="bg-white text-black p-2 rounded-full h-11 w-32 hover:bg-black hover:text-white">
            Login
          </button>
        </form>
        <div className="mt-4">
          <p className="text-white text-sm">Don't have an account? <a href="/Signup" className="text-blue-400 hover:underline">Signup here</a></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
