import axios from "axios";
import { getToken } from "@/utils/storage";

/**
 * Fetch HTML data from a given URL.
 */
export const fetchHtmlData = async (url: string): Promise<string> => {
  const token = getToken();

  const response = await axios.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  return response.data || "<p>No content available.</p>";
};
