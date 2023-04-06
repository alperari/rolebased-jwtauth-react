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

import { Ratings } from './Ratings';
import { Link } from 'react-router-dom';

const VerticalProductCard = ({ product }) => {
  const Price = () => {
    if (product.discount <= 0) {
      return (
        <div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
        </div>
      );
    } else {
      const discountedPrice =
        product.price - (product.price * product.discount) / 100;

      return (
        <div>
          <Badge color="success" size="sm">
            {product.discount}% Discount
          </Badge>
          <div class="flex flex-row gap-3">
            <span className="text-2xl line-through font-bold text-red-700 dark:text-white">
              ${product.price}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${discountedPrice}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-sm">
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

        <Ratings product={product} />

        <div class="flex flex-row space gap-1">
          <h5 className="text-m tracking-tight text-gray-500 dark:text-white">
            Distributed by
          </h5>
          <h5 className="text-m font-bold tracking-tight text-gray-400 dark:text-white">
            {product.distributor}
          </h5>
        </div>

        <div className="flex items-center justify-between">
          <Price />
          <Button>Add to cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default VerticalProductCard;
