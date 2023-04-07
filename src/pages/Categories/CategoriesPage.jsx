import React, { useEffect, useState } from 'react';
import { Card, Button, Rating, Tabs } from 'flowbite-react';

import { ProductService } from '../../services/ProductService';
import { RatingService } from '../../services/RatingService';

import VerticalProductCard from '../../components/Product/VerticalProductCard';

const CategoriesPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});

  function groupBy(array, key) {
    return array.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  const fetchProducts = async () => {
    setLoading(true);

    // Fetch products
    const fetchedProducts = await ProductService.getProducts();

    // Fetch ratings for each product
    for (const product of fetchedProducts) {
      const fetchedRatings = await RatingService.getRatingsByProductId({
        productID: product._id,
      });
      product.ratings = fetchedRatings;
    }

    setProducts(fetchedProducts);

    // Group products by category
    const groupedProducts = groupBy(fetchedProducts, 'category');
    setGroupedProducts(groupedProducts);
    setLoading(false);
  };

  const TabsWithProductsGrid = () => {
    if (loading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      if (products.length === 0) {
        return (
          <div>
            <h1>No products found</h1>
          </div>
        );
      } else {
        return (
          <Tabs.Group
            aria-label="Pills"
            style="pills"
            class="flex flex-row mx-24 items-center gap-3 justify-center"
          >
            {Object.keys(groupedProducts).map((category) => {
              return (
                <Tabs.Item title={category} key={category}>
                  <div class="mx-24 grid grid-cols-5 gap-3 ">
                    {groupedProducts[category].map((product, index) => {
                      return (
                        <VerticalProductCard product={product} key={index} />
                      );
                    })}
                  </div>
                </Tabs.Item>
              );
            })}
          </Tabs.Group>
        );
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div class="flex flex-col items-center mt-24">
      <span class="text-2xl mb-4">
        <strong>Categories</strong>
      </span>

      <TabsWithProductsGrid />
    </div>
  );
};

export default CategoriesPage;
