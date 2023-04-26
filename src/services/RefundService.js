import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class RefundService {
  static async getOrderRefundStatus({ orderID }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/refund/order/${orderID}`,
        withCredentials: true,
      });
      return response.data.refunds;
    } catch (err) {
      return err.response.data;
    }
  }
}
