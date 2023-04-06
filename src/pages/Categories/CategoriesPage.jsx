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

  const CustomTabsItem = ({ title, products }) => {
    return (
      <div>
        <Tabs.Item>{title}</Tabs.Item>
        <div class="grid gap-2">
          {products.map((product) => {
            return <VerticalProductCard product={product} />;
          })}
        </div>
      </div>
    );
  };

  return (
    <div class="flex flex-col items-center mt-24">
      <Tabs.Group aria-label="Pills" style="pills" class="flex flex-row gap-4">
        <div>
          {Object.keys(groupedProducts).map((key) => {
            return (
              <CustomTabsItem
                key={key}
                title={key}
                products={groupedProducts[key]}
              />
            );
          })}
        </div>
      </Tabs.Group>
    </div>
  );
};

export default CategoriesPage;
