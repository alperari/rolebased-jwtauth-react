import React, { useEffect, useState } from 'react';
import { Card, Button, Rating } from 'flowbite-react';
import axios from 'axios';
import { ProductService } from '../../services/ProductService';
import VerticalProductCard from '../../components/Product/VerticalProductCard';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    const fetchedProducts = await ProductService.getProducts();
    setProducts(fetchedProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div class="m-16 grid grid-cols-5 grid-rows-2 gap-2 ">
      {products &&
        products.map((product) => {
          console.log(product);
          return <VerticalProductCard product={product} />;
        })}
    </div>
  );
};

export default Home;
