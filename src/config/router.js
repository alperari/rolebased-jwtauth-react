import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import CustomNavBar from '../components/Navbar/CustomNavBar';
import Home from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import UserPage from '../pages/User/UserPage';
import AddProductPage from '../pages/Product/AddProductPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductPage from '../pages/Product/ProductPage';
import CategoriesPage from '../pages/Categories/CategoriesPage';
import CommentsPage from '../pages/Comments/CommentsPage';

// Protected route, only accessible if user's role is in roles array
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
      <CustomNavBar />

      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/product" exact element={<ProductPage />} />
        <Route path="/categories" exact element={<CategoriesPage />} />

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

        <Route
          path="/comments"
          element={
            <Private
              Component={CommentsPage}
              roles={['admin', 'customer', 'salesManager', 'productManager']}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
