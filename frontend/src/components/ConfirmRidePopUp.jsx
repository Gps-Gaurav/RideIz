import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmRidePopUp = ({ ride, setConfirmRidePopupPanel, setRidePopupPanel }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Form validation
    const isValidOtp = (otp) => {
        return otp.length === 6 && /^\d+$/.test(otp);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError('');

        // Validate OTP
        if (!isValidOtp(otp)) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                {
                    params: {
                        rideId: ride._id,
                        otp: otp
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                setConfirmRidePopupPanel(false);
                setRidePopupPanel(false);
                navigate('/captain-riding', { state: { ride } });
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 
                'Failed to start ride. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setConfirmRidePopupPanel(false);
        setRidePopupPanel(false);
    };

    return (
        <div className="relative bg-white p-4 rounded-lg shadow-lg">
            {/* Close Button */}
            <button 
                className="absolute top-2 left-1/2 transform -translate-x-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleClose}
                aria-label="Close panel"
            >
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line" />
            </button>

            <h3 className="text-2xl font-semibold mb-5 mt-8 text-center">
                Confirm this ride to Start
            </h3>

            {/* User Info Card */}
            <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg">
                <div className="flex items-center gap-3">
                    <img 
                        className="h-12 w-12 rounded-full object-cover"
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt={`${ride?.user.fullname.firstname}'s profile`}
                    />
                    <h2 className="text-lg font-medium capitalize">
                        {ride?.user.fullname.firstname}
                    </h2>
                </div>
                <h5 className="text-lg font-semibold">2.2 KM</h5>
            </div>

            {/* Ride Details */}
            <div className="mt-5 space-y-2">
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="ri-map-pin-user-fill text-blue-500" />
                    <div>
                        <h3 className="text-lg font-medium">Pickup Location</h3>
                        <p className="text-sm text-gray-600">{ride?.pickup}</p>
                    </div>
                </div>

                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="text-lg ri-map-pin-2-fill text-red-500" />
                    <div>
                        <h3 className="text-lg font-medium">Destination</h3>
                        <p className="text-sm text-gray-600">{ride?.destination}</p>
                    </div>
                </div>

                <div className="flex items-center gap-5 p-3">
                    <i className="ri-currency-line text-green-500" />
                    <div>
                        <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                        <p className="text-sm text-gray-600">Cash Payment</p>
                    </div>
                </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={submitHandler} className="mt-6">
                <div className="space-y-4">
                    <input
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length <= 6) setOtp(value);
                        }}
                        type="text"
                        className={`bg-gray-100 px-6 py-4 font-mono text-lg rounded-lg w-full 
                            focus:outline-none focus:ring-2 focus:ring-yellow-400
                            ${error ? 'border-2 border-red-500' : ''}`}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        pattern="\d{6}"
                        required
                    />

                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !isValidOtp(otp)}
                        className={`w-full text-lg flex justify-center items-center
                            ${loading || !isValidOtp(otp)
                                ? 'bg-gray-400'
                                : 'bg-green-600 hover:bg-green-700'}
                            text-white font-semibold p-3 rounded-lg transition-colors`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Confirm'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 
                            text-lg text-white font-semibold p-3 rounded-lg
                            transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConfirmRidePopUp;