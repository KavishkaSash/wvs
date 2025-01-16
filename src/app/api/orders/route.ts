// src/app/api/orders.ts
import axios from "axios";

interface OrderData {
  id: number;
  name: string;
  progress: number;
  gender: string;
  rating: number;
  col: string;
  dob: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fakestoreapi.com";

export const ordersApi = {
  // Get all orders
  getOrders: async (): Promise<ApiResponse<OrderData[]>> => {
    try {
      const response = await axios.get(`${API_URL}/products`);

      const transformedData = response.data.map((item: any) => ({
        id: item.id,
        name: item.title,
        progress: Math.floor(Math.random() * 100),
        gender: item.category,
        rating: item.rating.rate,
        col: item.category,
        dob: new Date().toISOString().split("T")[0],
      }));

      return {
        data: transformedData,
        status: response.status,
        message: "Orders fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get single order
  getOrderById: async (id: number): Promise<ApiResponse<OrderData>> => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);

      const transformedData = {
        id: response.data.id,
        name: response.data.title,
        progress: Math.floor(Math.random() * 100),
        gender: response.data.category,
        rating: response.data.rating.rate,
        col: response.data.category,
        dob: new Date().toISOString().split("T")[0],
      };

      return {
        data: transformedData,
        status: response.status,
        message: "Order fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create order
  createOrder: async (
    orderData: Partial<OrderData>
  ): Promise<ApiResponse<OrderData>> => {
    try {
      const response = await axios.post(`${API_URL}/products`, orderData);
      return {
        data: response.data,
        status: response.status,
        message: "Order created successfully",
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (
    id: number,
    orderData: Partial<OrderData>
  ): Promise<ApiResponse<OrderData>> => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, orderData);
      return {
        data: response.data,
        status: response.status,
        message: "Order updated successfully",
      };
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      return {
        data: undefined,
        status: response.status,
        message: "Order deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },
};
