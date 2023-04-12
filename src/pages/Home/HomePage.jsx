import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  TbSortAscending,
  TbSortDescending,
  TbPlus,
  TbSearch,
} from 'react-icons/tb';

import { ProductService } from '../../services/ProductService';
import { RatingService } from '../../services/RatingService';
import { SearchService } from '../../services/SearchService';

import VerticalProductCard from '../../components/Product/VerticalProductCard';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsCopy, setProductsCopy] = useState([]);
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);

    // Fetch products
    const fetchedProducts = await ProductService.getProductsWithRatings();

    setProducts(fetchedProducts);
    setProductsCopy(fetchedProducts);
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
      <div class="flex flex-col items-center gap-1 mt-8">
        <div class="mb-4"></div>

        <Label value="Sort Products" />
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
                sortProducts('discount', 'asc');
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

  const SearchBar = () => {
    return (
      <form class="mt-12">
        <div class="flex flex-row gap-2 ">
          <TextInput
            id="search"
            type="text"
            value={query}
            icon={TbSearch}
            placeholder="Search by name or description..."
            onChange={(e) => {
              e.preventDefault();
              const query = e.target.value.toLowerCase();
              setQuery(query);

              const results = productsCopy.filter(
                (product) =>
                  product.name.toLowerCase().includes(query) ||
                  product.description.toLowerCase().includes(query) ||
                  product.category.toLowerCase().includes(query) ||
                  product.distributor.toLowerCase().includes(query)
              );

              setProducts(results);
            }}
          />
          <Button
            color="light"
            onClick={() => {
              navigate('/products');
            }}
          >
            Search
          </Button>
        </div>
      </form>
    );
  };

  const ProductsGridView = () => {
    if (loading) {
      return <div class="mt-12">Loading...</div>;
    } else {
      if (products.length === 0) {
        return <div class="mt-12">No products found.</div>;
      } else {
        return (
          <div class="mt-12 grid grid-cols-4 gap-5 ">
            {products.map((product, index) => {
              return (
                <VerticalProductCard
                  product={product}
                  setProducts={setProducts}
                  key={index}
                />
              );
            })}
          </div>
        );
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const search = async (query) => {
    const productsSearched = await SearchService.searchProducts({
      query: query,
    });

    for (const product of productsSearched) {
      const rating = products.find((p) => p._id === product._id).ratings;
      product.ratings = rating;
    }

    setProducts([...productsSearched]);
  };

  return (
    <div class="flex flex-col items-center mx-64 my-8">
      <SortButtons />
      {SearchBar()}
      <ProductsGridView />
    </div>
  );
};

export default Home;
