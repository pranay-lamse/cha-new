export const GET_ORDER_DETAILS = `
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    orderNumber
    total
    status
    customer {
      email
      firstName
      lastName
    }
    billing {
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postcode
      country
      email
      phone
    }
    cartHash
    cartTax
    commentCount
    commentStatus
    couponLines {
      nodes {
        code
        discount
      }
    }
    createdVia
    currency
    customerIpAddress
    customerNote
    customerUserAgent
    databaseId
    date
    dateCompleted
    datePaid
    discountTax
    discountTotal

    feeLines {
      nodes {
        name
        amount
        total
      }
    }
    hasBillingAddress
    hasDownloadableItem
    hasShippingAddress
    isDownloadPermitted
    lineItems {
      nodes {
        product {
          node {
            name
          }
        }
        quantity
        total
      }
    }
    metaData {
      key
      value
    }
    modified
    needsPayment
    needsProcessing
    needsShippingAddress


    paymentMethod
    paymentMethodTitle
    pricesIncludeTax
    refunds {
      nodes {
        amount
        reason
        date
      }
    }
    shipping {
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postcode
      country
      phone
    }
    shippingAddressMapUrl
    shippingLines {
      nodes {
        methodTitle
        total
      }
    }
    shippingTax
    shippingTotal
    subtotal

    totalTax
    transactionId
  }
}
`;
