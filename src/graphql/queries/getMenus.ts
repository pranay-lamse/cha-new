export const GET_DATA_MENUS = `
query HomeQuery($first: Int! = 20) {
  menuItems(first: $first) {
    nodes {
      title
      uri
      url
      label
      order
      path
      parentDatabaseId
      databaseId
    }
  }
}`;
