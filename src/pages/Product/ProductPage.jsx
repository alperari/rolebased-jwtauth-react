import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Rating,
  Badge,
  Carousel,
  Timeline,
  Spinner,
  Label,
  TextInput,
  Tooltip,
} from 'flowbite-react';

import {
  HiCalendar,
  HiOutlinePencil,
  HiX,
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiCheck,
  HiOutlineHeart,
  HiHeart,
} from 'react-icons/hi';
import ReactStars from 'react-stars';

import { ProductService } from '../../services/ProductService';
import { CommentService } from '../../services/CommentService';
import { UserService } from '../../services/UserService';
import { RatingService } from '../../services/RatingService';
import { WishlistService } from '../../services/WishlistService';
import { CartService } from '../../services/CartService';
import { OrderService } from '../../services/OrderService';

import { useLocation, useParams } from 'react-router-dom';

import { Ratings } from '../../components/Product/Ratings';
import { Price } from '../../components/Product/Price';

import { parseDateTime, get30DaysArray } from '../../helpers/helperFunctions';
import { AddCommentModal } from '../../components/General/Modal';

import { CustomBarChart } from '../../components/Order/CustomBarChart';

const user = JSON.parse(localStorage.getItem('user'));
let localCart = JSON.parse(localStorage.getItem('cart'));

const ProductPage = () => {
  const { productId } = useParams();

  // const location = useLocation();
  // const { product } = location.state;

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  const [confirmingRating, setConfirmingRating] = useState(false);

  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [yourRating, setYourRating] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);

  // For editing stock
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(false);

  // For editing price and discount
  const [isEditingPriceDiscount, setIsEditingPriceDiscount] = useState(false);
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [updatingPriceDiscount, setUpdatingPriceDiscount] = useState(false);

  // For adding comment
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  // For wishlist
  const [isInWishlist, setIsInWishlist] = useState(product?.inMyWishlist);

  const [cart, setCart] = useState(localCart);

  const [isCommentableRatable, setIsCommentableRatable] = useState(false);

  const [sales, setSales] = useState([]);
  const [chartMode, setChartMode] = useState('revenues');

  const onAddComment = async (title, description) => {
    try {
      // Add comment to database
      const newComment = await CommentService.addComment({
        productID: product._id,
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
        productID: product._id,
        stars: selectedStars,
      });

      const newRatings = [...ratings];

      // Update rating in product state
      const myRatingInProductState = newRatings.find(
        (rating) => rating.userID === user._id
      );

      // If i already have a rating, update it
      if (myRatingInProductState) {
        // If my new rating is zero, delete it
        if (selectedStars === 0) {
          const index = newRatings.indexOf(myRatingInProductState);
          newRatings.splice(index, 1);
        }
        // If my new rating is not zero, update it
        else {
          myRatingInProductState.stars = selectedStars;
        }
      }

      // If i don't have a rating, add it
      else {
        newRatings.push({
          userID: user._id,
          productID: product._id,
          stars: selectedStars,
        });
      }
      setYourRating(selectedStars);

      // Update rating in state
      setRatings([...newRatings]);

      // Disable "confirm" button
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
        setProduct({ ...product, quantity: newStock });

        // TODO: Update stock in database
        setUpdatingStock(true);

        const result = ProductService.updateQuantity({
          productID: product._id,
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
      if (newPrice !== null) setPrice(newPrice);
      if (newDiscount !== null) setDiscount(newDiscount);

      // TODO: Update price and discount in database

      const result = ProductService.updatePriceDiscount({
        productID: product._id,
        price: newPrice,
        discount: newDiscount,
      });

      setUpdatingPriceDiscount(false);

      setIsEditingPriceDiscount(false);
    }
  };

  const onAddToCartButtonClick = async (product, quantity) => {
    // Update cart in local storage
    // If cart is empty, create a new cart
    let newCart = { products: [], ...JSON.parse(localStorage.getItem('cart')) };

    if (!newCart) {
      newCart = {
        products: [],
      };
    }

    // If cart is not empty, check if product is already in cart
    const productIndex = newCart.products.findIndex(
      (p) => p._id == product._id
    );

    const cartProduct = {
      cartQuantity: quantity,
      _id: product._id,
      category: product.category,
      distributor: product.distributor,
      imageURL: product.imageURL,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      discount: product.discount,
    };

    // If product is not in cart, add it
    if (productIndex == -1) {
      newCart.products.push(cartProduct);

      if (user) {
        // If logged-in, update cart in database

        if (quantity <= product.quantity) {
          const addedProduct = await CartService.addToCart({
            productID: product._id,
            quantity: quantity,
          });
        }
      }
    }

    // If product is in cart, update quantity
    else {
      // But first check if cartQuantity is not greater than product quantity
      if (
        newCart.products[productIndex].cartQuantity + quantity <=
        product.quantity
      ) {
        newCart.products[productIndex].cartQuantity += quantity;

        if (user) {
          // If logged-in, update cart in database

          const addedProduct = await CartService.addToCart({
            productID: product._id,
            quantity: quantity,
          });
        }
      }
    }

    // Update cart in local storage
    localStorage.setItem('cart', JSON.stringify(newCart));

    // Dispatch storage event to update cart in navbar
    window.dispatchEvent(new Event('storage'));
  };

  const fetchProductDetails = async () => {
    if (product) setLoadingProduct(false);

    setLoadingProduct(true);

    // Fetch product from database
    const fetchedProduct = await ProductService.getProductById({
      productID: productId,
    });

    setProduct({ ...fetchedProduct });

    setLoadingProduct(false);
  };

  const fetchComments = async () => {
    if (comments && comments.length > 0) setLoadingComments(false);

    setLoadingComments(true);

    // Fetch comments
    const fetchedComments = await CommentService.getApprovedCommentsByProductId(
      {
        productId: productId,
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

    setComments([...fetchedComments]);
    setLoadingComments(false);
  };

  const fetchRatings = async () => {
    if (ratings && ratings.length > 0) setLoadingRatings(false);

    setLoadingRatings(true);

    // Fetch ratings
    const fetchedRatings = await RatingService.getRatingsByProductId({
      productID: productId,
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

  const fetchIsCommentableRatable = async () => {
    if (user) {
      const result = await ProductService.isCommentableRatable({
        productID: productId,
      });

      setIsCommentableRatable(result);
    }
  };

  const fetchProductSales = async () => {
    setLoadingSales(true);
    const fetchedSales = await OrderService.getProductSales({
      productID: productId,
    });

    setSales([...fetchedSales]);

    setLoadingSales(false);
  };

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')));

    fetchProductDetails();

    fetchComments();

    fetchRatings();

    fetchIsCommentableRatable();

    fetchProductSales();
  }, [productId, price, discount, showAddCommentModal]);

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
    if (loadingComments) {
      return (
        <Card>
          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            Loading comments
            <Spinner size="lg" />
          </div>
        </Card>
      );
    }

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
        {user && user.role == 'customer' && (
          <Button
            disabled={!isCommentableRatable}
            onClick={() => {
              setShowAddCommentModal(true);
            }}
          >
            {' '}
            {isCommentableRatable ? (
              'Make Comment'
            ) : (
              <Tooltip
                content="You have to purchase the product"
                trigger="hover"
              >
                Make Comment
              </Tooltip>
            )}
          </Button>
        )}
      </Card>
    );
  };

  const Rate = () => {
    // If user is not logged in, don't show rate section
    if (!user || user.role !== 'customer' || !isCommentableRatable) return null;

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
          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            Loading ratings <Spinner size="lg" />
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
              placeholder={product.quantity}
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
    if (product.quantity > 0) {
      return (
        <div class="flex flex-col gap-1">
          <div class="flex flex-row gap-1 items-center">
            <HiOutlineCheckCircle color="green" size={30} />
            <span className="text-xl text-green-500 font-bold">In stock</span>
          </div>
          {product.quantity < 10 && (
            <Badge color="failure" size="md">
              {product.quantity} {product.quantity > 1 ? 'items' : 'item'} left
            </Badge>
          )}
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
                placeholder={product.price}
              />
            </div>
            <div class="flex flex-row gap-2 items-center justify-between">
              <Label htmlFor="discount" value="Discount" />

              <TextInput
                disabled={!isEditingPriceDiscount}
                id="discount"
                type="number"
                step={0.01}
                placeholder={product.discount}
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
          <Price product={product} />
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
            <Price product={product} />
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
    if (
      user &&
      (user.role === 'admin' ||
        user.role === 'salesManager' ||
        user.role === 'productManager')
    ) {
      return (
        <div className="flex flex-row  gap-5 items-end   justify-between">
          <PriceSection />
        </div>
      );
    }
    if (product.quantity > 0) {
      return (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const quantity = parseInt(e.target.quantity.value);

            if (!quantity) {
              onAddToCartButtonClick(product, 1);
            } else {
              onAddToCartButtonClick(product, quantity);
            }
          }}
        >
          <div className="flex flex-row gap-5 items-end   justify-between">
            <PriceSection />
            <div className="px-8">
              <Label htmlFor="quantity" value="Quantity" />
              <TextInput id="quantity" type="number" placeholder="1" />
            </div>

            <Button type="submit">Add to cart</Button>
          </div>
        </form>
      );
    }
  };

  const AddToWishlistButton = () => {
    if (user) {
      if (product.inMyWishlist) {
        return (
          <div class="flex flex-row items-center justify-end">
            <Button
              size="xs"
              color="light"
              onClick={async (e) => {
                e.preventDefault();

                // Remove from wishlist in state
                setProduct({
                  ...product,
                  inMyWishlist: false,
                });

                // Remove from wishlist in db
                await WishlistService.removeFromWishlist({
                  productID: product._id,
                });
              }}
            >
              <HiHeart size={20} color="red" />
            </Button>
          </div>
        );
      } else {
        return (
          <div class="flex flex-row items-center justify-end">
            <Button
              size="xs"
              color="light"
              onClick={async (e) => {
                e.preventDefault();

                // Add to wishlist in state
                setProduct({
                  ...product,
                  inMyWishlist: true,
                });

                // Add to wishlist in db
                await WishlistService.addToWishlist({
                  productID: product._id,
                });
              }}
            >
              <HiOutlineHeart size={20} color="red" />
            </Button>
          </div>
        );
      }
    }
  };

  const ChartButtons = () => {
    return (
      <div class="flex flex-col items-center">
        <div class="flex flex-row items-center">
          <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Revenues
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={chartMode === 'sales'}
              class="sr-only peer"
              onChange={(e) => {
                e.preventDefault();
                if (e.target.checked) {
                  setChartMode('sales');
                } else {
                  setChartMode('revenues');
                }
              }}
            />
            <div class="w-11 h-6 bg-blue-700 rounded-full peer dark:bg-blue-700 peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-pink-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-blue-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-blue-600 peer-checked:bg-pink-600"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Sales
            </span>
          </label>
        </div>
      </div>
    );
  };

  const SalesSection = () => {
    if (loadingSales) {
      return (
        <Card>
          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            Loading sales <Spinner size="lg" />
          </div>
        </Card>
      );
    } else {
      const past30DaysArray = get30DaysArray();

      const datasetSaleNumbers = past30DaysArray.map((day) => {
        const salesOnThatDay = sales.filter((sale) => {
          // each sale looks like {date: '2023-05-04', quantity: 1, buyPrice: 75.99}
          return sale.date === day;
        });

        if (salesOnThatDay.length > 0) {
          return salesOnThatDay.reduce((acc, sale) => {
            return acc + sale.quantity;
          }, 0);
        } else {
          return 0;
        }
      });

      const datasetRevenues = past30DaysArray.map((day) => {
        const salesOnThatDay = sales.filter((sale) => {
          // each sale looks like {date: '2023-05-04', quantity: 1, buyPrice: 75.99}
          return sale.date === day;
        });

        if (salesOnThatDay.length > 0) {
          return salesOnThatDay.reduce((acc, sale) => {
            return acc + sale.buyPrice;
          }, 0);
        } else {
          return 0;
        }
      });

      const options_revenues = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Revenues (Last 30 Days)',
          },
        },
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return '$' + value;
              },
            },
          },
        },
      };

      const options_sales = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Number Of Sales (Last 30 Days)',
          },
        },
        scales: {
          y: {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                if (value % 1 === 0) {
                  return value;
                }
              },
            },
          },
        },
      };

      const data_revenues = {
        labels: past30DaysArray,
        datasets: [
          {
            data: datasetRevenues,
            minBarLength: 7,
            borderColor: 'rgb(37, 99, 235)',
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
          },
        ],
      };

      const data_sales = {
        labels: past30DaysArray,
        datasets: [
          {
            data: datasetSaleNumbers,
            minBarLength: 7,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };

      return (
        <Card>
          <ChartButtons />

          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            {chartMode === 'revenues' && (
              <CustomBarChart options={options_revenues} data={data_revenues} />
            )}
            {chartMode === 'sales' && (
              <CustomBarChart options={options_sales} data={data_sales} />
            )}
          </div>

          {chartMode === 'revenues' && (
            <div class="flex flex-row items-center justify-center gap-1">
              <span class="text-sm font-medium text-gray-900 dark:text-gray-300">
                Total revenue:
              </span>

              <span class="text-l font-bold text-gray-900 dark:text-gray-300">
                $
                {sales.reduce((acc, currItem) => {
                  return acc + currItem.buyPrice;
                }, 0)}
              </span>
            </div>
          )}

          {chartMode === 'sales' && (
            <div>
              <div class="flex flex-row items-center justify-center gap-1">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-300">
                  Total number of sales:
                </span>
                <span class="text-l font-bold text-gray-900 dark:text-gray-300">
                  {sales.reduce((acc, currItem) => {
                    return acc + currItem.quantity;
                  }, 0)}
                </span>
              </div>
            </div>
          )}
        </Card>
      );
    }
  };

  if (loadingProduct) {
    return (
      <div class="py-12 text-xl flex flex-row gap-2 justify-center">
        <Spinner />
        <span>Loading product...</span>
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-3 py-12">
      <div class="flex flex-col gap-2 text-center">
        <span class="text-3xl">Product Details</span>

        <span class="text-gray-400 tracking-tight text-xl font-semibold">
          {' '}
          ({product._id})
        </span>
      </div>

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
            <AddToWishlistButton />
            <div class="flex flex-row w-full items-center justify-center">
              <div className="h-96 w-96">
                <Carousel
                  leftControl={' '}
                  rightControl={' '}
                  indicators={false}
                >
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

            <AddToCartSection />
          </Card>
        </div>

        <div class="flex flex-col col-span-3 pl-24 pr-4 gap-6">
          <CommentsSection />
          <RatingsSection />
          {user?.role === 'admin' ||
            (user?.role === 'salesManager' && <SalesSection />)}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
