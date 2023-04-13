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
  const [groupedComments, setGroupedComments] = useState({});

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

  const onClickApprove = async (commentObject) => {
    commentObject.status = 'approved';

    // Update comment status in db
    const updatedComment = await CommentService.updateCommentStatus({
      commentID: commentObject._id,
      newStatus: 'approved',
    });

    const updatedGroupedComments = { ...groupedComments };

    // Remove comment from pending
    updatedGroupedComments.pending = updatedGroupedComments.pending.filter(
      (comment) => comment._id !== commentObject._id
    );

    // Add comment to approved
    if (updatedGroupedComments.approved) {
      updatedGroupedComments.approved.push(commentObject);
    } else {
      updatedGroupedComments.approved = [commentObject];
    }

    setGroupedComments({ ...updatedGroupedComments });
  };

  const onClickReject = async (commentObject) => {
    commentObject.status = 'rejected';

    // Update comment status in db
    const updatedComment = await CommentService.updateCommentStatus({
      commentID: commentObject._id,
      newStatus: 'rejected',
    });

    const updatedGroupedComments = { ...groupedComments };

    // Remove comment from pending
    updatedGroupedComments.pending = updatedGroupedComments.pending.filter(
      (comment) => comment._id !== commentObject._id
    );

    // Add comment to rejected
    if (updatedGroupedComments.rejected) {
      updatedGroupedComments.rejected.push(commentObject);
    } else {
      updatedGroupedComments.rejected = [commentObject];
    }

    setGroupedComments({ ...updatedGroupedComments });
  };

  useEffect(() => {
    fetchComments();
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
            <Table.HeadCell></Table.HeadCell>

            <Table.HeadCell>Product</Table.HeadCell>
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
                  <Table.Cell width="100px">
                    <img
                      src={comment.product.imageURL}
                      alt={comment.product.name}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to="/product"
                      state={{ product: comment.product }}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {comment.product.name}
                    </Link>
                  </Table.Cell>

                  <Table.Cell>{comment.user.name}</Table.Cell>

                  <Table.Cell>{comment.title}</Table.Cell>

                  <Table.Cell>{comment.description}</Table.Cell>

                  <Table.Cell>
                    {date} {time}
                  </Table.Cell>

                  <Table.Cell>
                    {comment.status === 'pending' ? (
                      <div class="flex flex-row gap-3">
                        <Button
                          onClick={() => {
                            onClickApprove(comment);
                          }}
                          color="green"
                          size="sm"
                        >
                          Approve
                        </Button>

                        <Button
                          onClick={() => {
                            onClickReject(comment);
                          }}
                          color="red"
                          size="sm"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : comment.status == 'approved' ? (
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
  const [groupedComments, setGroupedComments] = useState({});

  const fetchComments = async () => {
    setLoading(true);

    // Fetch comments
    const fetchedComments = await CommentService.getMyComments();

    // Group comments by status
    const groupedComments = groupBy(fetchedComments, 'status');
    setGroupedComments(groupedComments);

    console.log(groupedComments);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const CustomTabs = () => {
    return (
      <div class="flex flex-row items-center justify-center">
        <Tabs.Group
          aria-label="Tabs with icons"
          style="underline"
          class="flex flex-row items-center gap-3 justify-center"
        >
          <Tabs.Item active={true} title="Pending" icon={TbClockHour8}>
            <CustomTable comments={groupedComments.pending} />
          </Tabs.Item>
          <Tabs.Item title="Approved" icon={TbThumbUp}>
            <CustomTable comments={groupedComments.approved} />
          </Tabs.Item>
          <Tabs.Item title="Rejected" icon={TbThumbDown}>
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
            <Table.HeadCell></Table.HeadCell>

            <Table.HeadCell>Product</Table.HeadCell>
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
                  <Table.Cell width="100px">
                    <img
                      src={comment.product.imageURL}
                      alt={comment.product.name}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to="/product"
                      state={{ product: comment.product }}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {comment.product.name}
                    </Link>
                  </Table.Cell>

                  <Table.Cell>{comment.title}</Table.Cell>

                  <Table.Cell>{comment.description}</Table.Cell>

                  <Table.Cell>
                    {date} {time}
                  </Table.Cell>

                  <Table.Cell>
                    {comment.status === 'pending' ? (
                      <div class="text-yellow-400 tracking-tight font-bold">
                        Pending
                      </div>
                    ) : comment.status == 'approved' ? (
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

const CommentsPage = () => {
  if (user.role == 'admin' || user.role == 'productManager') {
    return <CommentPageAsProductManager />;
  } else {
    return <CommentPageAsCustomer />;
  }
};

export default CommentsPage;
