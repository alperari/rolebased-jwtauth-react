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

    setComments(fetchedComments);

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const CustomTimelineItem = ({ title, time, body, icon }) => {
    const date = parseDateTime(time, 'onlyDate');

    return (
      <Timeline.Item>
        <Timeline.Point icon={icon} />
        <Timeline.Content>
          <Timeline.Time>{date}</Timeline.Time>
          <Timeline.Title>{title}</Timeline.Title>
          <Timeline.Body>{body}</Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
    );
  };

  const CommentsSection = () => {
    return (
      <Card>
        <span class="text-xl text-gray-900 font-bold text-center">
          Comments
        </span>

        <div class="overflow-auto max-h-screen pl-6 pt-6 ">
          <div class="flex flex-col gap-4">
            <Timeline>
              <CustomTimelineItem
                title="Marketing UI design in Figma"
                time="2023-03-30T14:03:35.778+00:00"
                body="All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project."
                icon={HiCalendar}
              />
              <CustomTimelineItem
                title="Marketing UI design in Figma"
                time="2023-03-30T14:03:35.778+00:00"
                body="All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project."
                icon={HiCalendar}
              />
              <CustomTimelineItem
                title="Marketing UI design in Figma"
                time="2023-03-30T14:03:35.778+00:00"
                body="All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project."
                icon={HiCalendar}
              />
              <CustomTimelineItem
                title="Marketing UI design in Figma"
                time="2023-03-30T14:03:35.778+00:00"
                body="All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project."
                icon={HiCalendar}
              />
            </Timeline>
          </div>
        </div>
      </Card>
    );
  };

  const RatingsSection = () => {
    return (
      <Card>
        <div class="flex flex-col gap-3 items-center">
          <span class="text-lg text-gray-900 font-bold ">Ratings</span>
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
