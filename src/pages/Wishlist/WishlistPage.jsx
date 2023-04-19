import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Navbar, Avatar, Table } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { Price } from '../../components/Product/Price';

import { WishlistService } from '../../services/WishlistService';

const WishlistPage = () => {
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    setLoading(true);

    const fetchedWishlist = await WishlistService.getWishlist();

    setWishlist(fetchedWishlist);

    setLoading(false);
  };

  const onClickRemove = async (productID) => {
    // Remove product from wishlist in state
    setWishlist({
      ...wishlist,
      products: wishlist.products.filter(
        (product) => product._id !== productID
      ),
    });

    // Remove product from wishlist in db
    await WishlistService.removeFromWishlist({ productID });
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const StockStatus = ({ product }) => {
    if (product.quantity > 0) {
      return (
        <div class="text-green-400 tracking-tight font-bold">In stock</div>
      );
    } else {
      return (
        <div class="text-green-400 tracking-tight font-bold">Out of stock</div>
      );
    }
  };

  const CustomTable = () => {
    if (!wishlist || wishlist.length === 0) {
      return (
        <div>
          <h1>You have no items in your wishlist</h1>
        </div>
      );
    } else {
      return (
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>

            <Table.HeadCell>Product</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Discount</Table.HeadCell>
            <Table.HeadCell>Stock Status</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {wishlist.products.map((product) => {
              return (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell width="100px">
                    <img src={product.imageURL} alt={product.name} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to="/product"
                      state={{ product: product }}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {product.name}
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Price product={product} />
                  </Table.Cell>

                  <Table.Cell>
                    <div class="tracking-tight font-bold">
                      {product.discount}%
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <StockStatus product={product} />
                  </Table.Cell>

                  <Table.Cell>
                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => {
                        onClickRemove(product._id);
                      }}
                    >
                      Remove
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      );
    }
  };

  return (
    <div class="flex flex-col mx-32 my-32">
      <span class="text-3xl text-center ">My Wishlist</span>
      <span class="text-l text-center mb-8">
        You will be notified when there is a discount on your wishlist items
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <CustomTable />
      )}
    </div>
  );
};

export default WishlistPage;
