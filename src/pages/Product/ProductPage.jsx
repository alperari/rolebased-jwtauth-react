import React, { useEffect, useState } from 'react';
import { Card, Button, Rating, Carousel, Timeline } from 'flowbite-react';
import { HiCalendar, HiArrowNarrowRight } from 'react-icons/hi';
import ReactStars from 'react-stars';

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
  console.log(product.ratings);

  // const product = props.location.state.product;
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [yourRating, setYourRating] = useState(0);

  const onRatingChanged = (newRating) => {
    // TODO: Update rating in database by sending request to API

    // Set new rating in state
    setYourRating(newRating);

    // // Update rating in product state
    // const myRatingInProductState = product.ratings.find(
    //   (rating) => rating.userID === user._id
    // );

    // // If i already have a rating, update it
    // if (myRatingInProductState) {
    //   myRatingInProductState.stars = newRating;
    // }

    // // If i don't have a rating, add it
    // else {
    //   product.ratings.push({
    //     userID: user._id,
    //     productID: product._id,
    //     stars: newRating,
    //   });
    // }
  };

  const fetchMyRating = async () => {
    const myRating = product.ratings.find(
      (rating) => rating.userID === user._id
    );

    if (myRating) {
      setYourRating(myRating.stars);
    }
  };

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
    fetchMyRating();
  }, []);

  const CustomTimelineItem = ({ comment }) => {
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

  const Rate = () => {
    if (!user) return null;

    const didRate = yourRating > 0;

    return (
      <div class="flex flex-col mt-8 items-center">
        <span class="text-lg font-normal font-thin">
          <b>Rate this product!</b>
        </span>
        <ReactStars
          value={yourRating}
          count={5}
          onChange={onRatingChanged}
          size={48}
          color2={'#e3a008'}
          half={false}
        />

        <div class="flex flex-row gap-3">
          <Button
            color="failure"
            disabled={!didRate}
            onClick={() => {
              setYourRating(0);
            }}
          >
            Cancel
          </Button>
          <Button disabled={!didRate} onClick={() => {}}>
            Confirm
          </Button>
        </div>
      </div>
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

          <Rate />
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
