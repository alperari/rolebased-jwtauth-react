import React, { useEffect, useState } from 'react';
import { Label } from 'flowbite-react';
import { HiOutlinePencil, HiX, HiCheck } from 'react-icons/hi';
import { HiCalendar, HiCreditCard } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import { Button, TextInput, Card } from 'flowbite-react';

import { OrderService } from '../../services/OrderService';

import { useParams, useNavigate } from 'react-router-dom';

import { parseDateTime } from '../../helpers/helperFunctions';

const OrderPage = () => {
  const { orderId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});

  const navigate = useNavigate();

  const fetchOrder = async () => {
    setIsLoading(true);

    const fetchedOrder = await OrderService.getOrderById({ orderID: orderId });

    if (fetchedOrder.error) {
      navigate('/404');
    }
    setOrder(fetchedOrder);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const CardHeader = () => {
    const [date, time] = parseDateTime(order.date, 'dateAndTime');
    return (
      <div class="flex flex-row justify-between py-4 items-center">
        <div class="flex flex-row items-center gap-4 items-center">
          <div class="flex flex-row gap-2 py-2 px-4 bg-gray-100 rounded-3xl">
            <span class="font-bold">Order</span>
            <Link
              to="/order/123"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              #{order._id}
            </Link>
          </div>
          <div class="flex flex-row items-center text-gray-400 gap-1">
            <HiCalendar size="25" />
            <div class="font-semibold ">
              {date} - {time}
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
            <div class="flex flex-row gap-2 py-2 px-4 bg-yellow-500 rounded-3xl font-bold text-white">
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

  const CardProducts = () => {
    return <div>body</div>;
  };

  const CardFooter = () => {
    return (
      <div class="flex flex-row  py-4 items-center justify-between">
        <div class="flex flex-row gap-4 text-gray-400">
          <Button color="light">
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
                {order.products
                  .reduce((acc, curr) => acc + curr.buyPrice, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="min-w-screen min-h-screen bg-gray-50 p-16 items-center justify-center">
      <span class="text-3xl">My Orders</span>
      <div class="mt-8">
        {isLoading || !order ? (
          <div>Loading...</div>
        ) : (
          <Card>
            <div class="p-6 flex flex-col divide-y">
              <CardHeader />
              <CardProducts />
              <CardFooter />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
