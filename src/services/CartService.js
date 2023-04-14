import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class CartService {
  static async getCart() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/cart/my`,
        withCredentials: true,
      });
      return response.data.cart;
    } catch (err) {
      return err.response.data;
    }
  }

  static async addToCart({ productID, quantity }) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/cart/add`,
        data: {
          productID,
          quantity,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async removeFromCart({ productID, quantity }) {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${URL}/cart/remove`,
        data: {
          productID,
          quantity,
        },

        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async clearCart() {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${URL}/cart/clear`,
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
