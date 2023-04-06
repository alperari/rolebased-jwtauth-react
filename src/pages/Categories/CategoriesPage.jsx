import React, { useEffect, useState } from 'react';
import { Card, Button, Rating, Tabs } from 'flowbite-react';
import { ProductService } from '../../services/ProductService';
import VerticalProductCard from '../../components/Product/VerticalProductCard';

const CategoriesPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});

  function groupBy(array, key) {
    return array.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  const fetchProducts = async () => {
    setLoading(true);
    const fetchedProducts = await ProductService.getProducts();
    setProducts(fetchedProducts);

    // Group products by category
    const groupedProducts = groupBy(fetchedProducts, 'category');
    setGroupedProducts(groupedProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //   const CustomTabsItem = (props) => {
  //     return <Tabs.Item title="Profile">Profile content</Tabs.Item>;
  //   };

  return (
    <div class="flex flex-col items-center mt-24">
      <Tabs.Group
        aria-label="Pills"
        style="pills"
        class="flex flex-row gap-4 mx-24"
      >
        {Object.keys(groupedProducts).map((category) => {
          return (
            <Tabs.Item title={category} key={category}>
              <div class="mx-24 grid grid-cols-5 gap-3 ">
                {groupedProducts[category].map((product) => {
                  return (
                    <VerticalProductCard product={product} key={product} />
                  );
                })}
              </div>
            </Tabs.Item>
          );
        })}
      </Tabs.Group>
    </div>
  );
};

export default CategoriesPage;
