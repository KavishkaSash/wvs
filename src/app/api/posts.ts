// api/posts.ts
import axios from "axios";

// Base Axios instance
const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // JSONPlaceholder API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch Posts
export const fetchPosts = async (query: string = "") => {
  try {
    const response = await apiClient.get(`/posts`);
    const filteredPosts = response.data.filter((post: any) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    return filteredPosts;
  } catch (error: any) {
    console.error("Error fetching posts:", error.response || error.message);
    throw new Error("Failed to fetch posts.");
  }
};
