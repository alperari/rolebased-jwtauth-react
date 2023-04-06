import React, { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
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
    <div class="mx-64 my-16 grid grid-cols-4 gap-5 ">
      {products &&
        products.map((product) => {
          console.log(product);
          return <VerticalProductCard product={product} />;
        })}
    </div>
  );
};

export default Home;
