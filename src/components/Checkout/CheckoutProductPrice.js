export const CheckoutProductPrice = ({ product }) => {
  let cost = product.price * product.cartQuantity;
  cost = cost - (cost * product.discount) / 100;

  const int = Math.floor(cost);
  const dec = Math.round((cost - int).toFixed(2) * 100);

  return (
    <div>
      <span class="font-semibold text-gray-600 text-xl">${int}</span>
      <span class="font-semibold text-gray-600 text-sm">.{dec}</span>
    </div>
  );
};
