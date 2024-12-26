import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = async () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  } catch (error) {
    console.error('Logout failed:', error);
    // Still remove token and redirect on error
    localStorage.removeItem('token');
    navigate('/login');
  }
};

export default UserLogout;