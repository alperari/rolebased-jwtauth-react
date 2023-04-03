import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
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

export default UserProvider;
