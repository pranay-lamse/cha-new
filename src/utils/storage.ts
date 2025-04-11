import Cookies from "js-cookie";

const TOKEN_KEY = "refreshToken"; // Cookie name

export const getToken = () => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: "Strict",
  });
  // Expires in 7 days, secure for HTTPS, prevents CSRF
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
