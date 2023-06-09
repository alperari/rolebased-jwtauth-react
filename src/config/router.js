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
import WishlistPage from '../pages/Wishlist/WishlistPage';
import CartPage from '../pages/Cart/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import OrderPage from '../pages/Order/OrderPage';
import OrderHistoryPage from '../pages/Order/OrderHistoryPage';
import OrdersPanelPage from '../pages/Order/OrdersPanelPage';
import RefundsPage from '../pages/Refunds/RefundsPage';
import AllInvoicesPage from '../pages/Invoices/AllInvoicesPage';
import SalesPage from '../pages/Sales/SalesPage';

// Protected route, only accessible if user's role is in roles array
const Private = ({ Component, roles }) => {
  let user = localStorage.getItem('user');

  if (user) {
    user = JSON.parse(user);
  }

  return user && roles.includes(user.role) ? (
    <Component />
  ) : (
    <Navigate to="/404" />
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <CustomNavBar />

      <div style={{ marginTop: 75 }}>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" exact element={<RegisterPage />} />
          <Route path="/login" exact element={<LoginPage />} />

          <Route path="/product/:productId" exact element={<ProductPage />} />

          <Route path="/categories" exact element={<CategoriesPage />} />
          <Route path="/cart" exact element={<CartPage />} />

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

          <Route
            path="/wishlist"
            element={
              <Private
                Component={WishlistPage}
                roles={['admin', 'customer', 'salesManager', 'productManager']}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <Private
                Component={CheckoutPage}
                roles={['admin', 'customer', 'salesManager', 'productManager']}
              />
            }
          />

          <Route
            path="/order/:orderId"
            element={
              <Private
                Component={OrderPage}
                roles={['admin', 'customer', 'salesManager', 'productManager']}
              />
            }
          />

          <Route
            path="/order-history"
            element={
              <Private
                Component={OrderHistoryPage}
                roles={['admin', 'customer', 'salesManager', 'productManager']}
              />
            }
          />

          <Route
            path="/orders"
            element={
              <Private
                Component={OrdersPanelPage}
                roles={['admin', 'productManager']}
              />
            }
          />

          <Route
            path="/refunds"
            element={
              <Private
                Component={RefundsPage}
                roles={['admin', 'customer', 'salesManager', 'productManager']}
              />
            }
          />

          <Route
            path="/invoices/all"
            element={
              <Private
                Component={AllInvoicesPage}
                roles={['admin', 'salesManager']}
              />
            }
          />

          <Route
            path="/sales"
            element={
              <Private
                Component={SalesPage}
                roles={['admin', 'salesManager']}
              />
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
