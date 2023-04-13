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
  HiOutlinePencil,
  HiX,
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiCheck,
} from 'react-icons/hi';
import ReactStars from 'react-stars';

import { ProductService } from '../../services/ProductService';
import { CommentService } from '../../services/CommentService';
import { UserService } from '../../services/UserService';
import { RatingService } from '../../services/RatingService';

import { useLocation } from 'react-router-dom';

import { Ratings } from '../../components/Product/Ratings';
import { Price } from '../../components/Product/Price';

import { parseDateTime } from '../../helpers/helperFunctions';
import { AddCommentModal } from '../../components/General/Modal';

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

  const [productFromDB, setProductFromDB] = useState(product);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [yourRating, setYourRating] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);

  // For editing stock
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stock, setStock] = useState(productFromDB.quantity);
  const [updatingStock, setUpdatingStock] = useState(false);

  // For editing price and discount
  const [isEditingPriceDiscount, setIsEditingPriceDiscount] = useState(false);
  const [price, setPrice] = useState(productFromDB.price);
  const [discount, setDiscount] = useState(productFromDB.discount);
  const [updatingPriceDiscount, setUpdatingPriceDiscount] = useState(false);

  // For adding comment
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  const onAddComment = async (title, description) => {
    try {
      // Add comment to database
      const newComment = await CommentService.addComment({
        productID: productFromDB._id,
        title: title,
        description: description,
      });

      newComment.user = {
        _id: user._id,
        name: user.name,
      };

      // Add comment to state
      const newComments = [...comments, newComment];
      setComments(newComments);

      setShowAddCommentModal(false);
    } catch (err) {
      console.log(err);
      setShowAddCommentModal(false);
    }
  };

  const onDeleteComment = async (commentID) => {
    try {
      // Delete comment from database
      await CommentService.deleteComment({ commentID });

      // Delete comment from state
      const newComments = comments.filter(
        (comment) => comment._id !== commentID
      );
      setComments(newComments);
    } catch (err) {
      console.log(err);
    }
  };

  const onRatingChanged = (newRating) => {
    // Set new rating in state
    setSelectedStars(newRating);
  };

  const onConfirmRating = async () => {
    try {
      setConfirmingRating(true);

      // Update rating in database by sending request to API
      await RatingService.addRating({
        productID: productFromDB._id,
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
          productID: productFromDB._id,
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

  const onEditStockConfirm = async (e) => {
    e.preventDefault();

    if (isEditingStock) {
      const newStock = parseInt(e.target.stock.value);

      if (newStock < 0) {
        setIsEditingStock(false);
      } else {
        // Update stock in product state
        setStock(newStock);

        // TODO: Update stock in database

        setUpdatingStock(true);

        const result = ProductService.updateQuantity({
          productID: productFromDB._id,
          quantity: newStock,
        });

        setUpdatingStock(false);

        setIsEditingStock(false);
      }
    }
  };

  const onEditPriceDiscountConfirm = async (e) => {
    e.preventDefault();

    if (isEditingPriceDiscount) {
      const newPrice = parseFloat(e.target.price.value);
      const newDiscount = parseFloat(e.target.discount.value);

      if (newPrice == null && newDiscount == null) {
        setIsEditingPriceDiscount(false);
        return;
      }

      if (newPrice < 0 || newDiscount < 0 || newDiscount > 100) {
        setIsEditingPriceDiscount(false);
        return;
      }

      setUpdatingPriceDiscount(true);

      // Update price and discount in product state
      if (newPrice != null) setPrice(newPrice);
      if (newDiscount != null) setDiscount(newDiscount);

      // TODO: Update price and discount in database

      const result = ProductService.updatePriceDiscount({
        productID: productFromDB._id,
        price: newPrice,
        discount: newDiscount,
      });

      setUpdatingPriceDiscount(false);

      setIsEditingPriceDiscount(false);
    }
  };

  const fetchProductDetails = async () => {
    const fetchedProduct = await ProductService.getProductById({
      productID: productFromDB._id,
    });

    setProductFromDB(fetchedProduct);
  };

  const fetchComments = async () => {
    setLoadingComments(true);

    // Fetch comments
    const fetchedComments = await CommentService.getApprovedCommentsByProductId(
      {
        productId: productFromDB._id,
      }
    );

    // Fetch users from each comment (unique userIDs)
    const userIDs = [
      ...new Set(fetchedComments.map((comment) => comment.userID)),
    ];

    if (userIDs.length > 0) {
      const users = await UserService.getMultipleUsersById({ ids: userIDs });

      if (users.length > 0) {
        // Match users with comments
        for (const comment of fetchedComments) {
          const user = users.find((user) => user._id === comment.userID);
          comment.user = user;
        }
      }
    }

    setComments(fetchedComments);

    setLoadingComments(false);
  };

  const fetchRatings = async () => {
    setLoadingRatings(true);

    // Fetch ratings
    const fetchedRatings = await RatingService.getRatingsByProductId({
      productID: productFromDB._id,
    });

    if (fetchedRatings.length > 0 && user) {
      // If user already rated this product, set yourRating state
      const myRating = fetchedRatings.find(
        (rating) => rating.userID === user._id
      );

      if (myRating) {
        setYourRating(myRating.stars);
        setSelectedStars(myRating.stars);
      }
    }

    setRatings(fetchedRatings);

    setLoadingRatings(false);
  };

  useEffect(() => {
    fetchComments();
    fetchRatings();
    fetchProductDetails();
  }, [yourRating, stock, price, discount, showAddCommentModal]);

  const CustomTimelineItem = ({ comment }) => {
    const isCommentMine = user && comment.user._id === user._id;
    const date = parseDateTime(comment.date, 'onlyDate');

    const commentorName = isCommentMine ? 'You' : comment.user.name;

    return (
      <Timeline.Item>
        <div class="flex flex-row items-center justify-between">
          <div>
            <span>{commentorName}</span>

            <Timeline.Point icon={HiCalendar} />
            <Timeline.Content>
              <Timeline.Time>{date}</Timeline.Time>

              <Timeline.Title>{comment.title}</Timeline.Title>

              <Timeline.Body>{comment.description}</Timeline.Body>
            </Timeline.Content>
          </div>

          {isCommentMine && (
            <div class="flex flex-row justify-between items-end">
              <Button
                color="light"
                onClick={(e) => {
                  e.preventDefault();

                  onDeleteComment(comment._id);
                }}
              >
                <HiX color="red" size={20} />
              </Button>
            </div>
          )}
        </div>
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
        {user && (
          <Button
            onClick={() => {
              setShowAddCommentModal(true);
            }}
          >
            Make Comment
          </Button>
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

  const EditStockSection = () => {
    return (
      <div class="flex flex-col gap-1">
        <Label htmlFor="stock" value="Stock" />
        <form onSubmit={onEditStockConfirm}>
          <div class="flex flex-row gap-2 items-center">
            <TextInput
              disabled={!isEditingStock}
              id="stock"
              type="number"
              placeholder={productFromDB.quantity}
              required={true}
            />
            {isEditingStock ? (
              <div class="flex flex-row gap-2">
                <Button
                  color="light"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditingStock(false);
                  }}
                >
                  <HiX size={20} color="red" />
                </Button>
                <Button color="light" type="submit">
                  <HiCheck size={20} color="green" />
                </Button>
              </div>
            ) : (
              <Button
                color="light"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditingStock(true);
                }}
              >
                {updatingStock ? (
                  <Spinner size="sm" />
                ) : (
                  <HiOutlinePencil size={20} />
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  };

  const StockStatusSection = () => {
    if (productFromDB.quantity > 0) {
      return (
        <div class="flex flex-row gap-1 items-center">
          <HiOutlineCheckCircle color="green" size={30} />
          <span className="text-xl text-green-500 font-bold">In stock</span>
        </div>
      );
    } else {
      return (
        <div class="flex flex-row gap-1 items-center">
          <HiOutlineBan color="red" size={30} />
          <span className="text-xl text-red-500 font-bold">Out of stock</span>
        </div>
      );
    }
  };

  const StockSection = () => {
    if (!user || (user.role !== 'admin' && user.role !== 'productManager')) {
      return (
        <div class="flex flex-row gap-6 mt-8 items-center">
          <StockStatusSection />
        </div>
      );
    }

    if (user && (user.role === 'admin' || user.role === 'productManager')) {
      return (
        <div class="flex flex-row gap-6 mt-8 items-center">
          <EditStockSection />
        </div>
      );
    }
  };

  const EditPriceDiscountSection = () => {
    return (
      <div class="flex flex-col">
        <form onSubmit={onEditPriceDiscountConfirm}>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-center justify-between">
              <Label htmlFor="price" value="Price" />

              <TextInput
                disabled={!isEditingPriceDiscount}
                id="price"
                type="number"
                step={0.01}
                placeholder={productFromDB.price}
              />
            </div>
            <div class="flex flex-row gap-2 items-center justify-between">
              <Label htmlFor="discount" value="Discount" />

              <TextInput
                disabled={!isEditingPriceDiscount}
                id="discount"
                type="number"
                step={0.01}
                placeholder={productFromDB.discount}
              />
            </div>
            <div class="flex flex-row items-center justify-end">
              {isEditingPriceDiscount ? (
                <div class="flex flex-row gap-2">
                  <Button
                    color="light"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditingPriceDiscount(false);
                    }}
                  >
                    <HiX size={20} color="red" />
                  </Button>

                  <Button color="light" type="submit">
                    <HiCheck size={20} color="green" />
                  </Button>
                </div>
              ) : (
                <Button
                  color="light"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditingPriceDiscount(true);
                  }}
                ></Button>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  };

  const PriceSection = () => {
    if (!user || (user.role !== 'admin' && user.role !== 'salesManager')) {
      return (
        <div class="flex flex-row gap-6 mt-8 items-center">
          <Price product={productFromDB} />
        </div>
      );
    }

    if (user && (user.role === 'admin' || user.role === 'salesManager')) {
      if (isEditingPriceDiscount) {
        return EditPriceDiscountSection();
      }

      return (
        <div class="flex-col">
          <Label htmlFor="price" value="Price" />
          <div class="flex flex-row gap-2">
            <Price product={productFromDB} />
            <Button
              color="light"
              onClick={(e) => {
                e.preventDefault();
                setIsEditingPriceDiscount(true);
              }}
            >
              <HiOutlinePencil size={20} />
            </Button>
          </div>
        </div>
      );
    }
  };

  const AddToCartSection = () => {
    if (user && (user.role === 'admin' || user.role === 'salesManager')) {
      return (
        <div className="flex flex-row mt-12 gap-5 items-end   justify-between">
          <PriceSection />
        </div>
      );
    }
    if (product.quantity > 0) {
      return (
        <div className="flex flex-row mt-12 gap-5 items-end   justify-between">
          <PriceSection />

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
      );
    }
  };

  return (
    <div class="m-20 grid grid-cols-5 gap-1 ">
      {showAddCommentModal && (
        <AddCommentModal
          show={showAddCommentModal}
          setShow={setShowAddCommentModal}
          setComments={setComments}
          size="lg"
          dismissable={true}
          onSubmit={onAddComment}
        />
      )}

      <div class="col-span-2 flex flex-col ">
        <Card>
          <div class="flex flex-row w-full items-center justify-center">
            <div className="h-96 w-96">
              <Carousel leftControl={' '} rightControl={' '} indicators={false}>
                <img src={productFromDB.imageURL} alt={productFromDB.name} />
              </Carousel>
            </div>
          </div>

          <div class="details flex flex-col gap-2">
            <div class="flex flex-row justify-between">
              <span className="text-m italic tracking-tight text-gray-900 dark:text-white">
                {productFromDB.category}
              </span>
              <span className="text-m italic tracking-tight text-gray-400 dark:text-white">
                id: {productFromDB._id}
              </span>
            </div>
            <span class="font-bold text-xl">{productFromDB.name}</span>
            <span class="text-lg">{productFromDB.description}</span>
          </div>

          <div class="flex flex-row gap-1 mt-4">
            <span class="text-lg tracking-tight text-gray-400 dark:text-white">
              Distributed by
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-400 dark:text-white">
              {productFromDB.distributor}
            </span>
          </div>

          <StockSection />

          <AddToCartSection />
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
