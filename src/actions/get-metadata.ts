"use server";

import { Metadata, Variables } from '@/interfaces';
import { GET_METADATA } from '@/graphql/queries/getMetadata';
import axiosClientGeneralToken from '@/api/axiosClientGeneralToken';

export const getMetadata = async (): Promise<Metadata> => {
    try {
        const res = await axiosClientGeneralToken.post('', {
            query: GET_METADATA,
        });

        if (res && res.data) {
            return res.data.data; // Ensures you return the correct GraphQL data structure
        } else {
            throw new Error('No data returned from the server');
        }
    } catch (error) {

        throw new Error('Unable to load data');
    }
};
