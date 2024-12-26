import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RidePopUp = ({ 
    ride, 
    setRidePopupPanel, 
    setConfirmRidePopupPanel, 
    confirmRide 
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAcceptRide = async () => {
        try {
            setIsLoading(true);
            await confirmRide();
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error('Failed to accept ride:', error);
            // Add error handling UI if needed
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => setRidePopupPanel(false);

    return (
        <div className="bg-white rounded-lg p-6 relative max-w-md w-full mx-auto shadow-lg">
            {/* Close Button */}
            <button 
                className="absolute top-2 left-1/2 transform -translate-x-1/2 p-2 
                          hover:bg-gray-100 rounded-full transition-all duration-200"
                onClick={handleClose}
                aria-label="Close panel"
            >
                <i className="text-3xl text-gray-300 hover:text-gray-400 ri-arrow-down-wide-line" />
            </button>

            {/* Header */}
            <h3 className="text-2xl font-semibold mb-6 mt-4 text-center">
                New Ride Available!
            </h3>

            {/* User Info Card */}
            <div className="flex items-center justify-between p-4 bg-yellow-400 
                          rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-4">
                    <img 
                        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                        src={ride?.user?.profileImage || "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"}
                        alt={`${ride?.user?.fullname?.firstname}'s profile`}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                        }}
                    />
                    <div>
                        <h2 className="text-lg font-medium capitalize">
                            {`${ride?.user?.fullname?.firstname || ''} ${ride?.user?.fullname?.lastname || ''}`}
                        </h2>
                        <p className="text-sm text-gray-700">Passenger</p>
                    </div>
                </div>
                <div className="text-right">
                    <h5 className="text-lg font-semibold">2.2 KM</h5>
                    <p className="text-sm text-gray-700">Distance</p>
                </div>
            </div>

            {/* Ride Details */}
            <div className="mt-6 space-y-4">
                {/* Pickup Location */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200
                              hover:bg-gray-50 transition-colors duration-200">
                    <div className="text-blue-500">
                        <i className="text-xl ri-map-pin-user-fill" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Pickup Location</h3>
                        <p className="text-sm text-gray-600">{ride?.pickup}</p>
                    </div>
                </div>

                {/* Destination */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200
                              hover:bg-gray-50 transition-colors duration-200">
                    <div className="text-red-500">
                        <i className="text-xl ri-map-pin-2-fill" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Destination</h3>
                        <p className="text-sm text-gray-600">{ride?.destination}</p>
                    </div>
                </div>

                {/* Fare Details */}
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50 
                              transition-colors duration-200">
                    <div className="text-green-500">
                        <i className="text-xl ri-currency-line" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                        <p className="text-sm text-gray-600">Cash Payment</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
                <button
                    onClick={handleAcceptRide}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold
                              transition-all duration-200 
                              ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
                              }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </div>
                    ) : (
                        'Accept Ride'
                    )}
                </button>

                <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-lg font-semibold
                             bg-gray-200 text-gray-700 
                             hover:bg-gray-300 active:bg-gray-400
                             transition-all duration-200"
                >
                    Ignore
                </button>
            </div>
        </div>
    );
};

RidePopUp.propTypes = {
    ride: PropTypes.shape({
        user: PropTypes.shape({
            fullname: PropTypes.shape({
                firstname: PropTypes.string,
                lastname: PropTypes.string
            }),
            profileImage: PropTypes.string
        }),
        pickup: PropTypes.string,
        destination: PropTypes.string,
        fare: PropTypes.number
    }),
    setRidePopupPanel: PropTypes.func.isRequired,
    setConfirmRidePopupPanel: PropTypes.func.isRequired,
    confirmRide: PropTypes.func.isRequired
};

export default RidePopUp;