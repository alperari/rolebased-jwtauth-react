import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Rating,
  Carousel,
  Timeline,
  Spinner,
  Label,
  TextInput,
} from 'flowbite-react';
import {
  HiCalendar,
  HiArrowNarrowRight,
  HiCheckCircle,
  HiXCircle,
  HiX,
  HiOutlineCheckCircle,
  HiOutlineBan,
} from 'react-icons/hi';
import ReactStars from 'react-stars';

import { ProductService } from '../../services/ProductService';
import { CommentService } from '../../services/CommentService';
import { UserService } from '../../services/UserService';
import { RatingService } from '../../services/RatingService';

import { useLocation } from 'react-router-dom';

import VerticalProductCard from '../../components/Product/VerticalProductCard';
import { Ratings } from '../../components/Product/Ratings';
import { Price } from '../../components/Product/Price';

import { parseDateTime } from '../../helpers/helperFunctions';

let user = localStorage.getItem('user');
if (user) {
  user = JSON.parse(user);
}

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state;

  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [confirmingRating, setConfirmingRating] = useState(false);

  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [yourRating, setYourRating] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);

  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stock, setStock] = useState(product.quantity);

  const onRatingChanged = (newRating) => {
    // TODO: Update rating in database by sending request to API

    // Set new rating in state
    setSelectedStars(newRating);
  };

  const onConfirmRating = async () => {
    try {
      setConfirmingRating(true);

      // Update rating in database by sending request to API
      await RatingService.addRating({
        productID: product._id,
        stars: selectedStars,
      });

      // Update rating in product state
      const myRatingInProductState = ratings.find(
        (rating) => rating.userID === user._id
      );

      // If i already have a rating, update it
      if (myRatingInProductState) {
        myRatingInProductState.stars = yourRating;
      }

      // If i don't have a rating, add it
      else {
        ratings.push({
          userID: user._id,
          productID: product._id,
          stars: selectedStars,
        });
      }
      // Disable "confirm" button
      setYourRating(selectedStars);

      setConfirmingRating(false);
    } catch (err) {
      console.log(err);
      setConfirmingRating(false);
    }
  };

  const onStockInputChange = async (e) => {
    setStock(e.target.value);
  };

  const onEditStockButtonPress = async () => {
    setIsEditingStock(true);
  };

  const onEditStockConfirm = async () => {
    if (isEditingStock) {
      //TODO: Edit stock in database

      // Update stock in product state
      setStock(stock);

      setIsEditingStock(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);

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

    setLoadingComments(false);
  };

  const fetchRatings = async () => {
    setLoadingRatings(true);

    // Fetch ratings
    const fetchedRatings = await RatingService.getRatingsByProductId({
      productID: product._id,
    });

    // If user already rated this product, set yourRating state
    const myRating = fetchedRatings.find(
      (rating) => rating.userID === user._id
    );

    if (myRating) {
      setYourRating(myRating.stars);
      setSelectedStars(myRating.stars);
    }

    setRatings(fetchedRatings);

    setLoadingRatings(false);
  };

  useEffect(() => {
    fetchComments();
    fetchRatings();
  }, [yourRating]);

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
    // If user is not logged in, don't show rate section
    if (!user) return null;

    return (
      <div class="flex flex-col mt-8 items-center">
        {yourRating > 0 ? (
          <span class="text-lg font-normal font-thin">
            <b>You already rated this product</b>
          </span>
        ) : (
          <span class="text-lg font-normal font-thin">
            <b>Rate this product</b>
          </span>
        )}

        <ReactStars
          value={selectedStars}
          count={5}
          onChange={onRatingChanged}
          size={48}
          edit={yourRating == 0 || selectedStars == 0}
          color2={'#e3a008'}
          half={false}
        />

        <div class="flex flex-row gap-3">
          <Button
            color="light"
            disabled={yourRating == 0 && selectedStars == 0}
            onClick={(e) => {
              e.preventDefault();
              setSelectedStars(0);
            }}
          >
            Clear
          </Button>
          <Button
            disabled={yourRating === selectedStars}
            onClick={(e) => {
              e.preventDefault();
              onConfirmRating();
            }}
          >
            {confirmingRating ? <Spinner size="sm" /> : 'Confirm'}
          </Button>
        </div>
      </div>
    );
  };

  const RatingsSection = () => {
    if (loadingRatings) {
      return (
        <Card>
          <div class="flex flex-col gap-3 items-center">
            <Spinner size="lg" />
          </div>
        </Card>
      );
    }

    return (
      <Card>
        <div class="flex flex-col gap-3 items-center">
          <span class="text-md text-gray-900 font-bold ">
            Ratings ({ratings.length})
          </span>
          <Ratings ratings={ratings} size="lg" />

          <Rate />
        </div>
      </Card>
    );
  };

  const StockSection = () => {
    // if (!user || user.role !== 'admin' || user.role !== 'productManager') return null;
    return (
      <div class="flex flex-row gap-6 mt-8 items-center">
        <div class="flex flex-col gap-1">
          <Label htmlFor="stock" value="Edit Stocks" />
          <TextInput
            id="stock"
            type="number"
            placeholder="0"
            value={stock}
            required={true}
            onChange={onStockInputChange}
          />
        </div>
        {/* {product.quantity > 0 ? (
          <div class="flex flex-row gap-1 items-center">
            <HiOutlineCheckCircle color="green" size={30} />
            <span className="text-xl text-green-500 font-bold">In stock</span>
          </div>
        ) : (
          <div class="flex flex-row gap-1 items-center">
            <HiOutlineBan color="red" size={30} />
            <span className="text-xl text-red-500 font-bold">Out of stock</span>
          </div>
        )} */}
      </div>
    );

    return <div></div>;
  };

  return (
    <div class="m-20 grid grid-cols-5 gap-1 ">
      <div class="col-span-2 flex flex-col ">
        <Card>
          <div class="flex flex-row w-full items-center justify-center">
            <div className="h-96 w-96">
              <Carousel leftControl={' '} rightControl={' '} indicators={false}>
                <img src={product.imageURL} alt={product.name} />
              </Carousel>
            </div>
          </div>

          <div class="details flex flex-col gap-2">
            <div class="flex flex-row justify-between">
              <span className="text-m italic tracking-tight text-gray-900 dark:text-white">
                {product.category}
              </span>
              <span className="text-m italic tracking-tight text-gray-400 dark:text-white">
                id: {product._id}
              </span>
            </div>
            <span class="font-bold text-xl">{product.name}</span>
            <span class="text-lg">{product.description}</span>
          </div>

          <div class="flex flex-row gap-1 mt-4">
            <span class="text-lg tracking-tight text-gray-400 dark:text-white">
              Distributed by
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-400 dark:text-white">
              {product.distributor}
            </span>
          </div>

          <StockSection />

          <div className="flex flex-row mt-12 gap-5 items-center   justify-between">
            <div class="flex-col">
              <Label htmlFor="price" value="Price" />
              <Price product={product} />
            </div>

            <div className="px-8">
              <Label htmlFor="quantity" value="Quantity" />
              <TextInput
                id="quantity"
                type="number"
                placeholder="1"
                required={true}
              />
            </div>

            <Button>Add to cart</Button>
          </div>
        </Card>
      </div>

      <div class="flex flex-col col-span-3 pl-24 pr-4 gap-6">
        <CommentsSection />
        <RatingsSection />
      </div>
    </div>
  );
};

export default ProductPage;
