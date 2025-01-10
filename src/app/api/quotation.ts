// api/quotations.ts
import axios from "axios";

// Base Axios instance
const apiClient = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch Quotations
export const fetchQuotations = async (query: string = "") => {
  try {
    const response = await apiClient.get(`/quotations`, {
      params: { search: query }, // API query parameter
    });
    return response.data; // Adjust based on API response format
  } catch (error: any) {
    // Error handling
    console.error(
      "Error fetching quotations:",
      error.response || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch quotations."
    );
  }
};
