import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('hello');

  const login = async (userData) => {
    console.log('login');
    // Call API to login

    // Set user

    // Set JWT in cookie
    setUser(userData);
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
