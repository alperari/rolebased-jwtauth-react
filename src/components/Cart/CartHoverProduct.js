const { Link } = require('react-router-dom');

export const CartHoverProduct = ({ cartProduct }) => {
  return (
    <Link>
      <div class="bg-red-100 flex flex-row gap-2">
        <img
          width={50}
          height={50}
          src={cartProduct.imageURL}
          alt={cartProduct.name}
        />
        <div class="flex flex-col gap-1">
          <span>{cartProduct.name}</span>
          <span>{cartProduct.distributor}</span>
          <span>{cartProduct.price}</span>
          <span>{cartProduct.cartQuantity}</span>
        </div>
      </div>
    </Link>
  );
};
