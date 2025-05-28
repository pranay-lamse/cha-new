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

export const UPDATE_USER_PROFILE = `mutation UpdateUserProfile($id: ID!, $firstName: String, $lastName: String, $email: String) {
      updateUser(input: {
        id: $id,
        firstName: $firstName,
        lastName: $lastName,
        email: $email
      }) {
        user {
          id
          firstName
          lastName
          email
        }
      }
    }

`;
