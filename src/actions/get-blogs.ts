
"use server";

import { env } from '@/env';
import { GET_BLOG_POSTS,GET_BLOG_POST_BY_SLUG } from './../graphql/queries/getBlogs';
import { Home, Variables } from '@/interfaces/home.interface';


export const getBlogs = async (params?: Variables): Promise<Home> => {
    const endpoint = env.NEXT_PUBLIC_API_URL!;
    const query = GET_BLOG_POSTS;
   /*  const variables: Variables = {
        first: MAX_RESULTS,
        status: 'LIVE',
        ...params
    }; */

    const headers = {
        Authorization: `Bearer ${env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query }),
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


export const getBlog = async (params?: Variables): Promise<Home> => {
    const endpoint = env.NEXT_PUBLIC_API_URL!;
    const query = GET_BLOG_POST_BY_SLUG;

    // Use the passed `params` or fallback to a default slug
    const variables = {
        slug: params?.slug || "embracing-the-enchantment-of-fall-trail-riding-a-riders-delight"
    };

    const headers = {
        Authorization: `Bearer ${env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables }), // ✅ Include variables
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
