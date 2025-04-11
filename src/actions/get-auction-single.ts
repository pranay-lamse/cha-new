"use server";

import { GET_SINGLE_AUCTION_DATA } from '@/graphql/queries/getDataAuctionSingle';
import { Home, Variables } from '@/interfaces/home.interface';
import { MAX_RESULTS } from '@/constants';
import { env } from '@/env';

export const getAuctionSingle = async (params?: Variables): Promise<Home> => {
    const endpoint = env.NEXT_PUBLIC_API_URL!;
    const query = GET_SINGLE_AUCTION_DATA;
    const variables: Variables = {
        first: MAX_RESULTS,
        status: 'LIVE',
        ...params
    };

    const headers = {
        Authorization: `Bearer ${env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables }),
            next: {
                revalidate: 60
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('GraphQL Error:', error.message);
        }
        throw new Error('Unable to load data');
    }
};
