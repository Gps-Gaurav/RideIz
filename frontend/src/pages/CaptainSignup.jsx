import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const CaptainSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    vehicle: {
      color: '',
      plate: '',
      capacity: '',
      type: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setCaptain } = React.useContext(CaptainDataContext);

  const handleInputChange = (e, category = null) => {
    const { name, value } = e.target;
    setError(null);

    if (category === 'vehicle') {
      setFormData(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const captainData = {
        fullname: {
          firstname: formData.firstName,
          lastname: formData.lastName
        },
        email: formData.email,
        password: formData.password,
        vehicle: {
          color: formData.vehicle.color,
          plate: formData.vehicle.plate,
          capacity: formData.vehicle.capacity,
          vehicleType: formData.vehicle.type
        }
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`, 
        captainData
      );

      if (response.status === 201) {
        const { captain, token } = response.data;
        setCaptain(captain);
        localStorage.setItem('token', token);
        navigate('/captain-home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto p-8 min-h-screen flex flex-col justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <img 
              className="w-20 h-20 object-contain" 
              src="https://res.cloudinary.com/gpsgaurav/image/upload/v1734026084/rideiz_dqchrq.png" 
              alt="RideIz Logo" 
            />
            <h1 className="text-3xl font-bold">Captain Registration</h1>
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

          {/* Registration Form */}
          <form onSubmit={submitHandler} className="space-y-8">
            {/* Personal Information Section */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                              focus:ring-2 focus:ring-black focus:border-transparent
                              transition-all duration-200"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                              focus:ring-2 focus:ring-black focus:border-transparent
                              transition-all duration-200"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Email & Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    placeholder="Create strong password"
                  />
                </div>
              </div>
            </section>

            {/* Vehicle Information Section */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Vehicle Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={formData.vehicle.color}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                              focus:ring-2 focus:ring-black focus:border-transparent
                              transition-all duration-200"
                    placeholder="Enter vehicle color"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="plate"
                    required
                    value={formData.vehicle.plate}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                              focus:ring-2 focus:ring-black focus:border-transparent
                              transition-all duration-200"
                    placeholder="Enter plate number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    required
                    value={formData.vehicle.capacity}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                              focus:ring-2 focus:ring-black focus:border-transparent
                              transition-all duration-200"
                    placeholder="Enter capacity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    name="type"
                    required
                    value={formData.vehicle.type}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                              focus:ring-2 focus:ring-black focus:border-transparent
                              transition-all duration-200"
                  >
                    <option value="">Select type</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="moto">Moto</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg
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
                  Creating account...
                </span>
              ) : 'Create Captain Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/captain-login" 
              className="text-black font-medium hover:underline"
            >
              Sign in as Captain
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-xs text-gray-500 text-center">
            This site is protected by reCAPTCHA and the{' '}
            <a href="#" className="underline">Google Privacy Policy</a> and{' '}
            <a href="#" className="underline">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;