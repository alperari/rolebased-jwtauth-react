import { Badge } from 'flowbite-react';

export const Price = ({ product }) => {
  if (product.price === -1) {
    return (
      <div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          $TBA
        </span>
      </div>
    );
  }

  if (product.discount <= 0) {
    return (
      <div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          ${product.price}
        </span>
      </div>
    );
  } else {
    const discountedPrice =
      product.price - (product.price * product.discount) / 100;

    return (
      <div>
        <Badge color="success" size="sm">
          {product.discount}% Discount
        </Badge>
        <div class="flex flex-row gap-3">
          <span className="text-2xl line-through font-bold text-red-700 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }
};
