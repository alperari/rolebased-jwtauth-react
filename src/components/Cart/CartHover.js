import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/ProductService';
import { RatingService } from '../../services/RatingService';
import HorizontalProductCard from '../../components/Product/HorizontalProductCard';

const cart = JSON.parse(localStorage.getItem('cart'));

export const CartHover = () => {
  const navigate = useNavigate();

  const Buttons = () => {
    return (
      <div class="flex flex-row gap-2 items-center">
        <Button
          color="light"
          onClick={() => {
            navigate('/cart');
          }}
        >
          Go To Cart
        </Button>

        <Button
          color="light"
          onClick={() => {
            navigate('/cart');
          }}
        >
          Checkout
        </Button>
      </div>
    );
  };

  const ProductList = () => {};

  return (
    <div class="flex flex-col items-center mx-4">
      <Buttons />
    </div>
  );
};
