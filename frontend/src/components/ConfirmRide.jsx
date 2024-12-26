import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ConfirmRide = ({ 
    pickup, 
    destination, 
    fare, 
    vehicleType, 
    setConfirmRidePanel, 
    setVehicleFound, 
    createRide 
}) => {
    const [isLoading, setIsLoading] = useState(false);

    // Vehicle images mapping
    const vehicleImages = {
        car: "https://imgd.aeplcdn.com/600x337/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80",
        auto: "https://assets.tractorjunction.com/truck-junction/assets/images/truck/maxima-z-1671788932-0.webp",
        moto: "https://static.toiimg.com/photo/80452572.cms"
    };

    const handleConfirmRide = async () => {
        try {
            setIsLoading(true);
            await createRide();
            setVehicleFound(true);
            setConfirmRidePanel(false);
        } catch (error) {
            console.error('Failed to create ride:', error);
            // You might want to add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 relative max-w-md w-full mx-auto">
            {/* Close Button */}
            <button 
                className="absolute top-2 left-1/2 transform -translate-x-1/2 p-2 
                          hover:bg-gray-100 rounded-full transition-all duration-200"
                onClick={() => setConfirmRidePanel(false)}
                aria-label="Close panel"
            >
                <i className="text-3xl text-gray-300 hover:text-gray-400 ri-arrow-down-wide-line" />
            </button>

            <h3 className="text-2xl font-semibold mb-6 mt-4 text-center">
                Confirm your Ride
            </h3>

            <div className="flex flex-col items-center space-y-6">
                {/* Vehicle Image */}
                <div className="w-full h-40 rounded-lg overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        src={vehicleImages[vehicleType] || vehicleImages.car}
                        alt={`${vehicleType} vehicle`}
                        loading="lazy"
                    />
                </div>

                {/* Ride Details */}
                <div className="w-full space-y-2">
                    {/* Pickup Location */}
                    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                        <div className="text-blue-500">
                            <i className="ri-map-pin-user-fill text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Pickup Location</h3>
                            <p className="text-sm text-gray-600">{pickup}</p>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                        <div className="text-red-500">
                            <i className="text-xl ri-map-pin-2-fill" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Destination</h3>
                            <p className="text-sm text-gray-600">{destination}</p>
                        </div>
                    </div>

                    {/* Fare Details */}
                    <div className="flex items-center gap-4 p-4">
                        <div className="text-green-500">
                            <i className="text-xl ri-currency-line" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">
                                ₹{fare[vehicleType]}
                            </h3>
                            <p className="text-sm text-gray-600">Cash Payment</p>
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirmRide}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold
                              transition-all duration-200 
                              ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
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
                        'Confirm Ride'
                    )}
                </button>
            </div>
        </div>
    );
};

ConfirmRide.propTypes = {
    pickup: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    fare: PropTypes.object.isRequired,
    vehicleType: PropTypes.oneOf(['car', 'auto', 'moto']).isRequired,
    setConfirmRidePanel: PropTypes.func.isRequired,
    setVehicleFound: PropTypes.func.isRequired,
    createRide: PropTypes.func.isRequired
};

export default ConfirmRide;