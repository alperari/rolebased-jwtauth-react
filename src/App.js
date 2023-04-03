import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Product from './pages/Product/Product';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';

import Router from './config/router';

function App() {
  return <Router />;
}

export default App;
