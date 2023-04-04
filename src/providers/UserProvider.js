import React, { createContext, useState, useContext } from 'react';
import { AuthService } from '../services/AuthService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const login = async (email, password) => {
    // Call API to login
    const loginResponse = await AuthService.login(email, password);

    if (loginResponse.error) {
      return {
        success: false,
        message: loginResponse.error,
      };
    } else {
      const { user, token } = loginResponse;

      // Set user in state
      setUser(user);

      // Set user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
      };
    }
  };

  const logout = async () => {
    // Call API to logout
    await AuthService.logout();

    // Clear localStorage
    localStorage.removeItem('user');

    setUser(null);

    return {
      success: true,
    };
  };

  const register = async (displayName, username, email, password, address) => {
    // Call API to register
    const registerResponse = await AuthService.register(
      displayName,
      username,
      email,
      password,
      address
    );

    if (registerResponse.error) {
      return {
        success: false,
        message: registerResponse.error,
      };
    } else {
      const { user, token } = registerResponse;

      // Set user in state
      setUser(user);

      // Set user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
      };
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
