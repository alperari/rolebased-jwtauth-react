import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/ProductService';
import { RatingService } from '../../services/RatingService';
import HorizontalProductCard from '../../components/Product/HorizontalProductCard';
const CartPage = () => {
    
    
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsCopy, setProductsCopy] = useState([]);
    const [query, setQuery] = useState('');
    const [onlyStocksCheck, setOnlyStocksCheck] = useState(false);
    
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);

        // Fetch products
        const fetchedProducts = await ProductService.getProductsWithRatings();

        setProducts(fetchedProducts);
        setProductsCopy(fetchedProducts);
        setLoading(false);
    };
    
    
    const ProductsGridView = () => {
        if (loading) {
        return <div class="mt-12">Loading...</div>;
        } else {
        if (products.length === 0) {
            return <div class="mt-12">No products found.</div>;
        } else {
            return (
            <div class="mt-5 grid grid-rows gap-3 ">
                {products.map((product, index) => {
                return (
                    <HorizontalProductCard
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
        
        
        <ProductsGridView />
    </div>
    );
    
}
export default CartPage;
