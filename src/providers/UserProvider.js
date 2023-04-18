import React, { createContext, useState, useContext } from 'react';
import { AuthService } from '../services/AuthService';
import { CartService } from '../services/CartService';

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

      // Fetch cart from database
      const cart = await CartService.getCart();

      // Fetch cart from localStorage
      const localStorageCart = JSON.parse(localStorage.getItem('cart'));

      console.log('cartDB', cart);
      console.log('localStorageCart', localStorageCart);

      // Cart Scenerio 1: DB Cart❌ - LocalStorage Cart❌
      // TODO: do nothing
      if (
        cart.products.length == 0 &&
        (!localStorageCart || localStorageCart?.products?.length == 0)
      ) {
        console.log('DB Cart❌ - LocalStorage Cart❌');
      }
      // Cart Scenerio 2: DB Cart❌ - LocalStorage Cart✔️
      // TODO: merge all items from localStorageCart to DB cart
      // TODO: update DB cart with merged items
      else if (
        cart.products.length == 0 &&
        localStorageCart?.products?.length > 0
      ) {
        console.log('DB Cart❌ - LocalStorage Cart✔️');
      }

      // Cart Scenerio 3: DB Cart✔️ - LocalStorage Cart❌
      // TODO: merge all items from DB cart to localStorageCart
      // TODO: update localStorage cart with merged items
      else if (
        cart.products.length > 0 &&
        (!localStorageCart || localStorageCart?.products?.length == 0)
      ) {
        console.log('DB Cart✔️ - LocalStorage Cart❌');
      }

      // Cart Scenerio 4: DB Cart✔️ - LocalStorage Cart✔️
      // TODO: merge & combine all items from DB cart and localStorageCart
      // TODO: update DB cart with merged items
      // TODO: update localStorage cart with merged items
      else if (
        cart.products.length > 0 &&
        localStorageCart?.products?.length > 0
      ) {
        console.log('DB Cart✔️ - LocalStorage Cart✔️');
      }

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
    localStorage.removeItem('cart');

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
