import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const VehicleCard = ({ 
    type, 
    image, 
    name, 
    capacity, 
    waitTime, 
    description, 
    fare, 
    onSelect 
}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <button
            onClick={onSelect}
            className="w-full group transition-all duration-200 ease-in-out mb-3"
            aria-label={`Select ${name}`}
        >
            <div className="flex border-2 rounded-xl p-4 items-center justify-between
                          hover:border-gray-400 hover:shadow-md active:border-black">
                {/* Vehicle Image */}
                <div className="h-10 w-16">
                    <img 
                        className="h-full w-full object-contain"
                        src={imageError ? 'https://via.placeholder.com/150?text=Vehicle' : image} 
                        alt={name}
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* Vehicle Details */}
                <div className="flex-1 px-4">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-base">{name}</h4>
                        <span className="flex items-center text-sm text-gray-600">
                            <i className="ri-user-3-fill mr-1" />
                            {capacity}
                        </span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-600">
                        {waitTime} mins away
                    </h5>
                    <p className="font-normal text-xs text-gray-600">
                        {description}
                    </p>
                </div>

                {/* Fare */}
                <div className="text-right">
                    <h2 className="text-lg font-semibold">
                        ₹{typeof fare === 'number' ? fare.toFixed(2) : 'N/A'}
                    </h2>
                </div>
            </div>
        </button>
    );
};

VehicleCard.propTypes = {
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    waitTime: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    fare: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired
};

const VehiclePanel = ({ 
    setVehiclePanel, 
    setConfirmRidePanel, 
    selectVehicle, 
    fare 
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!fare || typeof fare !== 'object') {
            setError('Invalid fare data');
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }, [fare]);

    const vehicles = [
        {
            type: 'car',
            image: "https://imgd.aeplcdn.com/600x337/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80",
            name: "UberGo",
            capacity: 4,
            waitTime: 2,
            description: "Affordable, compact rides",
            fare: fare?.car
        },
        {
            type: 'moto',
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
            name: "Moto",
            capacity: 1,
            waitTime: 3,
            description: "Affordable motorcycle rides",
            fare: fare?.moto
        },
        {
            type: 'auto',
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
            name: "UberAuto",
            capacity: 3,
            waitTime: 3,
            description: "Affordable Auto rides",
            fare: fare?.auto
        }
    ];

    const handleVehicleSelect = (type) => {
        if (selectVehicle && typeof selectVehicle === 'function') {
            selectVehicle(type);
            setConfirmRidePanel(true);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            {/* Close Button */}
            <div className="relative mb-6">
                <h5 className="p-1 text-center w-[93%] absolute top-0" 
                    onClick={() => setVehiclePanel(false)}>
                    <i className="text-3xl text-gray-200 ri-arrow-down-wide-line cursor-pointer"></i>
                </h5>
            </div>

            {/* Header */}
            <h3 className="text-2xl font-semibold mb-5 mt-8 text-center">
                Choose a Vehicle
            </h3>

            {/* Vehicle List */}
            <div>
                {vehicles.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.type}
                        {...vehicle}
                        onSelect={() => handleVehicleSelect(vehicle.type)}
                    />
                ))}
            </div>

            {/* Best Price Guarantee */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 flex items-center">
                    <i className="ri-shield-check-line mr-2" />
                    Best price guarantee • No hidden charges
                </p>
            </div>
        </div>
    );
};

VehiclePanel.propTypes = {
    setVehiclePanel: PropTypes.func.isRequired,
    setConfirmRidePanel: PropTypes.func.isRequired,
    selectVehicle: PropTypes.func.isRequired,
    fare: PropTypes.shape({
        car: PropTypes.number.isRequired,
        moto: PropTypes.number.isRequired,
        auto: PropTypes.number.isRequired
    }).isRequired
};

export default VehiclePanel;