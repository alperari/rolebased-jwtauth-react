import React, { useEffect, useState } from 'react';
import { TextInput, Label, Table, Button } from 'flowbite-react';
import { AiFillFilePdf } from 'react-icons/ai';

import { OrderService } from '../../services/OrderService';
import { IntervalPicker } from '../../components/Product/DatePicker';

import { Link, useNavigate } from 'react-router-dom';
import {
  parseDateTime,
  getDateDaysAgo,
  convertDateToDDmmYYYY,
} from '../../helpers/helperFunctions';

const AllReceiptsPage = () => {
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const [startDate, setStartDate] = useState(getDateDaysAgo(30));
  const [endDate, setEndDate] = useState(getDateDaysAgo(0));

  const navigate = useNavigate();

  const fetchAllReceipts = async () => {
    setLoading(true);

    const fetchedReceipts = await OrderService.getAllReceipts();
    setReceipts(fetchedReceipts);

    setLoading(false);
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
        <div class="flex flex-col gap-5">
          <div class="text-m text-center py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
            Showing{' '}
            <span class="font-bold text-red-700">
              {filteredReceipts.length}{' '}
            </span>
            receipts between{' '}
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
              <Table.HeadCell>Order</Table.HeadCell>
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
                      <Link
                        to={'/order/' + receipt.orderID}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {receipt.orderID}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>{receipt.userID}</Table.Cell>

                    <Table.Cell>
                      {date} {time}
                    </Table.Cell>

                    <Table.Cell>
                      <span class="font-bold">${receipt.total.toFixed(2)}</span>
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
              const oldestReceiptDate = new Date(
                receipts[0].date.split('T')[0]
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
      <span class="font-semibold text-3xl text-center">Receipts</span>
      <span class="font text-l text-center mb-12">
        You can view all receipts here
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <div class="flex flex-col">
          <IntervalSection />
          <ReceiptsTable />
        </div>
      )}
    </div>
  );
};

export default AllReceiptsPage;
