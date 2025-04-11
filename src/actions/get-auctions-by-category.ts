"use server";

import { MAX_RESULTS } from "@/constants";
import { env } from "@/env";
import { GET_AUCTIONS_BY_CATEGORY } from "@/graphql/queries";
import { AuctionsByCategory, Variables } from "@/interfaces";

export const GetAuctionsByCategory = async (params?: Variables): Promise<AuctionsByCategory> => {
    const endpoint = env.NEXT_PUBLIC_API_URL!;
    const query = GET_AUCTIONS_BY_CATEGORY;
    const variables: Variables = {
        first: MAX_RESULTS,
        ...params,
    };

    const headers = {
        Authorization: `Bearer ${env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN}`,
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables }),
            next: {
                revalidate: 600
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
