export const GET_PAYMENT_METHOD = `
  query GetPaymentMethods {
  customer {
    availablePaymentMethods {
      id
      isDefault
      tokenId
      type
      gateway {
        id
        title
        description
      }
    }
  }
}

`;
