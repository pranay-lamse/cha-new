export const GET_METADATA = `
query MetaDataQuery {
     metadata: pageBy(uri: "/") {
        seo {
            title
            description
            robots
            openGraph {
                url
                type
                title
                description
                siteName
                twitterMeta {
                card
                description
                title
                site
                image
                creator
                }
                locale
                image {
                secureUrl
                height
                type
                url
                width
                }
                updatedTime
            }
        }
  } 
}`;