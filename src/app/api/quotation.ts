// api/quotation.ts
import { Quotation, Category } from "../types";

// Fake data
const categories: Category[] = [
  { id: 1, name: "Motivation", color: "#FFB6C1" },
  { id: 2, name: "Success", color: "#98FB98" },
  { id: 3, name: "Leadership", color: "#87CEEB" },
  { id: 4, name: "Wisdom", color: "#DDA0DD" },
];

const quotations: Quotation[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Quote ${index + 1}`,
  body: `This is a sample quotation ${
    index + 1
  }. It contains wisdom and inspiration.`,
  category: categories[Math.floor(Math.random() * categories.length)].name,
  author: `Author ${index + 1}`,
  date: new Date(
    2024,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  ).toISOString(),
}));

export const fetchQuotations = async (): Promise<Quotation[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return quotations;
};

export const fetchCategories = async (): Promise<Category[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return categories;
};
