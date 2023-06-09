import React, { useEffect, useState } from 'react';
import { HiCalendar, HiCreditCard, HiHome } from 'react-icons/hi';
import { FaAddressBook, FaBan } from 'react-icons/fa';
import { AiFillFilePdf } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import { FaHandHoldingUsd } from 'react-icons/fa';

import { Button, Card } from 'flowbite-react';

import { OrderService } from '../../services/OrderService';
import { RefundService } from '../../services/RefundService';

import { useParams, useNavigate, Link } from 'react-router-dom';

import { parseDateTime } from '../../helpers/helperFunctions';

const user = JSON.parse(localStorage.getItem('user'));

const OrderPage = () => {
  const { orderId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});

  const [refundStatus, setRefundStatus] = useState([]);

  const navigate = useNavigate();

  const fetchOrder = async () => {
    setIsLoading(true);

    const fetchedOrder = await OrderService.getOrderById({ orderID: orderId });

    if (fetchedOrder.error || fetchedOrder === 'Unauthorized') {
      navigate('/404');
    }
    setOrder(fetchedOrder);

    if (fetchedOrder.status === 'delivered') {
      const refundStatus = await RefundService.getOrderRefundStatus({
        orderID: orderId,
      });

      if (!refundStatus.error) {
        // Update refund status in state
        setRefundStatus(refundStatus);
      }
    }

    setIsLoading(false);
  };

  const onClickCancelOrder = async () => {
    // Update order status in state
    setOrder({ ...order, status: 'cancelled' });

    // Update order status in database
    const response = await OrderService.cancelMyOrder({
      orderID: order._id,
    });

    if (response.error) {
      alert(response.error);
    }
  };

  const onClickCreateRefundRequest = async (product) => {
    const response = await RefundService.createRefundRequest({
      orderID: order._id,
      productID: product._id,
    });

    if (response.error) {
      alert(response.error);
    }

    // Update refund status in state ("none" -> "pending")
    const newRefundStatus = refundStatus.map((refund) => {
      if (refund.productID === product._id) {
        return { ...refund, status: 'pending' };
      } else {
        return refund;
      }
    });

    setRefundStatus([...newRefundStatus]);
  };

  const onClickCancelRefundRequest = async (product) => {
    const response = await RefundService.cancelRefundRequest({
      orderID: order._id,
      productID: product._id,
    });

    if (response.error) {
      alert(response.error);
    }

    // Update refund status in state ("pending" -> "none")
    const newRefundStatus = refundStatus.map((refund) => {
      if (refund.productID === product._id) {
        return { ...refund, status: 'none' };
      } else {
        return refund;
      }
    });

    setRefundStatus([...newRefundStatus]);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const RefundSection = ({ product }) => {
    const orderDate = new Date(order.date);
    const daysPast = (Date.now() - orderDate.getTime()) / 1000 / 60 / 60 / 24;

    if (!refundStatus || refundStatus.length === 0) {
      return null;
    } else {
      const status = refundStatus.find(
        (refund) => refund.productID === product._id
      ).status;

      // "approved" | "rejected" | "pending" | "none"

      if (status === 'approved') {
        return (
          <div class="flex flex-col items-center justify-center p-4 font-bold text-green-900 bg-green-200 rounded-xl mr-3">
            <span>Refund</span>
            <span>Approved</span>
          </div>
        );
      } else if (status === 'rejected') {
        return (
          <div class="flex flex-col items-center justify-center p-4 font-bold text-red-900 bg-red-200 rounded-xl mr-3">
            <span>Refund</span>
            <span>Rejected</span>
          </div>
        );
      } else if (status === 'pending') {
        return (
          <div class="mr-3">
            <Button
              size="sm"
              color="yellow"
              onClick={() => onClickCancelRefundRequest(product)}
            >
              <FaBan size={25} />
              <div class="flex flex-col items-start ml-1">
                <span class="text-xs">Cancel</span>
                <span class="text-xs">Refund</span>
                <span class="text-xs">Request</span>
              </div>
            </Button>
          </div>
        );
      } else {
        return (
          <div class="mr-3">
            <Button
              size="sm"
              color="red"
              disabled={daysPast > 30}
              onClick={() => onClickCreateRefundRequest(product)}
            >
              <FaHandHoldingUsd size={25} />
              <div class="flex flex-col ml-1">
                <span class="text-xs">Request</span>
                <span class="text-xs">Refund</span>
              </div>
            </Button>
          </div>
        );
      }
    }
  };

  const CardHeader = () => {
    const [date, time] = parseDateTime(order.date, 'dateAndTime');
    return (
      <div class="flex flex-row justify-between  items-center">
        <div class="flex flex-col justify-start ">
          <div class="flex flex-row gap-2">
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

        <div class="flex flex-row items-center  gap-2">
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

  const CardProducts = () => {
    return (
      <div class="flex flex-col gap-2 py-4">
        {order.products.map((product) => {
          const int = Math.floor(product.buyPrice);
          const dec = Math.round((product.buyPrice - int).toFixed(2) * 100);

          return (
            <div class="w-full flex items-center">
              {order.status == 'delivered' && (
                <RefundSection product={product} />
              )}

              <div class="overflow-hidden rounded-lg w-24 h-24 bg-gray-50 border border-gray-200">
                <img src={product.imageURL} alt={product._id} />
              </div>
              <div class="flex-grow pl-3">
                <div className="font-semibold uppercase font-medium text-blue-600 hover:underline dark:text-blue-500">
                  <Link to={'/product/' + product._id}>{product.name}</Link>
                </div>

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

  const CardFooter = () => {
    return (
      <div class="flex flex-row  py-4 items-center justify-between">
        <div class="flex flex-row gap-4 text-gray-400">
          {user._id == order.userID && (
            <Button
              color="light"
              disabled={order.status !== 'processing'}
              onClick={(e) => {
                e.preventDefault();
                onClickCancelOrder();
              }}
            >
              <div>Cancel Order</div>
            </Button>
          )}
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
      <span class="">
        <div class="flex flex-row gap-2 items-center text-3xl py-2 px-4 bg-gray-100 rounded-3xl">
          <div
            onClick={() => {
              navigate(-1);
            }}
            class="cursor-pointer"
          >
            <IoMdArrowBack size="35" />
          </div>
          <span class="">Order</span>
          <span class="text-gray-500 font-semibold tracking-tight">
            #{order._id}
          </span>
        </div>
      </span>
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
