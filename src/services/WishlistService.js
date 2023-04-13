import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class WishlistService {
  static async getWishlist() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/wishlist/my`,
        withCredentials: true,
      });
      return response.data.wishlist;
    } catch (err) {
      return err.response.data;
    }
  }

  static async addToWishlist({ productID }) {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `${URL}/wishlist/add`,
        withCredentials: true,
        data: {
          productID,
        },
      });
      return response.data.wishlist;
    } catch (err) {
      return err.response.data;
    }
  }

  static async removeFromWishlist({ productID }) {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `${URL}/wishlist/remove`,
        withCredentials: true,
        data: {
          productID,
        },
      });
      return response.data.wishlist;
    } catch (err) {
      return err.response.data;
    }
  }
}
