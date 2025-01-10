// api/quotation.ts
import { Quotation, Category } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchQuotations = async (): Promise<Quotation[]> => {
  try {
    const response = await fetch(`${API_URL}/quotations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quotations:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchQuotationById = async (id: string): Promise<Quotation> => {
  try {
    const response = await fetch(`${API_URL}/quotations/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quotation:", error);
    throw error;
  }
};
