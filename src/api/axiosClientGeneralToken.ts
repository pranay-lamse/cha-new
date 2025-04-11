import axios from "axios";

const axiosClientGeneralToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your GraphQL API
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add Authorization token if available
axiosClientGeneralToken.interceptors.request.use(
  (config) => {
    /*  const token = getToken(); */
    const token = process.env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClientGeneralToken;
