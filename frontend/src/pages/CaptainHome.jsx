import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride, setRide] = useState(null)
    const [isOnline, setIsOnline] = useState(false)
    const [locationInterval, setLocationInterval] = useState(null)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    // Toggle online/offline status
    const toggleOnlineStatus = () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);

        if (newStatus) {
            // Going online
            startLocationUpdates();
            socket.emit('captain-status', {
                captainId: captain._id,
                status: 'online'
            });
        } else {
            // Going offline
            stopLocationUpdates();
            socket.emit('captain-status', {
                captainId: captain._id,
                status: 'offline'
            });
        }
    };

    // Start location updates
    const startLocationUpdates = () => {
        if (navigator.geolocation) {
            // Initial location update
            updateLocation();
            
            // Set interval for continuous updates
            const interval = setInterval(updateLocation, 10000);
            setLocationInterval(interval);
        }
    };

    // Stop location updates
    const stopLocationUpdates = () => {
        if (locationInterval) {
            clearInterval(locationInterval);
            setLocationInterval(null);
        }
    };

    // Update location
    const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                socket.emit('update-location-captain', {
                    userId: captain._id,
                    location: {
                        ltd: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
            },
            error => {
                console.error('Geolocation error:', error);
            }
        );
    };

    // Initialize socket connection and events
    useEffect(() => {
        if (!socket || !captain?._id) return;

        // Join captain's room
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        // Listen for new rides
        const handleNewRide = (data) => {
            if (isOnline) {
                setRide(data);
                setRidePopupPanel(true);
            }
        };

        socket.on('new-ride', handleNewRide);

        // Cleanup
        return () => {
            stopLocationUpdates();
            socket.off('new-ride', handleNewRide);
        };
    }, [socket, captain, isOnline]);

    // Confirm ride handler
    const confirmRide = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                {
                    rideId: ride._id,
                    captainId: captain._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data) {
                socket.emit('ride-confirmed', {
                    rideId: ride._id,
                    captainId: captain._id
                });
                setRidePopupPanel(false);
                setConfirmRidePopupPanel(true);
            }
        } catch (error) {
            console.error('Error confirming ride:', error);
        }
    };

    // GSAP animations
    useGSAP(() => {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [ridePopupPanel]);

    useGSAP(() => {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [confirmRidePopupPanel]);

    return (
        <div className='h-screen relative'>
            {/* Online/Offline Toggle */}
            <div className='fixed top-20 right-5 z-50'>
                <button
                    onClick={toggleOnlineStatus}
                    className={`px-6 py-2 rounded-full font-medium text-white ${
                        isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img 
                    className='w-16' 
                    src="https://res.cloudinary.com/gpsgaurav/image/upload/v1734026084/rideiz_dqchrq.png" 
                    alt="logo" 
                />
                <Link 
                    to='/captain-home' 
                    className='h-10 w-10 bg-white flex items-center justify-center rounded-full'
                >
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-3/5'>
                <img 
                    className='h-full w-full object-cover' 
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
                    alt="map" 
                />
            </div>

            <div className='h-2/5 p-6'>
                <CaptainDetails isOnline={isOnline} />
            </div>

            <div 
                ref={ridePopupPanelRef} 
                className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            <div 
                ref={confirmRidePopupPanelRef} 
                className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;