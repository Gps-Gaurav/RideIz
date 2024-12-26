import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when user types
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`, 
        formData
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('token', token);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto p-8 h-screen flex flex-col justify-between">
        {/* Header Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              className="w-20 h-20 object-contain" 
              src="https://res.cloudinary.com/gpsgaurav/image/upload/v1734026084/rideiz_dqchrq.png" 
              alt="RideIz Logo" 
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome back
            </h2>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 
                          focus:ring-2 focus:ring-black focus:border-transparent
                          transition-all duration-200 text-gray-900
                          placeholder:text-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 
                          focus:ring-2 focus:ring-black focus:border-transparent
                          transition-all duration-200 text-gray-900
                          placeholder:text-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium
                         transition-all duration-200 ${
                           isLoading 
                           ? 'bg-gray-400 cursor-not-allowed' 
                           : 'bg-black hover:bg-gray-800 active:transform active:scale-[0.99]'
                         }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Captain Login Button */}
        <div className="mt-8">
          <Link
            to="/captain-login"
            className="block w-full py-3 px-4 rounded-xl bg-[#0050a0] 
                       text-white font-medium text-center
                       transition-all duration-200
                       hover:bg-[#003d7a] active:transform active:scale-[0.99]"
          >
            Sign in as Rider
          </Link>

          {/* Additional Info */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;