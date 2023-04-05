import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class ProductService {
  static async addProduct({ name, description, image, price, category }) {
    const formData = new FormData();

    formData.append('image', image);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('category', category);

    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/product/add`,
        withCredentials: true,
        data: formData,
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
