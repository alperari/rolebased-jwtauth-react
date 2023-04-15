import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { CartHoverProduct } from './CartHoverProduct';

export const CartHover = ({ cart }) => {
  console.log('cart', cart);
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
          outline={true}
          gradientDuoTone="tealToLime"
          onClick={() => {
            navigate('/cart');
          }}
        >
          Checkout
        </Button>
      </div>
    );
  };

  const ProductList = () => {
    return (
      <div>
        {cart?.products.map((product) => {
          return <CartHoverProduct cartProduct={product} />;
        })}
      </div>
    );
  };

  return (
    <div class="flex flex-col items-center mx-4 gap-2">
      <ProductList />
      <Buttons />
    </div>
  );
};
