import React, { useEffect, useState } from 'react';
import { Label } from 'flowbite-react';
import { HiOutlinePencil, HiX, HiCheck } from 'react-icons/hi';
import { HiCalendar, HiCreditCard, HiHome } from 'react-icons/hi';
import { FaAddressBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AiFillFilePdf } from 'react-icons/ai';

import { Button, TextInput, Card } from 'flowbite-react';

import { OrderService } from '../../services/OrderService';

import { useParams, useNavigate } from 'react-router-dom';

import { parseDateTime } from '../../helpers/helperFunctions';

const OrderHistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrder] = useState({});

  const navigate = useNavigate();

  const fetchOrders = async () => {
    setIsLoading(true);

    const fetchedOrders = await OrderService.getMyOrders();

    setOrder(fetchedOrders);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const CardHeader = ({ order }) => {
    const [date, time] = parseDateTime(order.date, 'dateAndTime');
    return (
      <div class="flex flex-row justify-between  items-center">
        <div class="flex flex-col justify-start">
          <div class="flex flex-row gap-2">
            <div class="flex flex-row gap-2 py-2 mb-4 px-4 bg-gray-100 rounded-3xl">
              <span class="font-bold">Order</span>
              <Link
                to={'/order/' + order._id}
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                #{order._id}
              </Link>
            </div>
            <div class="flex flex-row gap-2 py-2 mb-4 px-4 bg-gray-100 rounded-3xl">
              <a
                href={order.receiptURL}
                className="flex flex-row items-end font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                <AiFillFilePdf size={25} />
                Receipt
              </a>
            </div>
          </div>
          <div class="flex flex-row gap-2">
            <div class="flex flex-row gap-2 py-2 mb-4 px-4 bg-gray-100 rounded-3xl font-semibold ">
              <HiCalendar size="25" />
              {date} - {time}
            </div>

            <div class="flex flex-row gap-2 py-2 mb-4 px-4 bg-gray-100 rounded-3xl font-semibold ">
              <HiHome size="25" /> {order.address}
            </div>

            <div class="flex flex-row gap-2 py-2 mb-4 px-4 bg-gray-100 rounded-3xl font-semibold ">
              <FaAddressBook size="25" /> {order?.contact}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center gap-2">
          <span class="text-gray-400">Status</span>
          {order.status == 'processing' && (
            <div class="flex flex-row gap-2 py-2 px-4 bg-orange-500 rounded-3xl font-bold text-white">
              Processing
            </div>
          )}

          {order.status == 'in-transit' && (
            <div class="flex flex-row gap-2 py-2 px-4 bg-yellow-400 rounded-3xl font-bold text-white">
              In-Transit
            </div>
          )}

          {order.status == 'delivered' && (
            <div class="flex flex-row gap-2 py-2 px-4 bg-green-500 rounded-3xl font-bold text-white">
              Delivered
            </div>
          )}

          {order.status == 'cancelled' && (
            <div class="flex flex-row gap-2 py-2 px-4 bg-red-500 rounded-3xl font-bold text-white">
              Cancelled
            </div>
          )}
        </div>
      </div>
    );
  };

  const CardProducts = ({ order }) => {
    return (
      <div class="flex flex-col gap-2 py-4">
        {order.products.map((product) => {
          const int = Math.floor(product.buyPrice);
          const dec = Math.round((product.buyPrice - int).toFixed(2) * 100);

          return (
            <div class="w-full flex items-center">
              <div class="overflow-hidden rounded-lg w-24 h-24 bg-gray-50 border border-gray-200">
                <img src={product.imageURL} alt={product._id} />
              </div>
              <div class="flex-grow pl-3">
                <h6 class="font-semibold uppercase text-gray-600">
                  {product.name}
                </h6>
                <span class="text-gray-400">{product.distributor}</span>
                <p class="text-gray-400">x {product.cartQuantity}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-600 text-xl">${int}</span>
                <span class="font-semibold text-gray-600 text-sm">.{dec}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const CardFooter = ({ order }) => {
    return (
      <div class="flex flex-row  py-4 items-center justify-between">
        <div class="flex flex-row gap-4 text-gray-400">
          <Button color="light" disabled={order.status !== 'processing'}>
            <div>Cancel Order</div>
          </Button>
          <div class="flex flex-row gap-2 items-center">
            <HiCreditCard size="25" />
            <span class="font-semibold">
              xxxx xxxx xxxx {order.last4digits}
            </span>
          </div>
        </div>

        <div class=" flex items-center">
          <div class="flex flex-col items-end flex-grow">
            <span class="text-gray-600">Total</span>
            <div class="pl-3">
              <span class="font-semibold text-gray-400 text-sm">USD</span>{' '}
              <span class="font-semibold">
                $
                {order &&
                  order?.products.length > 0 &&
                  order.products
                    .reduce((acc, curr) => acc + curr.buyPrice, 0)
                    .toFixed(2)}
              </span>
            </div>
            <div class="pl-3">
              <span class="font-semibold text-gray-400 text-sm">
                + Shipping 4.99{' '}
              </span>{' '}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="min-w-screen min-h-screen bg-gray-50 p-16 items-center justify-center">
      <span class="text-3xl">
        My Orders {orders && orders.length > 0 && `(${orders.length})`}
      </span>
      <div class="mt-8 flex flex-col space-y-12">
        {isLoading || !orders ? (
          <div>Loading...</div>
        ) : orders && orders.length > 0 ? (
          <>
            {orders.map((order) => {
              return (
                <Card>
                  <div class="p-6 flex flex-col divide-y">
                    <CardHeader order={order} />
                    <CardProducts order={order} />
                    <CardFooter order={order} />
                  </div>
                </Card>
              );
            })}
          </>
        ) : (
          <div>No orders found</div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
