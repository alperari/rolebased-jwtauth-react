import React, { useEffect, useState } from 'react';
import { TextInput, Label, Table, Button } from 'flowbite-react';
import { AiFillFilePdf } from 'react-icons/ai';

import { OrderService } from '../../services/OrderService';

import { Link, useNavigate } from 'react-router-dom';
import { parseDateTime } from '../../helpers/helperFunctions';

const AllReceiptsPage = () => {
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);

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
      return (
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Order</Table.HeadCell>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell>Receipt</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {receipts.map((receipt) => {
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
      );
    }
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
        <ReceiptsTable />
      )}
    </div>
  );
};

export default AllReceiptsPage;
