import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { CartHoverProduct } from './CartHoverProduct';

export const CartHover = ({ cart }) => {
  const navigate = useNavigate();

  const Buttons = () => {
    return (
      <div class="flex flex-row gap-2 items-center w-full justify-center pt-2">
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
      <div class="grid grid-cols divide-y">
        {cart?.products.map((product) => {
          return <CartHoverProduct cartProduct={product} />;
        })}
      </div>
    );
  };

  return (
    <div class="flex flex-col items-center mx-4 divide-y gap-1">
      <span class="font-bold">My Cart ({cart?.products.length})</span>
      <ProductList />
      <Buttons />
    </div>
  );
};
