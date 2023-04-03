import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

export class AuthService {
  static async login(email, password) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${URL}/auth/login`,
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
}
