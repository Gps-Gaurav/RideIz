import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import { motion } from 'framer-motion';
const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    // Socket connection handling
    const { socket, isConnected } = useContext(SocketContext);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        if (socket && user?._id) {
            // Join user to socket room
            const joinData = {
                userId: user._id,
                userType: 'user'  // or 'captain' based on your user type
            };

            console.log('Attempting to join with data:', joinData);
            
            socket.emit('join', joinData);

            // Listen for join confirmation
            socket.on('joined', (response) => {
                console.log('Join response:', response);
            });

            // Listen for errors
            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        // Cleanup listeners
        return () => {
            if (socket) {
                socket.off('joined');
                socket.off('error');
            }
        };
    }, [socket, user]);

    // Debug information
    console.log('Socket Status:', {
        isConnected,
        socketId: socket?.id,
        userId: user?._id
    });


    socket.on('ride-confirmed', ride => {


        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })
    const handleLogout = async () => {
        try {
            await UserLogout();
            // Additional cleanup if needed
            socket.disconnect();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


    }

    return (
        <div className='h-screen relative overflow-hidden bg-gray-50'>
            {/* Header */}
            <div className='absolute left-0 top-0 w-full p-5 z-20'>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo Container */}
                    <div className="flex-1">
                        <img 
                            className='w-16 h-16 object-contain'
                            src="https://res.cloudinary.com/gpsgaurav/image/upload/v1734026084/rideiz_dqchrq.png" 
                            alt="RideIz Logo" 
                        />
                    </div>

                    {/* User Info and Logout */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 bg-white px-5 py-3 rounded-full 
                                 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <i className="ri-user-line text-gray-600"></i>
                            </div>
                            <span className="text-sm font-medium hidden md:inline">
                                {user?.fullname?.firstname || 'User'}
                            </span>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <i className="ri-logout-box-r-line text-lg text-gray-600"></i>
                    </motion.button>
                </div>
            </div>

            {/* Map Container */}
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>

            {/* Main Content */}
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
                {/* Search Panel */}
                <div className='bg-white relative rounded-t-3xl shadow-lg'>
                    <div className='p-6'>
                        <motion.h5 
                            ref={panelCloseRef}
                            onClick={() => setPanelOpen(false)}
                            className='absolute opacity-0 right-6 top-6 w-8 h-8 flex items-center justify-center
                                     bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors'
                        >
                            <i className="ri-arrow-down-line"></i>
                        </motion.h5>

                        <h4 className='text-2xl font-bold mb-4'>Where to?</h4>

                        <form className='relative space-y-3' onSubmit={submitHandler}>
                            {/* Location Connection Line */}
                            <div className="absolute h-16 w-0.5 top-[50%] -translate-y-1/2 left-5 bg-gray-300">
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-500"></div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500"></div>
                            </div>

                            {/* Pickup Input */}
                            <div className="relative">
                                <input
                                    onClick={() => {
                                        setPanelOpen(true);
                                        setActiveField('pickup');
                                    }}
                                    value={pickup}
                                    onChange={handlePickupChange}
                                    className='w-full bg-gray-50 pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                             focus:outline-none focus:ring-2 focus:ring-black/5 transition-all
                                             text-gray-900 placeholder:text-gray-400'
                                    type="text"
                                    placeholder='Enter pickup location'
                                />
                                <i className="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-green-500"></i>
                            </div>

                            {/* Destination Input */}
                            <div className="relative">
                                <input
                                    onClick={() => {
                                        setPanelOpen(true);
                                        setActiveField('destination');
                                    }}
                                    value={destination}
                                    onChange={handleDestinationChange}
                                    className='w-full bg-gray-50 pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                             focus:outline-none focus:ring-2 focus:ring-black/5 transition-all
                                             text-gray-900 placeholder:text-gray-400'
                                    type="text"
                                    placeholder='Where to?'
                                />
                                <i className="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-red-500"></i>
                            </div>
                        </form>

                        {/* Find Trip Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={findTrip}
                            disabled={!pickup || !destination}
                            className={`w-full mt-4 py-3 px-6 rounded-xl font-medium text-white
                                      transition-all duration-300 ${
                                          (!pickup || !destination)
                                          ? 'bg-gray-300 cursor-not-allowed'
                                          : 'bg-black hover:bg-gray-800'
                                      }`}
                        >
                            Find Trip
                        </motion.button>
                    </div>
                </div>

                {/* Location Search Panel */}
                <div ref={panelRef} className='bg-white h-0 overflow-hidden'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {/* Sliding Panels */}
            <motion.div 
                ref={vehiclePanelRef}
                className='fixed w-full z-30 bottom-0 translate-y-full bg-white rounded-t-3xl overflow-hidden shadow-xl'
            >
                <VehiclePanel {...{ selectVehicle: setVehicleType, fare, setConfirmRidePanel, setVehiclePanel }} />
            </motion.div>

            <motion.div 
                ref={confirmRidePanelRef}
                className='fixed w-full z-30 bottom-0 translate-y-full bg-white rounded-t-3xl overflow-hidden shadow-xl'
            >
                <ConfirmRide
                    {...{ createRide, pickup, destination, fare, vehicleType, setConfirmRidePanel, setVehicleFound }}
                />
            </motion.div>

            <motion.div 
                ref={vehicleFoundRef}
                className='fixed w-full z-30 bottom-0 translate-y-full bg-white overflow-hidden rounded-t-3xl shadow-xl'
            >
                <LookingForDriver
                    {...{ createRide, pickup, destination, fare, vehicleType, setVehicleFound }}
                />
            </motion.div>

            <motion.div 
                ref={waitingForDriverRef}
                className='fixed w-full z-30 bottom-0 translate-y-full bg-white overflow-hidden rounded-t-3xl shadow-xl'
            >
                <WaitingForDriver
                    {...{ ride, setVehicleFound, setWaitingForDriver, waitingForDriver }}
                />
            </motion.div>
        </div>
        
    );
};

export default Home;