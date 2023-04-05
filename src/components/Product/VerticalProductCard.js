import React, { useState, useEffect } from 'react';

import {
  Button,
  TextInput,
  Label,
  FileInput,
  Textarea,
  Checkbox,
  Card,
  Alert,
  Dropdown,
  ToggleSwitch,
  Select,
  Rating,
  Spinner,
} from 'flowbite-react';

import { RatingService } from '../../services/RatingService';

const VerticalProductCard = ({ product }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = async () => {
    setLoading(true);
    const fetchedRatings = await RatingService.getRatingsByProductId({
      productId: product._id,
    });

    setRatings(fetchedRatings);
    setLoading(false);
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const FilledStars = (number) => {
    const stars = [];
    for (let i = 0; i < number; i++) {
      stars.push(<Rating.Star />);
    }
    return stars;
  };

  const EmptyStars = (number) => {
    const stars = [];
    for (let i = 0; i < number; i++) {
      stars.push(<Rating.Star filled={false} />);
    }
    return stars;
  };

  const Ratings = () => {
    if (loading)
      return (
        <div class="flex flex-row gap-2">
          <Spinner color="failure" aria-label="Failure spinner example" />
          Loading Comments...
        </div>
      );

    if (ratings.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          <Rating>
            <Rating.Star filled={false} />
            <Rating.Star filled={false} />
            <Rating.Star filled={false} />
            <Rating.Star filled={false} />
            <Rating.Star filled={false} />
            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              No Ratings
            </p>
          </Rating>
        </p>
      );
    } else {
      // Calculate average rating
      const total = ratings.reduce((acc, rating) => acc + rating.stars, 0);
      const average = total / ratings.length;

      const roundedAverage = Math.round(average * 10) / 10;

      const filledNo = roundedAverage;
      const emptyNo = 5 - filledNo;

      const filledStars = FilledStars(filledNo);
      const emptyStars = EmptyStars(emptyNo);

      return (
        <div>
          <Rating>
            {filledStars.map((star) => star)}
            {emptyStars.map((star) => star)}
            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {average} / 5
            </p>
          </Rating>
        </div>
      );
    }
  };

  return (
    <div className="max-w-sm">
      <Card imgAlt={product.name} imgSrc={product.imageURL}>
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h5>
        </a>

        <h5 className="text-m italic tracking-tight text-gray-900 dark:text-white">
          {product.category}
        </h5>

        {Ratings()}

        <div class="flex flex-row space gap-1">
          <h5 className="text-m tracking-tight text-gray-500 dark:text-white">
            Distributed by
          </h5>
          <h5 className="text-m font-bold tracking-tight text-gray-400 dark:text-white">
            {product.distributor}
          </h5>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          <a
            href="#"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add to cart
          </a>
        </div>
      </Card>
    </div>
  );
};

export default VerticalProductCard;
