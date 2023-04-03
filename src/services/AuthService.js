import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export class AuthService {
  static async login(email, password) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/auth/login`,
        withCredentials: true,
        headers: headers,
        data: {
          email,
          password,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  static async register(name, username, email, password, address) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/auth/register`,
        data: {
          name,
          username,
          email,
          password,
          address,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
