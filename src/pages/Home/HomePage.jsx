import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
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

  const fetchProducts = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    setLoading(true);

    // Fetch products
    let fetchedProducts = [];
    if (user && user.role != 'customer') {
      fetchedProducts = await ProductService.getProductsWithRatings();
    } else {
      fetchedProducts = await ProductService.getProductsWithRatingsAsCustomer();
      console.log('y');
    }

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
      } else if (by === 'rating') {
        const aRating =
          a.ratings.reduce((acc, rating) => {
            return acc + rating.stars;
          }, 0) / a.ratings.length || 0;

        const bRating =
          b.ratings.reduce((acc, rating) => {
            return acc + rating.stars;
          }, 0) / b.ratings.length || 0;

        if (order === 'asc') {
          return aRating - bRating;
        } else {
          return bRating - aRating;
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

          <Button.Group>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('rating', 'asc');
              }}
            >
              <div class="flex flex-row gap-1">
                Rating
                <TbSortAscending fontSize="20px" />
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => {
                sortProducts('rating', 'desc');
              }}
            >
              <div class="flex flex-row gap-1">
                Rating
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
        </div>
      </form>
    );
  };

  const CheckBoxOnlyStocks = () => {
    return (
      <div class="flex flex-row gap-2 mt-4 items-center">
        <Label value="Show Only Available Stocks" />

        <Checkbox
          id="remember"
          onChange={(e) => {
            if (e.target.checked) {
              const results = productsCopy.filter(
                (product) => product.quantity > 0
              );

              setProducts(results);
            } else {
              setProducts(productsCopy);
            }
          }}
        />
      </div>
    );
  };

  const ProductsGridView = () => {
    if (loading) {
      return <div class="mt-12">Loading...</div>;
    } else {
      if (!products || products.length === 0) {
        return <div class="mt-12">No products found.</div>;
      } else {
        return (
          <div class="mt-12 grid grid-cols-4 gap-5 ">
            {products &&
              products.length > 0 &&
              products.map((product, index) => {
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

  return (
    <div class="flex flex-col items-center mx-64 my-8">
      <SortButtons />
      {SearchBar()}
      {CheckBoxOnlyStocks()}
      <ProductsGridView />
    </div>
  );
};

export default Home;
