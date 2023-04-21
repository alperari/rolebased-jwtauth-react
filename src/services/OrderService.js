import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class OrderService {
  static async getOrderById({ orderID }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/order/${orderID}`,
        headers,
        withCredentials: true,
      });
      return response.data.order;
    } catch (err) {
      return err.response.data;
    }
  }

  static async placeOrder({ products, creditCard, address }) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/order`,
        data: {
          products,
          creditCard,
          address,
        },
        withCredentials: true,
      });
      return response.data.order;
    } catch (err) {
      return err.response.data;
    }
  }
}
