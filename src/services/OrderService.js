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
        url: `${URL}/order/id/${orderID}`,
        withCredentials: true,
      });
      return response.data.order;
    } catch (err) {
      return err.response.data;
    }
  }

  static async getOrders() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/order/my`,
        withCredentials: true,
      });
      return response.data.orders;
    } catch (err) {
      return err.response.data;
    }
  }

  static async placeOrder({ products, creditCard, address, contact }) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/order`,
        data: {
          products,
          creditCard,
          address,
          contact,
        },
        withCredentials: true,
      });
      return response.data.order;
    } catch (err) {
      return err.response.data;
    }
  }
}
