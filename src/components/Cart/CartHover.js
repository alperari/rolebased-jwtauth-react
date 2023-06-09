import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { CartHoverProduct } from './CartHoverProduct';

const user = JSON.parse(localStorage.getItem('user'));

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

        {cart?.products && cart.products.length > 0 && (
          <Button
            color="light"
            outline={true}
            gradientDuoTone="tealToLime"
            onClick={() => {
              if (user) {
                navigate('/checkout');
              } else {
                navigate('/login');
              }
            }}
          >
            Checkout
          </Button>
        )}
      </div>
    );
  };

  const ProductList = () => {
    return (
      <div class="grid grid-cols divide-y">
        {cart?.products?.map((product) => {
          return <CartHoverProduct product={product} />;
        })}
      </div>
    );
  };

  return (
    <div class="flex flex-col items-center mx-4 divide-y gap-1 max-h-96 w-96 overflow-y-auto">
      <span class="font-bold">
        My Cart ({cart?.products?.length > 0 ? cart?.products?.length : 0})
      </span>
      <ProductList />
      <Buttons />
    </div>
  );
};
