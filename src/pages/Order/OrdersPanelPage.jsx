import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Card,
  Button,
  Label,
  TextInput,
  Checkbox,
  Tabs,
  Table,
} from 'flowbite-react';

import { groupBy, parseDateTime } from '../../helpers/helperFunctions';

import { FaTruck } from 'react-icons/fa';
import { MdBeenhere } from 'react-icons/md';
import { IoHammer } from 'react-icons/io5';
import { FaBan } from 'react-icons/fa';

import { OrderService } from '../../services/OrderService';

const OrdersPanelPage = () => {
  const [loading, setLoading] = useState(false);
  const [groupedOrders, setGroupedOrders] = useState({});

  const [activeTab, setActiveTab] = useState('processing');

  const fetchOrders = async () => {
    setLoading(true);

    // Fetch comments
    const fetchedOrders = await OrderService.getOrders();

    // Group comments by status
    const groupedOrders = groupBy(fetchedOrders, 'status');
    setGroupedOrders(groupedOrders);

    setLoading(false);
  };

  const onClickChangeStatus = async (orderObject, newStatus) => {
    const currentStatus = orderObject.status;
    setActiveTab(currentStatus);

    orderObject.status = newStatus;

    // Update order status in db
    const updatedOrder = await OrderService.updateOrderStatus({
      orderID: orderObject._id,
      newStatus: newStatus,
    });

    const updatedGroupedOrders = { ...groupedOrders };

    // Remove order from currentStatus
    updatedGroupedOrders[currentStatus] = updatedGroupedOrders[
      currentStatus
    ].filter((order) => order._id !== orderObject._id);

    // Add order to newStatus
    if (updatedGroupedOrders[newStatus]) {
      updatedGroupedOrders[newStatus].push(orderObject);
    } else {
      updatedGroupedOrders[newStatus] = [orderObject];
    }

    setGroupedOrders({ ...updatedGroupedOrders });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const CustomTabs = () => {
    return (
      <div class="flex flex-row items-center justify-center">
        <Tabs.Group
          aria-label="Tabs with icons"
          style="underline"
          class="flex flex-row items-center gap-3 justify-center"
        >
          <Tabs.Item
            active={activeTab === 'processing'}
            title="Processing"
            icon={IoHammer}
          >
            <CustomTable orders={groupedOrders.processing} />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 'in-transit'}
            title="In-Transit"
            icon={FaTruck}
          >
            <CustomTable orders={groupedOrders['in-transit']} />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 'delivered'}
            title="Delivered"
            icon={MdBeenhere}
          >
            <CustomTable orders={groupedOrders.delivered} />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 'cancelled'}
            title="Cancelled"
            icon={FaBan}
          >
            <CustomTable orders={groupedOrders.cancelled} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    );
  };

  const StatusButtons = ({ order }) => {
    if (order.status === 'processing') {
      return (
        <div class="flex flex-row gap-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'in-transit');
            }}
            color="yellow"
            size="sm"
          >
            <FaTruck size={25} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'delivered');
            }}
            color="green"
            size="sm"
          >
            <MdBeenhere size={25} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'cancelled');
            }}
            color="red"
            size="sm"
          >
            <FaBan size={25} />
          </Button>
        </div>
      );
    } else if (order.status === 'in-transit') {
      return (
        <div class="flex flex-row gap-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'processing');
            }}
            class="text-orange-700 bg-white border border-orange-500 hover:bg-orange-200 focus:ring-4 focus:ring-orange-300 disabled:hover:bg-white dark:bg-orange-600 dark:text-white dark:border-orange-600 dark:hover:bg-orange-700 dark:hover:border-orange-700 dark:focus:ring-orange-700 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg"
            size="sm"
          >
            <IoHammer size={25} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'delivered');
            }}
            color="green"
            size="sm"
          >
            <MdBeenhere size={25} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'cancelled');
            }}
            color="red"
            size="sm"
          >
            <FaBan size={25} />
          </Button>
        </div>
      );
    } else if (order.status === 'delivered') {
      return (
        <div class="flex flex-row gap-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'processing');
            }}
            class="text-orange-700 bg-white border border-orange-500 hover:bg-orange-200 focus:ring-4 focus:ring-orange-300 disabled:hover:bg-white dark:bg-orange-600 dark:text-white dark:border-orange-600 dark:hover:bg-orange-700 dark:hover:border-orange-700 dark:focus:ring-orange-700 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg"
            size="sm"
          >
            <IoHammer size={25} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'in-transit');
            }}
            color="yellow"
            size="sm"
          >
            <FaTruck size={25} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeStatus(order, 'cancelled');
            }}
            color="red"
            size="sm"
          >
            <FaBan size={25} />
          </Button>
        </div>
      );
    } else if (order.status === 'cancelled') {
      return <div class="font-semibold text-red-500">Cancelled</div>;
    }
  };

  const CustomTable = ({ orders }) => {
    if (!orders || orders.length === 0) {
      return (
        <div class="text-center">
          <h1>No orders found</h1>
        </div>
      );
    } else {
      return (
        <div class="w-screen px-12">
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Order</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Products</Table.HeadCell>

              <Table.HeadCell>Receiver Email</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {orders.map((order) => {
                const [date, time] = parseDateTime(order.date);

                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Link
                        to={'/order/' + order._id}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {order._id}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>
                      {date} {time}
                    </Table.Cell>

                    <Table.Cell>
                      <div class="flex flex-col">
                        {order.products.map((product) => {
                          return (
                            <div class="flex flex-row gap-1 font-semibold">
                              <Link
                                to={'/product/' + order._id}
                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                              >
                                {product.productID}
                              </Link>
                              <span class="text-gray-400">
                                (x{product.quantity})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </Table.Cell>

                    <Table.Cell width="200px">{order.receiverEmail}</Table.Cell>

                    <Table.Cell width="500px">{order.address}</Table.Cell>

                    <Table.Cell>
                      <StatusButtons order={order} />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      );
    }
  };

  return (
    <div class="flex flex-col mx-32 py-12">
      <span class="font-semibold text-3xl text-center">Orders</span>
      <span class="font text-l text-center mb-12">
        You can view & update orders as a sales manager
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <CustomTabs />
      )}
    </div>
  );
};

export default OrdersPanelPage;
