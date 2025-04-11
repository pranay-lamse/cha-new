import { gql } from "@apollo/client";

export const LOGIN_USER_QUERY = gql`
  query GetUserData($token: String!) {
    me(token: $token) {
      id
      username
      email
      firstName
      lastName
    }
  }
`;


export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;
