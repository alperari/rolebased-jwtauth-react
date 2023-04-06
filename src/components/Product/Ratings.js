import { Rating } from 'flowbite-react';

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

export const Ratings = ({ product, size = 'sm' }) => {
  if (product.ratings.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
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
      </div>
    );
  } else {
    // Calculate average rating
    const total = product.ratings.reduce(
      (acc, rating) => acc + rating.stars,
      0
    );
    const average = total / product.ratings.length;

    const roundedAverage = Math.round(average * 10) / 10;

    const filledNo = roundedAverage;
    const emptyNo = 5 - filledNo;

    const filledStars = FilledStars(filledNo);
    const emptyStars = EmptyStars(emptyNo);

    return (
      <div>
        <Rating size={size}>
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
