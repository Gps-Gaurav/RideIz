import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = ({ isOnline }) => {
    const { captain } = useContext(CaptainDataContext)

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <div className='relative'>
                        <img 
                            className='h-10 w-10 rounded-full object-cover' 
                            src="https://www.pngitem.com/pimgs/m/750-7506356_transparent-human-icon-png-png-download.png" 
                            alt="" 
                        />
                        {/* Online/Offline indicator */}
                        <span 
                            className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                                isOnline ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        />
                    </div>
                    <div>
                        <h4 className='text-lg font-medium capitalize'>
                            {captain.fullname.firstname + " " + captain.fullname.lastname}
                        </h4>
                        <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                            {isOnline ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹295.20</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails