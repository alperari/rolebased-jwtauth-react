import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import HorizontalProductCard from '../../components/Product/HorizontalProductCard';
import { Price } from '../../components/Product/Price';

const user = JSON.parse(localStorage.getItem('user'));
const cart = JSON.parse(localStorage.getItem('cart'));

const CartPage = () => {
  const [cartState, setCartState] = useState(cart);

  const onClickIncrementQuantity = async (product) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const productIndex = cart.products.findIndex(
      (item) => item._id === product._id
    );

    cart.products[productIndex].cartQuantity += 1;

    // Update cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch storage event to update cart in navbar
    window.dispatchEvent(new Event('storage'));

    // Update cart state
    setCartState(cart);
  };

  const onClickDecrementQuantity = async (product) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const productIndex = cart.products.findIndex(
      (item) => item._id === product._id
    );

    cart.products[productIndex].cartQuantity -= 1;

    // Update cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch storage event to update cart in navbar
    window.dispatchEvent(new Event('storage'));

    // Update cart state
    setCartState(cart);
  };

  useEffect(() => {
    setCartState(JSON.parse(localStorage.getItem('cart')));
  }, []);

  return (
    <div class="h-screen bg-gray-100">
      <span class="py-8 text-center text-2xl font-bold flex flex-col w-full">
        My cart
      </span>

      <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div class="rounded-lg md:w-2/3">
          {cartState &&
            cartState.products.map((item) => {
              return (
                <div class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                  <img
                    src={item.imageURL}
                    alt="product-image"
                    class="w-full rounded-lg sm:w-40"
                  />
                  <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div class="mt-5 sm:mt-0 flex flex-col justify-between w-full">
                      <div>
                        <h2 class="text-lg font-bold text-gray-900">
                          {item.name}
                        </h2>
                        <p class="mt-1 text-xs text-gray-700">
                          {item.distributor}
                        </p>
                      </div>
                      <div class="flex flex-row items-end justify-between">
                        <Price product={item} />
                        <div class="flex flex-row items-center border-gray-100 gap-1">
                          <Button
                            size="xs"
                            color="light"
                            onClick={() => {
                              onClickDecrementQuantity(item);
                            }}
                          >
                            -
                          </Button>
                          <div class="px-4 py-2 border-2 border-gray-300 rounded-xl">
                            {item.cartQuantity}
                          </div>
                          <Button
                            size="xs"
                            color="light"
                            onClick={() => {
                              onClickIncrementQuantity(item);
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <div class="flex items-center space-x-4">
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
            })}
        </div>

        <div class="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
          <div class="mb-2 flex justify-between">
            <p class="text-gray-700">Subtotal</p>
            <p class="text-gray-700 font-semibold">
              $
              {cartState
                ? cartState?.products.reduce(
                    (acc, item) => acc + item.price * item.cartQuantity,
                    0
                  )
                : 0}
            </p>
          </div>
          <div class="mb-2 flex justify-between">
            <p class="text-gray-700">Discount</p>
            <p class="text-green-500 font-semibold">
              - $
              {cartState
                ? cartState?.products.reduce((acc, item) => {
                    const discount =
                      acc +
                      (item.price * item.cartQuantity * item.discount) / 100;
                    return discount;
                  }, 0)
                : 0}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="text-gray-700">Shipping</p>
            <p class="text-gray-700 font-semibold">
              {cartState ? '$4.99' : '0.00'}
            </p>
          </div>
          <hr class="my-4" />
          <div class="flex justify-between">
            <p class="text-lg font-bold">Total</p>
            <div class="">
              <p class="mb-1 text-lg font-bold">
                $
                {cartState
                  ? cartState?.products.reduce((acc, item) => {
                      const discount =
                        acc +
                        (item.price * item.cartQuantity * item.discount) / 100;

                      const newPrice =
                        item.price * item.cartQuantity - discount;
                      return newPrice;
                    }, 0) + 4.99
                  : 0}
              </p>
            </div>
          </div>
          <button class="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
