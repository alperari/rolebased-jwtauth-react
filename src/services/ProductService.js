import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class ProductService {
  static async getProductById({ productID }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/product/id/${productID}`,
        withCredentials: true,
      });
      return response.data.product;
    } catch (err) {
      return err.response.data;
    }
  }

  static async getProductsWithRatingsAsCustomer() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/product/listed/with-ratings`,
        withCredentials: true,
      });
      return response.data.products;
    } catch (err) {
      return err.response.data;
    }
  }

  static async getProductsWithRatings() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/product/with-ratings`,
        withCredentials: true,
      });
      return response.data.products;
    } catch (err) {
      return err.response.data;
    }
  }

  static async getProducts() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/product/all`,
        withCredentials: true,
      });
      return response.data.products;
    } catch (err) {
      return err.response.data;
    }
  }

  static async addProduct({ name, description, image, category, distributor }) {
    const formData = new FormData();

    formData.append('image', image);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('distributor', distributor);

    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/product`,
        withCredentials: true,
        data: formData,
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async updateQuantity({ productID, quantity }) {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `${URL}/product/update-quantity`,
        withCredentials: true,
        data: {
          productID,
          quantity,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async updatePriceDiscount({
    productID,
    price = null,
    discount = null,
  }) {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `${URL}/product/update-price-discount`,
        withCredentials: true,
        data: {
          productID,
          price,
          discount,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async getCategories() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/product/categories`,
        withCredentials: true,
      });

      return response.data.categories;
    } catch (err) {
      return err.response.data;
    }
  }

  static async removeProduct({ productID }) {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${URL}/product/id/${productID}`,
        withCredentials: true,
        data: {
          productID,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async isCommentableRatable({ productID }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/product/is-commentable-ratable?productID=${productID}`,
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
