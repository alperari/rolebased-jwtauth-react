import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class SearchService {
  static async searchProducts({ query }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/search/products?query=${query}`,
        withCredentials: true,
      });

      return response.data.products;
    } catch (err) {
      return err.response.data;
    }
  }
}
