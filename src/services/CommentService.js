import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class CommentService {
  static async getCommentsByProductId({ productId }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/comment/all/${productId}`,
        withCredentials: true,
      });
      return response.data.comments;
    } catch (err) {
      return err.response.data;
    }
  }

  static async addComment({ productID, title, description }) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/comment`,
        data: {
          productID,
          title,
          description,
        },

        withCredentials: true,
      });
      return response.data.newComment;
    } catch (err) {
      return err.response.data;
    }
  }

  static async deleteComment({ commentID }) {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${URL}/comment/id/${commentID}`,
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
