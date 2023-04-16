import { Link } from 'react-router-dom';
import { Price } from './../Product/Price';

export const CartHoverProduct = ({ cartProduct }) => {
  return (
    <Link to="/product" state={{ cartProduct }}>
      <div class=" flex flex-row gap-2 my-8 items-center w-full ">
        <div style={{ width: 100 }} class="border-2 border-gray-100">
          <img
            backgroundSize="cover"
            src={cartProduct.imageURL}
            alt={cartProduct.name}
          />
        </div>
        <div class="flex flex-col w-full ">
          <span class="font-semibold text-l text-gray-700">
            {cartProduct.name}
          </span>
          <span class="tracking-tight  text-gray-400">
            {cartProduct.distributor}
          </span>
          <div class="flex flex-row justify-between items-end">
            <Price product={cartProduct} />

            <span>
              Amount: <span class="font-bold">{cartProduct.cartQuantity}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
