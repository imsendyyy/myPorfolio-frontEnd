import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import this for navigation
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get('authToken') || null);
  const navigate = useNavigate();

  const login = (token) => {
    setToken(token);
    Cookies.set('authToken', token, { expires: 1 / 24 }); // Token expires in 1 hour
    navigate('/dashboard/admin-myprofile'); // Redirect after login
  };

  const logout = () => {
    setToken(null);
    Cookies.remove('authToken');
    navigate('/login'); // Redirect to login
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) return;

      // Assume the token is a JWT; decode and check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;

      
    };

    // Check token expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);


    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


