import axiosClient from "./axiosClient";

export const loginUser = async (username: string, password: string) => {
  const LOGIN_QUERY = `
    mutation LoginUser {
      login(input: { username: "${username}", password: "${password}" }) {
        authToken
        user {
          id
          name
          email
        }
      }
    }
  `;

  try {
    const response = await axiosClient.post("", { query: LOGIN_QUERY });
    const authData = response.data.data?.login;

    if (authData?.authToken) {
      localStorage.setItem("authToken", authData.authToken);
    }

    return authData;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
};
