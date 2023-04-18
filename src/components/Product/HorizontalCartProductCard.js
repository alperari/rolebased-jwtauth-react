import React, { useState, useEffect } from 'react';

import { Button } from 'flowbite-react';

import { Price } from './Price';

let user = localStorage.getItem('user');
if (user) {
  user = JSON.parse(user);
}

const HorizontalCartProductCard = ({
  product,
  onClickDecrementQuantity,
  onClickIncrementQuantity,
  onClickRemove,
}) => {
  return (
    <div class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
      <img
        src={product.imageURL}
        alt="product-image"
        class="w-full rounded-lg sm:w-40"
      />
      <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div class="mt-5 sm:mt-0 flex flex-col justify-between w-full">
          <div>
            <h2 class="text-lg font-bold text-gray-900">{product.name}</h2>
            <p class="mt-1 text-xs text-gray-700">{product.distributor}</p>
          </div>
          <div class="flex flex-row items-end justify-between">
            <Price product={product} />
            <div class="flex flex-row items-center border-gray-100 gap-1">
              <Button
                size="xs"
                color="light"
                onClick={() => {
                  onClickDecrementQuantity(product);
                }}
              >
                -
              </Button>
              <div class="px-4 py-2 border-solid border-t border-b border-l border-r border-gray-300 rounded-xl">
                {product.cartQuantity}
              </div>
              <Button
                size="xs"
                color="light"
                onClick={() => {
                  onClickIncrementQuantity(product);
                }}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div
            class="flex items-center space-x-4"
            onClick={() => {
              onClickRemove(product);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCartProductCard;
