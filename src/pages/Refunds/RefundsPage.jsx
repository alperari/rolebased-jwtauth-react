import React, { useEffect, useState } from 'react';

import { HiCalendar } from 'react-icons/hi';
import {
  TbSortAscending,
  TbSortDescending,
  TbClockHour8,
  TbBan,
  TbThumbUp,
  TbThumbDown,
} from 'react-icons/tb';

import { Button, Card, Table, Tabs } from 'flowbite-react';

import { RefundService } from '../../services/RefundService';

import { useParams, useNavigate, Link } from 'react-router-dom';

import { parseDateTime, groupBy } from '../../helpers/helperFunctions';

const user = JSON.parse(localStorage.getItem('user'));

const RefundsPageAsSalesManager = () => {
  const [loading, setLoading] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [groupedRefunds, setGroudpedRefunds] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });

  const navigate = useNavigate();

  const fetchMyRefunds = async () => {
    setLoading(true);

    const fetchedRefunds = await RefundService.getAllRefunds();

    if (fetchedRefunds.error) {
      alert(fetchedRefunds.error);
      return;
    }

    // Group refunds by status
    const groupedRefunds = groupBy(fetchedRefunds, 'status');

    // Set grouped refunds
    setGroudpedRefunds(groupedRefunds);

    setRefunds(fetchedRefunds);

    setLoading(false);
  };

  const onClickApproveRefund = async (refund) => {
    const response = await RefundService.approveRefundRequest({
      refundID: refund._id,
    });

    if (response.error) {
      alert(response.error);
      return;
    }

    // Update refunds
    const updatedRefunds = refunds.map((r) => {
      if (r._id === refund._id) {
        r.status = 'approved';
      }

      return r;
    });

    // Group refunds by status
    const groupedRefunds = groupBy(updatedRefunds, 'status');

    // Set grouped refunds
    setGroudpedRefunds({ ...groupedRefunds });
  };

  const onClickRejectRefund = async (refund) => {
    const response = await RefundService.rejectRefundRequest({
      refundID: refund._id,
    });

    if (response.error) {
      alert(response.error);
      return;
    }

    // Update refunds
    const updatedRefunds = refunds.map((r) => {
      if (r._id === refund._id) {
        r.status = 'rejected';
      }

      return r;
    });

    // Group refunds by status
    const groupedRefunds = groupBy(updatedRefunds, 'status');

    // Set grouped refunds
    setGroudpedRefunds({ ...groupedRefunds });
  };

  useEffect(() => {
    fetchMyRefunds();
  }, []);

  const CustomTable = ({ refunds }) => {
    if (!refunds || refunds.length === 0) {
      return (
        <div>
          <h1>No refunds found</h1>
        </div>
      );
    } else {
      return (
        <div class="w-screen px-12">
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>Product (Amount)</Table.HeadCell>
              <Table.HeadCell>Order</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>

              <Table.HeadCell>Request Date</Table.HeadCell>

              <Table.HeadCell>Total</Table.HeadCell>

              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {refunds.map((refund) => {
                const [date, time] = parseDateTime(refund.date);

                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell width="100px">
                      <img
                        class="overflow-hidden rounded-lg w-12 h-12 bg-gray-50 border border-gray-200"
                        src={refund.productDetails.imageURL}
                        alt={refund.productDetails.name}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div class="flex flex-row items-center gap-1">
                        <Link
                          to={'/product/' + refund.productID}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          {refund.productID}
                        </Link>
                        <span class="text-gray-500">({refund.quantity})</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <Link
                        to={'/order/' + refund.orderID}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {refund.orderID}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>
                      <div class="flex flex-col">
                        {refund.user.name}
                        <span class="text-green-400 font-semibold">
                          {' '}
                          ({refund.user.email})
                        </span>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      {date} {time}
                    </Table.Cell>

                    <Table.Cell>
                      <span class="font-semibold">
                        ${refund.price.toFixed(2)}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      {refund.status === 'pending' ? (
                        <div class="flex flex-row gap-3">
                          <Button
                            onClick={() => {
                              onClickApproveRefund(refund);
                            }}
                            color="green"
                            size="sm"
                          >
                            Approve
                          </Button>

                          <Button
                            onClick={() => {
                              onClickRejectRefund(refund);
                            }}
                            color="red"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : refund.status == 'approved' ? (
                        <div class="text-green-400 tracking-tight font-bold">
                          Approved
                        </div>
                      ) : (
                        <div class="text-red-400 tracking-tight font-bold">
                          Rejected
                        </div>
                      )}
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

  const CustomTabs = () => {
    return (
      <div class="flex flex-row items-center justify-center">
        <Tabs.Group
          aria-label="Tabs with icons"
          style="underline"
          class="flex flex-row items-center gap-3 justify-center"
        >
          <Tabs.Item active={true} title="Pending" icon={TbClockHour8}>
            <CustomTable refunds={groupedRefunds.pending} />
          </Tabs.Item>
          <Tabs.Item title="Approved" icon={TbThumbUp}>
            <CustomTable refunds={groupedRefunds.approved} />
          </Tabs.Item>
          <Tabs.Item title="Rejected" icon={TbThumbDown}>
            <CustomTable refunds={groupedRefunds.rejected} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    );
  };

  return (
    <div class="flex flex-col mx-32 py-12">
      <span class="font-semibold text-3xl text-center">Refunds</span>
      <span class="font text-l text-center mb-12">
        You can view & update refunds as a sales manager
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <CustomTabs />
      )}
    </div>
  );
};

const RefundsPageAsCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [groupedRefunds, setGroudpedRefunds] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });

  const navigate = useNavigate();

  const fetchMyRefunds = async () => {
    setLoading(true);

    const fetchedRefunds = await RefundService.getMyRefunds();

    if (fetchedRefunds.error) {
      alert(fetchedRefunds.error);
      return;
    }

    // Group refunds by status
    const groupedRefunds = groupBy(fetchedRefunds, 'status');

    // Set grouped refunds
    setGroudpedRefunds(groupedRefunds);

    setRefunds(fetchedRefunds);

    setLoading(false);
  };

  useEffect(() => {
    fetchMyRefunds();
  }, []);

  const CustomTable = ({ refunds }) => {
    if (!refunds || refunds.length === 0) {
      return (
        <div>
          <h1>No refunds found</h1>
        </div>
      );
    } else {
      return (
        <div class="w-screen px-12">
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>Product</Table.HeadCell>
              <Table.HeadCell>Order</Table.HeadCell>

              <Table.HeadCell>Request Date</Table.HeadCell>

              <Table.HeadCell>Total</Table.HeadCell>

              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {refunds.map((refund) => {
                const [date, time] = parseDateTime(refund.date);

                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell width="100px">
                      <img
                        class="overflow-hidden rounded-lg w-12 h-12 bg-gray-50 border border-gray-200"
                        src={refund.productDetails.imageURL}
                        alt={refund.productDetails.name}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={'/product/' + refund.productID}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {refund.productID}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>
                      <Link
                        to={'/order/' + refund.orderID}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {refund.orderID}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>
                      {date} {time}
                    </Table.Cell>

                    <Table.Cell>
                      <span class="font-semibold">
                        ${refund.price.toFixed(2)}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      {refund.status === 'pending' ? (
                        <div class="text-yellow-400 tracking-tight font-bold">
                          Pending
                        </div>
                      ) : refund.status == 'approved' ? (
                        <div class="text-green-400 tracking-tight font-bold">
                          Approved
                        </div>
                      ) : (
                        <div class="text-red-400 tracking-tight font-bold">
                          Rejected
                        </div>
                      )}
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

  const CustomTabs = () => {
    return (
      <div class="flex flex-row items-center justify-center">
        <Tabs.Group
          aria-label="Tabs with icons"
          style="underline"
          class="flex flex-row items-center gap-3 justify-center"
        >
          <Tabs.Item active={true} title="Pending" icon={TbClockHour8}>
            <CustomTable refunds={groupedRefunds.pending} />
          </Tabs.Item>
          <Tabs.Item title="Approved" icon={TbThumbUp}>
            <CustomTable refunds={groupedRefunds.approved} />
          </Tabs.Item>
          <Tabs.Item title="Rejected" icon={TbThumbDown}>
            <CustomTable refunds={groupedRefunds.rejected} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    );
  };

  return (
    <div class="flex flex-col mx-32 my-24">
      <span class="font-bold text-center mb-8">My Refunds</span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <CustomTabs />
      )}
    </div>
  );
};

const RefundsPage = () => {
  if (user.role == 'admin' || user.role == 'salesManager') {
    return <RefundsPageAsSalesManager />;
  } else {
    return <RefundsPageAsCustomer />;
  }
};

export default RefundsPage;
