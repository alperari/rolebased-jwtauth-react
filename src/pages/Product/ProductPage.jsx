import React, { useEffect, useState } from 'react';
import { Card, Button, Rating, Carousel, Timeline } from 'flowbite-react';
import { HiCalendar, HiArrowNarrowRight } from 'react-icons/hi';

import { ProductService } from '../../services/ProductService';
import { CommentService } from '../../services/CommentService';
import { UserService } from '../../services/UserService';

import { useLocation } from 'react-router-dom';

import VerticalProductCard from '../../components/Product/VerticalProductCard';
import { Ratings } from '../../components/Product/Ratings';

import { parseDateTime } from '../../helpers/helperFunctions';

let user = localStorage.getItem('user');
if (user) {
  user = JSON.parse(user);
}

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state;

  // const product = props.location.state.product;
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    setLoading(true);

    // Fetch comments
    const fetchedComments = await CommentService.getCommentsByProductId({
      productId: product._id,
    });

    // Fetch users from each comment (unique userIDs)
    const userIDs = [
      ...new Set(fetchedComments.map((comment) => comment.userID)),
    ];

    const users = await UserService.getMultipleUsersById({ ids: userIDs });

    // Match users with comments
    for (const comment of fetchedComments) {
      const user = users.find((user) => user._id === comment.userID);
      comment.user = user;
    }

    setComments(fetchedComments);

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const CustomTimelineItem = ({ comment }) => {
    console.log('comment:', comment);
    const isCommentMine = user && comment.user._id === user._id;
    const date = parseDateTime(comment.date, 'onlyDate');

    const commentorName = isCommentMine ? 'You' : comment.user.name;

    return (
      <Timeline.Item>
        <span>{commentorName}</span>

        <Timeline.Point icon={HiCalendar} />
        <Timeline.Content>
          <Timeline.Time>{date}</Timeline.Time>

          <Timeline.Title>{comment.title}</Timeline.Title>

          <Timeline.Body>{comment.description}</Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
    );
  };

  const CommentsSection = () => {
    return (
      <Card>
        <span class="text-md text-gray-900 font-bold text-center">
          Comments ({comments.length})
        </span>

        {comments.length > 0 ? (
          <div class="overflow-auto max-h-screen pl-6 pt-6 ">
            <div class="flex flex-col gap-4">
              <Timeline>
                {comments.map((comment) => {
                  return <CustomTimelineItem comment={comment} />;
                })}
              </Timeline>
            </div>
          </div>
        ) : (
          <div class="flex flex-col gap-4">
            <span class="text-md text-gray-900 text-center">
              No comments yet
            </span>
          </div>
        )}
      </Card>
    );
  };

  const RatingsSection = () => {
    return (
      <Card>
        <div class="flex flex-col gap-3 items-center">
          <span class="text-md text-gray-900 font-bold ">
            Ratings ({product.ratings.length})
          </span>
          <Ratings product={product} size="lg" />
        </div>
      </Card>
    );
  };

  return (
    <div class="m-20 grid grid-cols-5 gap-1 ">
      <div class="col-span-2">
        <div className="h-80">
          <Carousel>
            <img
              src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
              alt="..."
            />
          </Carousel>
        </div>
      </div>

      <div class="flex flex-col col-span-3 pl-24 pr-4 gap-6">
        {/* <hr class="w-full h-1 bg-gray-700 rounded dark:bg-gray-700" /> */}
        <CommentsSection />
        <RatingsSection />
      </div>
    </div>
  );
};

export default ProductPage;
