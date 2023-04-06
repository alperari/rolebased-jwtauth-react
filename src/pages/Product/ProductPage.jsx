import React, { useEffect, useState } from 'react';
import { Card, Button, Rating } from 'flowbite-react';

import { ProductService } from '../../services/ProductService';
import { CommentService } from '../../services/CommentService';

import { useLocation } from 'react-router-dom';

import VerticalProductCard from '../../components/Product/VerticalProductCard';

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state;

  // const product = props.location.state.product;
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    setLoading(true);

    // Fetch comments
    const fetchedComments = await CommentService.getCommentsByProductId({
      productId: product._id,
    });

    setComments(fetchedComments);

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  console.log('product:', product);

  return (
    <div class="m-20 grid grid-cols-2 grid-rows-1 gap-1 ">
      <VerticalProductCard product={product} />

      <div class="grid gap-2">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Review 1
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            This is one of the products ever made.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProductPage;
