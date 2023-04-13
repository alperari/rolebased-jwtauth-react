import React, { useState } from 'react';

const WishlistPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div class="flex flex-col mx-32 my-24">
      <span class="text-3xl text-center mb-8">My Wishlist</span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <span>content here</span>
      )}
    </div>
  );
};

export default WishlistPage;
