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
import { Price } from './Price';

import { ProductService } from '../../services/ProductService';

let user = localStorage.getItem('user');
if (user) {
  user = JSON.parse(user);
}

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

        <div className="flex flex-row gap-3 items-center justify-between">
          <Price product={product} />
          <Button>Add to cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default VerticalProductCard;
