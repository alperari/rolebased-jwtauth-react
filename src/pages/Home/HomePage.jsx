import React, { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import axios from 'axios';
import { ProductService } from '../../services/ProductService';
import VerticalProductCard from '../../components/Product/VerticalProductCard';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    const fetchedProducts = await ProductService.getProducts();
    setProducts(fetchedProducts);
    setLoading(false);
  };

  const sortProducts = (by, order) => {
    const sortedProducts = products.sort((a, b) => {
      if (by === 'name') {
        if (order === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (by === 'price') {
        // Calculate discounted price, if discount is present
        const aDiscountedPrice = a.price - (a.price * a.discount) / 100;
        const bDiscountedPrice = b.price - (b.price * b.discount) / 100;

        if (order === 'asc') {
          return aDiscountedPrice - bDiscountedPrice;
        } else {
          return bDiscountedPrice - aDiscountedPrice;
        }
      } else if (by === 'discount') {
        if (order === 'asc') {
          return a.discount - b.discount;
        } else {
          return b.discount - a.discount;
        }
      }
    });

    setProducts([...sortedProducts]);
  };

  const SortButtons = () => {
    return (
      <div class="flex flex-col items-center gap-1">
        <span>Sort Products By:</span>
        <div class="flex flex-row gap-4">
          <Button.Group>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('name', 'asc');
              }}
            >
              <div class="flex flex-row gap-1">
                Name
                <TbSortAscending fontSize="20px" />
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('name', 'desc');
              }}
            >
              <div class="flex flex-row gap-1">
                Name
                <TbSortDescending fontSize="20px" />
              </div>
            </Button>
          </Button.Group>

          <Button.Group>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('price', 'asc');
              }}
            >
              <div class="flex flex-row gap-1">
                Price
                <TbSortAscending fontSize="20px" />
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('price', 'desc');
              }}
            >
              <div class="flex flex-row gap-1">
                Price
                <TbSortDescending fontSize="20px" />
              </div>
            </Button>
          </Button.Group>

          <Button.Group>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('discount', 'desc');
              }}
            >
              <div class="flex flex-row gap-1">
                Discount
                <TbSortAscending fontSize="20px" />
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('discount', 'desc');
              }}
            >
              <div class="flex flex-row gap-1">
                Discount
                <TbSortDescending fontSize="20px" />
              </div>
            </Button>
          </Button.Group>
        </div>
      </div>
    );
  };

  const ProductsGridView = () => {
    if (products.length > 0) {
      return (
        <div class="mt-12 grid grid-cols-4 gap-5 ">
          {products.map((product, index) => {
            return <VerticalProductCard product={product} key={index} />;
          })}
        </div>
      );
    } else {
      return <div class="mt-12">No products found.</div>;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div class="flex flex-col items-center mx-64 my-12">
      <SortButtons />
      <ProductsGridView />
    </div>
  );
};

export default Home;
