import axiosClientwithApi from "@/api/axiosClientwithApi";

export const addToWatchList = async (url: string): Promise<string> => {
  try {
    const response = await axiosClientwithApi.get(url);
    return JSON.stringify(response) || "<p>No content available.</p>";
  } catch (error: any) {
    console.error("Error updating data:", error);
    throw new Error("Failed to update data. Please try again later.");
  }
};
