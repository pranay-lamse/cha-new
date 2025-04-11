"use server";

import client from "@/lib/apolloClientAuth"; // Import your Apollo Client
import { GET_DATA_HOME } from "@/graphql/queries/getDataHome";
import { Home, Variables } from "@/interfaces/home.interface";
import { MAX_RESULTS } from "@/constants";

export const getAuctions = async (params?: Variables): Promise<Home> => {
    try {
        const { data, errors } = await client.query({
            query: GET_DATA_HOME,
            variables: {
                first: MAX_RESULTS,
                status: "LIVE",
                ...params
            } as Variables,
            fetchPolicy: "network-only",
        });

        if (errors) {
            console.error("GraphQL Response Errors:", errors);
            throw new Error("GraphQL query failed");
        }

        return data;
    } catch (error) {
        console.error("GraphQL Error:", error);
        throw new Error("Unable to load data");
    }
};
