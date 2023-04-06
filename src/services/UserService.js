import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class UserService {
  static async getUserById({ id }) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${URL}/user/id/${id}`,
        withCredentials: true,
        headers: headers,
      });

      return response.data.user;
    } catch (err) {
      return err.response.data;
    }
  }

  static async getMultipleUsersById({ ids }) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/user/multiple/`,
        withCredentials: true,
        headers: headers,
        data: {
          ids,
        },
      });

      return response.data.users;
    } catch (err) {
      return err.response.data;
    }
  }
}
