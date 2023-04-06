import React, { useEffect, useState } from 'react';
import { Card, Button, Rating, Carousel, Timeline } from 'flowbite-react';
import { HiCalendar, HiArrowNarrowRight } from 'react-icons/hi';

import { ProductService } from '../../services/ProductService';
import { CommentService } from '../../services/CommentService';

import { useLocation } from 'react-router-dom';

import VerticalProductCard from '../../components/Product/VerticalProductCard';
import { Ratings } from '../../components/Product/Ratings';

import { parseDateTime } from '../../helpers/helperFunctions';

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

    // Fetch users from each comment (unique userIds)
    const userIds = [
      ...new Set(fetchedComments.map((comment) => comment.userID)),
    ];

    setComments(fetchedComments);

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const CustomTimelineItem = ({ title, time, description, icon }) => {
    const date = parseDateTime(time, 'onlyDate');

    return (
      <Timeline.Item>
        <Timeline.Point icon={icon} />
        <Timeline.Content>
          <Timeline.Time>{date}</Timeline.Time>
          <Timeline.Title>{title}</Timeline.Title>
          <Timeline.Body>{description}</Timeline.Body>
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
                  return (
                    <CustomTimelineItem
                      title={comment.title}
                      time={comment.date}
                      description={comment.description}
                      icon={HiCalendar}
                    />
                  );
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
          <span class="text-md text-gray-900 font-bold ">Ratings</span>
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
