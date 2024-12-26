import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';
import { motion } from 'framer-motion';

const CaptainLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`, 
        formData
      );

      if (response.status === 200) {
        const { captain, token } = response.data;
        setCaptain(captain);
        localStorage.setItem('token', token);
        navigate('/captain-home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto p-8 min-h-screen flex flex-col justify-between">
        <div className="space-y-8">
          {/* Logo and Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              className="w-24 h-24 object-contain" 
              src="https://res.cloudinary.com/gpsgaurav/image/upload/v1734026084/rideiz_dqchrq.png" 
              alt="RideIz Logo" 
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Captain
            </h1>
            <p className="text-gray-600">
              Sign in to start accepting rides
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 
                          focus:ring-2 focus:ring-black focus:border-transparent
                          transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 
                          focus:ring-2 focus:ring-black focus:border-transparent
                          transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            <div className="pt-2">
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
            </div>

            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-black hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Registration Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Want to join our fleet?{' '}
              <Link 
                to="/captain-signup" 
                className="text-black font-medium hover:underline"
              >
                Register as a Captain
              </Link>
            </p>
          </div>
        </div>

        {/* User Login Link */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-white to-gray-50 text-gray-500">
                or
              </span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full py-3 px-4 rounded-xl bg-[#004e52] text-white 
                       font-medium text-center transition-all duration-200
                       hover:bg-[#003b3e] active:transform active:scale-[0.99]"
          >
            Sign in as Passenger
          </Link>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;