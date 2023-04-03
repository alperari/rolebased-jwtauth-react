import React from 'react';

import { useUserContext } from '../../providers/UserProvider';

const Product = () => {
  const { user } = useUserContext();
  console.log('user:', user);

  return <div>Product</div>;
};

export default Product;
