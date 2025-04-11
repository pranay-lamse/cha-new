export const GET_USER_DETAILS = `
query GetAccountDetails {
    customer {
      id
      firstName
      lastName
      displayName
      email
    }
  }
`;

export const UPDATE_PASSWORD = `mutation UpdateUser($id: ID!, $password: String!) {
  updateUser(input: { id: $id, password: $password }) {
    user {
      id
      email
    }
  }
}
`;
