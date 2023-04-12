import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Tabs } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  TbSortAscending,
  TbSortDescending,
  TbClockHour8,
  TbBan,
  TbThumbUp,
  TbThumbDown,
} from 'react-icons/tb';

import { groupBy, parseDateTime } from '../../helpers/helperFunctions';

import { ProductService } from '../../services/ProductService';
import { RatingService } from '../../services/RatingService';
import { CommentService } from '../../services/CommentService';

const user = JSON.parse(localStorage.getItem('user'));

const CommentPageAsProductManager = () => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [groupedComments, setGroupedComments] = useState({});

  const navigate = useNavigate();

  const fetchComments = async () => {
    setLoading(true);

    // Fetch comments
    const fetchedComments =
      await CommentService.getAllCommentsWithUserAndProduct();

    // Group comments by status
    const groupedComments = groupBy(fetchedComments, 'status');
    setGroupedComments(groupedComments);

    setLoading(false);
  };

  useEffect(() => {
    // fetchComments();
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
            active={true}
            title="Pending"
            icon={TbClockHour8}
            color="yellow"
          >
            <CustomTable comments={groupedComments.pending} />
          </Tabs.Item>
          <Tabs.Item title="Approved" icon={TbThumbUp}>
            <CustomTable comments={groupedComments.approved} />
          </Tabs.Item>
          <Tabs.Item title="Rejected" icon={TbThumbDown} color="red">
            <CustomTable comments={groupedComments.rejected} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    );
  };

  const CustomTable = ({ comments }) => {
    if (!comments || comments.length === 0) {
      return (
        <div>
          <h1>No comments found</h1>
        </div>
      );
    } else {
      return (
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Product Name</Table.HeadCell>
            <Table.HeadCell>User Name</Table.HeadCell>
            <Table.HeadCell>Comment Title</Table.HeadCell>
            <Table.HeadCell>Comment Description</Table.HeadCell>
            <Table.HeadCell>Comment Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {comments.map((comment) => {
              const [date, time] = parseDateTime(comment.date);

              return (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <Link
                      to="/product"
                      state={{ product: comment.product }}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      <div class="flex flex-row gap-1">
                        <img
                          src={comment.product.imageURL}
                          alt={comment.product.name}
                          width={50}
                          height={50}
                        />
                        {comment.product.name}
                      </div>
                    </Link>
                  </Table.Cell>

                  <Table.Cell>{comment.user.name}</Table.Cell>

                  <Table.Cell>{comment.title}</Table.Cell>

                  <Table.Cell>{comment.description}</Table.Cell>

                  <Table.Cell>
                    {date} {time}
                  </Table.Cell>

                  <Table.Cell>
                    <div class="flex flex-row gap-3">
                      <Button
                        onClick={() => {
                          CommentService.approveComment(comment.id);
                          fetchComments();
                        }}
                        color="green"
                        size="sm"
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={() => {
                          CommentService.rejectComment(comment.id);
                          fetchComments();
                        }}
                        color="red"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
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
    <div class="flex flex-col mx-32 my-24">
      <span class="font-bold text-center mb-8">Comments</span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <CustomTabs />
      )}
    </div>
  );
};

const CommentPageAsCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();
  return (
    <div class="flex flex-col m-24">
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Product name</Table.HeadCell>
          <Table.HeadCell>Color</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17"
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Table.Cell>
              <a
                href="/tables"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Microsoft Surface Pro
            </Table.Cell>
            <Table.Cell>White</Table.Cell>
            <Table.Cell>Laptop PC</Table.Cell>
            <Table.Cell>$1999</Table.Cell>
            <Table.Cell>
              <a
                href="/tables"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Magic Mouse 2
            </Table.Cell>
            <Table.Cell>Black</Table.Cell>
            <Table.Cell>Accessories</Table.Cell>
            <Table.Cell>$99</Table.Cell>
            <Table.Cell>
              <a
                href="/tables"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

const CommentsPage = () => {
  if (user.role == 'admin' || user.role == 'productManager') {
    return <CommentPageAsProductManager />;
  } else {
    return <CommentPageAsCustomer />;
  }
};

export default CommentsPage;
