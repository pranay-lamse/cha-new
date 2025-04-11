import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";

/**
 * Update address with dynamic data
 * @param url - The URL to send the POST request to
 * @param data - The data to be updated (dynamic structure)
 * @returns The response or a default message
 */
export const updateAddresscreate = async (
  url: string,
  data: Record<string, any> // Dynamic data structure
): Promise<string> => {
  try {
    const response = await axiosClientGeneralToken.post(url, data);
    return response.data || "<p>No content available.</p>";
  } catch (error: any) {
    console.error("Error updating data:", error);
    throw new Error("Failed to update data. Please try again later.");
  }
};
