import axiosClientGeneralTokenCustomApi from "@/api/axiosClientGeneralTokenCustomApi";
import { GET_ABOUT } from "@/graphql/queries/getAbout";
import { GET_PRIVACY_POLICY } from "@/graphql/queries/getPrivacyPolicy";


export async function getAbout() {

  try {
    const response = await axiosClientGeneralTokenCustomApi.post('', {
      query: GET_ABOUT,
    });

    const data = response.data;

    if (!data || !data.data) {
      console.error("GraphQL API Error: No data received");
      return null;
    }

    console.log("Fetched About Data:", data.data);

    return data.data.page || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}


/* export async function getPrivacyPolicy() {

  try {
    const response = await axiosClientGeneralTokenCustomApi.post('', {
      query: GET_PRIVACY_POLICY,
    });

    const data = response.data;

    if (!data || !data.data) {
      console.error("GraphQL API Error: No data received");
      return null;
    }

    console.log("Fetched About Data:", data.data);

    return data.data.page || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
} */
