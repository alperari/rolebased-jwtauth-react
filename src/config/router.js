import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import Home from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import UserPage from '../pages/User/UserPage';
import AddProductPage from '../pages/Product/AddProductPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected route, only accessible if user's
const Private = ({ Component, roles }) => {
  let user = localStorage.getItem('user');

  if (user) {
    user = JSON.parse(user);
  }

  return user && roles.includes(user.role) ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/login" exact element={<LoginPage />} />

        <Route
          path="/user"
          element={
            <Private
              Component={UserPage}
              roles={['admin', 'customer', 'salesManager', 'productManager']}
            />
          }
        />

        <Route
          path="/add-product"
          element={
            <Private
              Component={AddProductPage}
              roles={['admin', 'productManager']}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default Router;
