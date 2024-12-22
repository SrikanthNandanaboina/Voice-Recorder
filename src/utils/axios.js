import Axios from "axios";

const axios = Axios.create({
  baseURL: 'http://127.0.0.1:3000',
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  retryOnTimeout: false,
});

export default axios;
