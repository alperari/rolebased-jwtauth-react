import React, { useEffect, useState } from 'react';
import { Label } from 'flowbite-react';
import { HiOutlinePencil, HiX, HiCheck } from 'react-icons/hi';
import { HiCalendar } from 'react-icons/hi';
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
      <div class="flex flex-row justify-between py-4">
        <div class="flex flex-row items-center gap-4">
          <div class="flex flex-row gap-2 py-2 px-4 bg-gray-100 rounded-3xl">
            <span class="font-bold">Order</span>
            <Link
              to="/order/123"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              #{order._id}
            </Link>
          </div>
          <div class="flex flex-row items-center text-gray-300 font-semibold gap-1">
            <HiCalendar size="25" />
            Order Placed: {date} - {time}
          </div>
        </div>
      </div>
    );
  };

  const CardProducts = () => {
    return <div>body</div>;
  };

  const CardFooter = () => {
    return <div>footer</div>;
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
