import React, { useEffect, useState } from 'react';
import { TextInput, Label, Table, Button, Card } from 'flowbite-react';
import { AiFillFilePdf } from 'react-icons/ai';

import { OrderService } from '../../services/OrderService';
import { RefundService } from '../../services/RefundService';

import { IntervalPicker } from '../../components/Product/DatePicker';

import { Link, useNavigate } from 'react-router-dom';
import {
  parseDateTime,
  getDateDaysAgo,
  convertDateToDDmmYYYY,
} from '../../helpers/helperFunctions';

const AllInvoicesPage = () => {
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const [startDate, setStartDate] = useState(getDateDaysAgo(30));
  const [endDate, setEndDate] = useState(getDateDaysAgo(0));

  const navigate = useNavigate();

  const fetchAllReceipts = async () => {
    setLoading(true);

    const fetchedOrders = await OrderService.getAllReceipts();

    // Fetch orders
    fetchedOrders.forEach((order) => {
      order._id = order.orderID;
      order.transactionType = 'Order';
    });

    // Fetch refunds
    const fetchedRefunds = await RefundService.getApprovedRefunds();
    fetchedRefunds.forEach((refund) => {
      refund.transactionType = 'Refund';
      refund.total = refund.price;
    });

    // Put them into a common shape

    const allReceipts = [...fetchedOrders, ...fetchedRefunds].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setReceipts(allReceipts);
    setLoading(false);
  };

  const calculateRevenue = () => {
    const filteredReceipts = receipts.filter((receipt) => {
      const [date, time] = parseDateTime(receipt.date);

      const receiptDate = new Date(date);
      const receiptDateWithoutTime = new Date(
        receiptDate.getFullYear(),
        receiptDate.getMonth(),
        receiptDate.getDate()
      );

      return (
        receiptDateWithoutTime >= startDate && receiptDateWithoutTime <= endDate
      );
    });

    let revenue = 0;

    filteredReceipts.forEach((receipt) => {
      if (receipt.transactionType === 'Order') {
        revenue += receipt.total;
      } else {
        revenue -= receipt.total;
      }
    });

    return revenue.toFixed(2);
  };

  useEffect(() => {
    fetchAllReceipts();
  }, []);

  const ReceiptsTable = () => {
    if (!receipts || receipts.length === 0) {
      return (
        <div>
          <h1>No receipts found</h1>
        </div>
      );
    } else {
      // Filter receipts by date [startDate, endDate]
      const filteredReceipts = receipts.filter((receipt) => {
        const [date, time] = parseDateTime(receipt.date);

        const receiptDate = new Date(date);
        const receiptDateWithoutTime = new Date(
          receiptDate.getFullYear(),
          receiptDate.getMonth(),
          receiptDate.getDate()
        );

        return (
          receiptDateWithoutTime >= startDate &&
          receiptDateWithoutTime <= endDate
        );
      });

      return (
        <div class="flex flex-col gap-5 max-h-screen">
          <div class="text-m text-center py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
            Showing{' '}
            <span class="font-bold text-red-700">
              {filteredReceipts.length}{' '}
            </span>
            invoices between{' '}
            <span class="font-bold text-red-700">
              {convertDateToDDmmYYYY(startDate)}
            </span>{' '}
            and{' '}
            <span class="font-bold text-red-700">
              {convertDateToDDmmYYYY(endDate)}
            </span>
          </div>

          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Transaction Type</Table.HeadCell>

              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Total</Table.HeadCell>
              <Table.HeadCell>Receipt</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {filteredReceipts.map((receipt) => {
                const [date, time] = parseDateTime(receipt.date);

                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {receipt.transactionType === 'Order' ? (
                        <Link
                          to={'/order/' + receipt._id}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          {receipt._id}
                        </Link>
                      ) : (
                        <span className="font-medium ">{receipt._id}</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {receipt.transactionType === 'Order' ? (
                        <span>
                          <span class=" gap-1 py-2 px-4 bg-green-400 rounded-3xl font-semibold text-white ">
                            Order
                          </span>
                        </span>
                      ) : (
                        <span>
                          <span class=" gap-1 py-2 px-4 bg-red-400 rounded-3xl font-semibold text-white">
                            Refund
                          </span>
                        </span>
                      )}
                    </Table.Cell>

                    <Table.Cell>{receipt.userID}</Table.Cell>

                    <Table.Cell>
                      {date} {time}
                    </Table.Cell>

                    <Table.Cell>
                      {receipt.transactionType === 'Order' ? (
                        <span class="font-bold text-green-600">
                          ${receipt.total.toFixed(2)}
                        </span>
                      ) : (
                        <span class="font-bold text-red-600">
                          -${receipt.total.toFixed(2)}
                        </span>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <Button
                        gradientDuoTone="pinkToOrange"
                        onClick={() => {
                          window.location.href = receipt.receiptURL;
                        }}
                      >
                        <div class="flex items-center flex-row gap-2">
                          {'Receipt'}
                          <AiFillFilePdf size={25} />{' '}
                        </div>
                      </Button>
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

  const IntervalSection = () => {
    return (
      <div class="flex flex-col items-center gap-2 mb-8">
        <IntervalPicker
          color={'blue'}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <Button.Group>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              console.log('receipts.slice(-1):', receipts.slice(-1));
              const oldestReceiptDate = new Date(
                receipts.slice(-1)[0].date.split('T')[0]
              );
              const oldestReceiptDateWithoutTime = new Date(
                oldestReceiptDate.getFullYear(),
                oldestReceiptDate.getMonth(),

                oldestReceiptDate.getDate()
              );

              setStartDate(oldestReceiptDateWithoutTime);
              setEndDate(getDateDaysAgo(0));
            }}
          >
            All
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(90 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 90 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(30 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 30 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(15 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 15 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(7 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 7 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(3 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 3 Days
          </Button>
        </Button.Group>
      </div>
    );
  };

  return (
    <div class="flex flex-col mx-32 py-12">
      <span class="font-semibold text-3xl text-center">Invoices</span>
      <span class="font text-l text-center mb-4">
        You can view all invoices here
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <div class="flex flex-col">
          <IntervalSection />

          <ReceiptsTable />

          <div class="my-6">
            <Card>
              <div class="flex flex-row justify-between py-2 font-bold tracking-tight text-xl">
                <div>Revenue</div>
                <div class="flex flex-row gap-1">
                  <span>$</span>
                  <span>{calculateRevenue()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInvoicesPage;
