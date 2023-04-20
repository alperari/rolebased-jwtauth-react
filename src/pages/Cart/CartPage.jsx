import _ from 'lodash';

import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { HiX } from 'react-icons/hi';

import { CartService } from '../../services/CartService';

import HorizontalCartProductCard from '../../components/Product/HorizontalCartProductCard';
import { Price } from '../../components/Product/Price';

const user = JSON.parse(localStorage.getItem('user'));
const cart = JSON.parse(localStorage.getItem('cart'));

const CartPage = () => {
  const [cartState, setCartState] = useState(cart);

  const navigate = useNavigate();

  const fetchCartUpdateLocalStorage = async () => {
    const fetchedCart = await CartService.getCart();

    // If any of product details are changed, update the cart
    if (!_.isEqual(cart, fetchedCart)) {
      // Update local storage
      localStorage.setItem('cart', JSON.stringify(fetchedCart));

      // Dispatch event
      window.dispatchEvent(new Event('storage'));

      // Update cart state
      setCartState(fetchedCart);
    }
  };

  const onClickIncrementQuantity = async (product) => {
    if (user) {
      // If logged-in, update cart in database
      const addedProduct = await CartService.addToCart({
        productID: product._id,
        quantity: 1,
      });
    }

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
    if (user) {
      // If logged-in, update cart in database
      const addedProduct = await CartService.removeFromCart({
        productID: product._id,
        quantity: 1,
      });
    }

    const cart = JSON.parse(localStorage.getItem('cart'));

    const productIndex = cart.products.findIndex(
      (item) => item._id === product._id
    );

    if (product.cartQuantity == 1) {
      // Then remove the product from the cart

      // Remove product from cart
      cart.products.splice(productIndex, 1);

      // Update cart in local storage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Dispatch storage event to update cart in navbar
      window.dispatchEvent(new Event('storage'));

      // Update cart state
      setCartState(cart);
    } else {
      // Otherwise, just decrement the quantity
      cart.products[productIndex].cartQuantity -= 1;

      // Update cart in local storage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Dispatch storage event to update cart in navbar
      window.dispatchEvent(new Event('storage'));

      // Update cart state
      setCartState(cart);
    }
  };

  const onClickRemove = async (product) => {
    if (user) {
      // If logged-in, update cart in database
      const addedProduct = await CartService.removeFromCart({
        productID: product._id,
        quantity: product.cartQuantity,
      });
    }

    const cart = JSON.parse(localStorage.getItem('cart'));

    const productIndex = cart.products.findIndex(
      (item) => item._id === product._id
    );

    // Remove product from cart
    cart.products.splice(productIndex, 1);

    // Update cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch storage event to update cart in navbar
    window.dispatchEvent(new Event('storage'));

    // Update cart state
    setCartState(cart);
  };

  useEffect(() => {
    fetchCartUpdateLocalStorage();
  }, []);

  return (
    <div class="h-screen bg-gray-100">
      <span class="py-8 text-center text-2xl font-bold flex flex-col w-full">
        My cart
      </span>

      <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div class="rounded-lg md:w-2/3">
          {cartState && cartState.products.length > 0 ? (
            cartState.products.map((item) => {
              return (
                <HorizontalCartProductCard
                  product={item}
                  onClickDecrementQuantity={onClickDecrementQuantity}
                  onClickIncrementQuantity={onClickIncrementQuantity}
                  onClickRemove={onClickRemove}
                  key={item._id}
                />
              );
            })
          ) : (
            <div class="flex flex-col items-center justify-center h-full">
              <span class="text-2xl font-bold mt-24">Your cart is empty</span>
              <Link to="/">
                <Button className="mt-4" variant="primary" size="lg">
                  Shop now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {cartState && cartState.products.length > 0 && (
          <div class="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div class="mb-2 flex justify-between">
              <p class="text-gray-700">Subtotal</p>
              <p class="text-gray-700 font-semibold">
                $
                {cartState
                  ? cartState?.products
                      .reduce(
                        (acc, item) => acc + item.price * item.cartQuantity,
                        0
                      )
                      .toFixed(2)
                  : 0}
              </p>
            </div>
            <div class="mb-2 flex justify-between">
              <p class="text-gray-700">Discount</p>
              <p class="text-green-500 font-semibold">
                - $
                {cartState
                  ? cartState?.products
                      .reduce((acc, item) => {
                        const discount =
                          acc +
                          (item.price * item.cartQuantity * item.discount) /
                            100;
                        return discount;
                      }, 0)
                      .toFixed(2)
                  : 0}
              </p>
            </div>
            <div class="flex justify-between">
              <p class="text-gray-700">Shipping</p>
              <p class="text-gray-700 font-semibold">
                {cartState?.products?.length > 0 ? '$4.99' : '0.00'}
              </p>
            </div>
            <hr class="my-4" />
            <div class="flex justify-between">
              <p class="text-lg font-bold">Total</p>
              <div class="">
                <p class="mb-1 text-lg font-bold">
                  $
                  {cartState?.products.length > 0
                    ? (
                        cartState.products.reduce(
                          (acc, item) =>
                            acc +
                            item.price * item.cartQuantity -
                            (item.price * item.cartQuantity * item.discount) /
                              100,
                          0
                        ) + (cartState?.products?.length > 0 ? 4.99 : 0)
                      ).toFixed(2)
                    : 0.0}
                </p>
              </div>
            </div>
            <button
              class="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
              disabled={cartState?.products.length == 0}
              onClick={() => {
                if (user) {
                  navigate('/checkout');
                } else {
                  navigate('/login');
                }
              }}
            >
              Check out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
