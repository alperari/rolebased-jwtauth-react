import React, { useState, useEffect } from 'react';

import {
  Button,
  TextInput,
  Label,
  FileInput,
  Textarea,
  Checkbox,
  Card,
  Alert,
  Dropdown,
  ToggleSwitch,
  Select,
  Rating,
  Spinner,
  Badge,
} from 'flowbite-react';

import { HiOutlineBan } from 'react-icons/hi';

import { Ratings } from './Ratings';
import { Link } from 'react-router-dom';
import { Price } from './Price';

import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';

let user = JSON.parse(localStorage.getItem('user'));
let cart = JSON.parse(localStorage.getItem('cart'));

const VerticalProductCard = ({ product, setProducts = null }) => {
  const onRemoveButtonClick = async () => {
    // Remove product from products array state
    if (setProducts) {
      setProducts((products) => {
        return products.filter((p) => p._id != product._id);
      });
    }

    // TODO: Remove product from database
    await ProductService.removeProduct({ productID: product._id });
  };

  const RemoveButton = () => {
    if (
      user &&
      (user.role == 'admin' || (user && user.role == 'productManager'))
    )
      return (
        <div class="flex flex-col items-center bg-red-100 justify-center justify-items-stretch items-stretch">
          <Button color="failure" size="xs" onClick={onRemoveButtonClick}>
            Remove Product
          </Button>
        </div>
      );
    else return null;
  };

  const onAddToCartButtonClick = async (product) => {
    // Update cart in local storage
    // If cart is empty, create a new cart
    if (!cart) {
      cart = {
        products: [],
      };
    }

    // If cart is not empty, check if product is already in cart
    const productIndex = cart.products.findIndex((p) => p._id == product._id);

    const cartProduct = {
      cartQuantity: 1,
      _id: product._id,
      category: product.category,
      distributor: product.distributor,
      imageURL: product.imageURL,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      discount: product.discount,
    };

    // If product is not in cart, add it
    if (productIndex == -1) {
      cart.products.push(cartProduct);

      if (user) {
        // If logged-in, update cart in database

        const addedProduct = await CartService.addToCart({
          productID: product._id,
          quantity: 1,
        });
      }
    }

    // If product is in cart, update quantity
    else {
      // But first check if cartQuantity is not greater than product quantity
      if (cart.products[productIndex].cartQuantity + 1 <= product.quantity) {
        cart.products[productIndex].cartQuantity += 1;

        if (user) {
          // If logged-in, update cart in database

          const addedProduct = await CartService.addToCart({
            productID: product._id,
            quantity: 1,
          });
        }
      }
    }

    // Update cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch storage event to update cart in navbar
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-sm">
      <RemoveButton />
      <Card imgAlt={product.name} imgSrc={product.imageURL}>
        <Link
          to="/product"
          state={{ product }}
          className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
        >
          {product.name}
        </Link>

        <h5 className="text-m italic tracking-tight text-gray-900 dark:text-white">
          {product.category}
        </h5>

        <Ratings ratings={product.ratings} />

        <div class="flex flex-row space gap-1">
          <h5 className="text-m tracking-tight text-gray-500 dark:text-white">
            Distributed by
          </h5>
          <h5 className="text-m font-bold tracking-tight text-gray-400 dark:text-white">
            {product.distributor}
          </h5>
        </div>

        {product.quantity > 0 ? (
          <div className="flex flex-row gap-3 items-center justify-between">
            <Price product={product} />
            {user && user.role !== 'customer' ? null : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCartButtonClick(product);
                }}
              >
                Add to cart
              </Button>
            )}
          </div>
        ) : (
          <div class="flex flex-row gap-1 items-center">
            <HiOutlineBan color="red" size={20} />
            <span className="text-md text-red-500 font-bold">Out of stock</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerticalProductCard;
