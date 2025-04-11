import axios from "axios";
import { getToken } from "@/utils/storage";
import { env } from "@/env";

const axiosClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL, // Replace with your GraphQL API
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add Authorization token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
