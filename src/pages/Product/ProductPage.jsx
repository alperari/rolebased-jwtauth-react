import React, { useEffect, useState } from 'react';
import { Card, Button, Rating } from 'flowbite-react';
import axios from 'axios';
import { ProductService } from '../../services/ProductService';
import VerticalProductCard from '../../components/Product/VerticalProductCard';
import { useUserContext } from '../../providers/UserProvider';

const ProductPage = () => {
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
    <div class="m-20 grid grid-cols-2 grid-rows-1 gap-1 ">
      {products.map((product, index) => {
        return <VerticalProductCard product={product} key={index} />;
      })}
      <div class="grid gap-2">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Review 1
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            This is one of the products ever made.
          </p>
        </Card>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Review 2
          </h5>
          <Rating>
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star filled={false} />
            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              4.95 out of 5
            </p>
          </Rating>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            This is another one of the products ever made.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProductPage;
