import { CheckoutProductPrice } from '../../components/Checkout/CheckoutProductPrice';

export const CheckoutProduct = ({ product }) => {
  return (
    <div class="w-full flex items-center">
      <div class="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
        <img src={product.imageURL} alt={product._id} />
      </div>
      <div class="flex-grow pl-3">
        <h6 class="font-semibold uppercase text-gray-600">{product.name}</h6>
        <p class="text-gray-400">x {product.cartQuantity}</p>
      </div>
      <CheckoutProductPrice product={product} />
    </div>
  );
};
