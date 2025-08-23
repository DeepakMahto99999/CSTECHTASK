import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const navigate = useNavigate()

    const logout = () => {
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
        navigate('/')
    }

    return (
        <div className='flex justify-between items-center px-6 sm:px-12 py-4 border-b bg-white '>
            
            {/* Logo + Role */}
            <div className='flex items-center gap-4'>
                <img
                    className='w-12 sm:w-24 cursor-pointer hover:scale-105 transition-transform duration-200'
                    src={assets.admin_logo}
                    alt="Logo"
                />
                <p className='border border-gray-300 px-3 py-1 rounded-full text-gray-700 font-medium bg-gray-50 shadow-sm'>
                    {aToken ? 'Admin' : 'Agent'}
                </p>
            </div>

            {/* Logout Button */}
            <button
                onClick={logout}
                className='bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-semibold text-sm px-6 sm:px-10 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105'
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar
