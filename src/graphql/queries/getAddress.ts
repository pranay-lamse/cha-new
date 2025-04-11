export const GET_ADDRESS_DETAILS = `
query GetUserAddress {
  customer {
    billing {
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postcode
      phone
      email
      country
    }
    shipping {
      firstName
      lastName
      phone
      email
      company
      address1
      address2
      city
      state
      postcode
      country
    }
  }
}
`;
