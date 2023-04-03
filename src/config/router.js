import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import Home from '../pages/Home/Home';

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default Router;
