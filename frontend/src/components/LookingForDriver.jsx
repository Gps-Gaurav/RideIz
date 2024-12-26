import React from 'react';
import PropTypes from 'prop-types';

const LookingForDriver = ({ 
    pickup, 
    destination, 
    fare, 
    vehicleType, 
    setVehicleFound 
}) => {
    // Vehicle images mapping
    const vehicleImages = {
        car: "https://imgd.aeplcdn.com/600x337/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80",
        auto: "https://assets.tractorjunction.com/truck-junction/assets/images/truck/maxima-z-1671788932-0.webp",
        moto: "https://static.toiimg.com/photo/80452572.cms"
    };

    return (
        <div className="bg-white rounded-lg p-6 relative max-w-md w-full mx-auto shadow-lg">
            {/* Close Button */}
            <button 
                className="absolute top-2 left-1/2 transform -translate-x-1/2 p-2 
                          hover:bg-gray-100 rounded-full transition-all duration-200"
                onClick={() => setVehicleFound(false)}
                aria-label="Close panel"
            >
                <i className="text-3xl text-gray-300 hover:text-gray-400 ri-arrow-down-wide-line" />
            </button>

            {/* Header with Loading Animation */}
            <div className="text-center mb-6 mt-4">
                <h3 className="text-2xl font-semibold mb-2">
                    Looking for a Driver
                </h3>
                {/* Pulse Animation */}
                <div className="flex justify-center items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
                {/* Vehicle Image with Shimmer Effect */}
                <div className="relative w-full h-40 rounded-lg overflow-hidden shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                  animate-shimmer"></div>
                    <img
                        className="w-full h-full object-cover"
                        src={vehicleImages[vehicleType] || vehicleImages.car}
                        alt={`${vehicleType} vehicle`}
                        loading="lazy"
                    />
                </div>

                {/* Ride Details */}
                <div className="w-full space-y-4">
                    {/* Pickup Location */}
                    <div className="flex items-center gap-4 p-4 border-b border-gray-200
                                  hover:bg-gray-50 transition-colors duration-200">
                        <div className="text-blue-500">
                            <i className="text-xl ri-map-pin-user-fill" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Pickup Location</h3>
                            <p className="text-sm text-gray-600">{pickup}</p>
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
                            <p className="text-sm text-gray-600">{destination}</p>
                        </div>
                    </div>

                    {/* Fare Details */}
                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 
                                  transition-colors duration-200">
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

                {/* Circular Loading Animation */}
                <div className="flex justify-center items-center mt-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute border-4 border-gray-200 rounded-full w-full h-full"></div>
                        <div className="absolute border-4 border-yellow-400 rounded-full w-full h-full 
                                      animate-spin border-t-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LookingForDriver.propTypes = {
    pickup: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    fare: PropTypes.object.isRequired,
    vehicleType: PropTypes.oneOf(['car', 'auto', 'moto']).isRequired,
    setVehicleFound: PropTypes.func.isRequired
};

// Add custom animation to tailwind.config.js
const customAnimations = {
    shimmer: {
        '100%': {
            transform: 'translateX(100%)'
        }
    }
};

export default LookingForDriver;