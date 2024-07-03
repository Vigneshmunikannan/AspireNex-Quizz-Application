import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));

  // Function to set the access token and store it in session storage
  const login = (token) => {
    setAccessToken(token);
    sessionStorage.setItem('access_token', token);
  };

  // Function to remove the access token from state and session storage
  const logout = async () => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        sessionStorage.clear();
        navigate("/", { replace: false });
        return;
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      sessionStorage.clear();
      navigate("/", { replace: false });
    } catch (error) {
      console.error('Error logging out:', error);
      sessionStorage.clear();
      navigate("/", { replace: false });
    }
  };

  // Function to check if a valid token is available
  const isValidTokenAvailable = () => {
    return accessToken !== null && accessToken !== undefined && accessToken !== '';
  };

  // Update token when location changes
  useEffect(() => {
    setAccessToken(sessionStorage.getItem('access_token'));
  }, [location]);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, isValidTokenAvailable }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
