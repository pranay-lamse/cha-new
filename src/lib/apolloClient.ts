import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL,  // Use environment variable
        fetch,
    }),
    cache: new InMemoryCache(),
});

export default client;
