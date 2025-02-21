import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHomeMessage = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:8000/api/home', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message);
      } catch (error) {
        alert('Unauthorized');
      }
    };

    fetchHomeMessage();
  }, []);

  return <div>{message || 'Loading...'}</div>;
};

export default Home;
