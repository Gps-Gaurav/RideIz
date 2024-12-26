import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Start = () => {
  useEffect(() => {
    // Animate elements on mount
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo('.logo-container', 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
    .fromTo('.content-container',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5'
    );
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://www.miniphysics.com/wp-content/uploads/2011/05/file-AYQMIHQeCrps7zXtPZbUT8Iv.webp)`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative h-screen flex flex-col justify-between z-10">
        {/* Logo Section */}
        <div className="logo-container pt-8 px-8 flex items-center gap-3">
        
          <span className="text-white text-2xl font-semibold">RideIz</span>
        </div>

        {/* Main Content */}
        <div className="content-container bg-white rounded-t-3xl shadow-lg">
          <div className="px-6 py-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Get Started with RideIz
            </h2>
            <p className="text-gray-600">
              Your trusted ride-sharing partner for safe and comfortable journeys.
            </p>
            
            {/* CTA Button */}
            <Link 
              to="/login"
              className="block w-full bg-black text-white py-4 rounded-xl
                         text-center font-medium text-lg
                         transition-all duration-300
                         hover:bg-gray-800 active:transform active:scale-[0.99]
                         focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Continue
            </Link>

            {/* Additional Links */}
            <div className="text-center text-sm text-gray-500">
              <p>
                By continuing, you agree to our{' '}
                <a href="#" className="text-black underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-black underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;