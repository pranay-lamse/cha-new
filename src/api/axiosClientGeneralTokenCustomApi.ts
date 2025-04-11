
import axios from "axios";
import { env } from "@/env";

const axiosClientGeneralTokenCustomApi = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL_CUSTOM_API, // Replace with your GraphQL API
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add Authorization token if available
axiosClientGeneralTokenCustomApi.interceptors.request.use(
  (config) => {
   /*  const token = getToken(); */
    const token = env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClientGeneralTokenCustomApi;
