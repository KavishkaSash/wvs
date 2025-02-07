"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchQuotations, fetchCategories } from "../api/quotation";
import { Quotation, Category } from "../types";
import { useRouter } from "next/navigation";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const QuotationSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Table columns configuration
  const columns: ColumnDefinition[] = [
    { title: "ID", field: "id", width: 70, sorter: "number" as const },
    { title: "Title", field: "title", width: 200, sorter: "string" as const },
    { title: "Body", field: "body", width: 400, sorter: "string" as const },
    {
      title: "Category",
      field: "category",
      width: 150,
      formatter: (cell: any) => {
        const category = categories.find((c) => c.name === cell.getValue());
        return category
          ? `<span style="background-color: ${
              category.color
            }; padding: 2px 8px; border-radius: 12px;">${cell.getValue()}</span>`
          : cell.getValue();
      },
    },
    { title: "Author", field: "author", width: 150, sorter: "string" as const },
    {
      title: "Date",
      field: "date",
      width: 150,
      sorter: "datetime" as const,
      formatter: function (cell: any) {
        try {
          const date = new Date(cell.getValue());
          return date.toLocaleDateString();
        } catch (err) {
          return cell.getValue();
        }
      },
    },
    {
      title: "",
      width: 50,
      formatter: function (cell: any) {
        return '<i class="fas fa-arrow-right cursor-pointer"></i>';
      },
      cellClick: function (e: any, cell: any) {
        const id = cell.getRow().getData().id;
        router.push(`/quotation/${id}`);
      },
    },
  ];

  // Table options
  const options = {
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 10,
    movableColumns: true,
    placeholder: "No Data Available",
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [quotationsData, categoriesData] = await Promise.all([
          fetchQuotations(),
          fetchCategories(),
        ]);

        // Validate the data structure
        if (!Array.isArray(quotationsData)) {
          throw new Error("Invalid quotations data received");
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error("Invalid categories data received");
        }

        setQuotations(quotationsData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(
          err.message || "Failed to fetch data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter quotations based on search query and selected category
  const filteredData = useMemo(() => {
    return quotations.filter((quote) => {
      const matchesSearch = searchQuery
        ? quote.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quote.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quote.author?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory =
        !selectedCategory || quote.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [quotations, searchQuery, selectedCategory]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quotation Search</h1>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search quotations..."
              className="w-full p-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              className={`cursor-pointer ${
                !selectedCategory ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => handleCategorySelect("")}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                className={`cursor-pointer ${
                  selectedCategory === category.name
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === category.name
                      ? category.color
                      : undefined,
                }}
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-4">
            <ReactTabulator
              data={filteredData}
              columns={columns}
              options={options}
              className="custom-tabulator"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuotationSearch;
