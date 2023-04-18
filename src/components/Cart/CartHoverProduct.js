import { Link } from 'react-router-dom';
import { Price } from './../Product/Price';

export const CartHoverProduct = ({ product }) => {
  return (
    <Link to="/product" state={{ product }}>
      <div class=" flex flex-row gap-2 my-8 items-center w-full px-4">
        <div style={{ width: 100 }} class="border-2 border-gray-100">
          <img src={product.imageURL} alt={product.name} />
        </div>
        <div class="flex flex-col w-full ">
          <span class="font-semibold text-l text-gray-700">{product.name}</span>
          <span class="tracking-tight  text-gray-400">
            {product.distributor}
          </span>
          <div class="flex flex-row justify-between items-end">
            <Price product={product} />

            <span>
              Amount: <span class="font-bold">{product.cartQuantity}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
