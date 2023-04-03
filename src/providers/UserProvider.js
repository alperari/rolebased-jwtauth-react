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
      // Set user in state
      const { user, token } = loginResponse;

      setUser(user);

      return {
        success: true,
      };
    }
  };

  const logout = () => {
    // Call API to logout

    // Remove user

    // Remove JWT from cookie ?
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
