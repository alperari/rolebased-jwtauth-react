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

let user = localStorage.getItem('user');
if (user) {
  user = JSON.parse(user);
}

const HorizontalProductCard = ({ product, setProducts = null }) => {
  return (
    <div className="max-w-lg">
      <Card imgAlt={product.name} imgSrc={product.imageURL} horizontal={true}>
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
            <Button>Remove from cart</Button>
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

export default HorizontalProductCard;
