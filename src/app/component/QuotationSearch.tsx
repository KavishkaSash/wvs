"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchQuotations, fetchCategories } from "../api/quotation";
import { Quotation, Category } from "../types";

import dynamic from "next/dynamic";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const QuotationSearch = () => {
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
        return `<span style="background-color: ${
          category?.color
        }; padding: 2px 8px; border-radius: 12px;">${cell.getValue()}</span>`;
      },
    },
    { title: "Author", field: "author", width: 150, sorter: "string" as const },
    {
      title: "Date",
      field: "date",
      width: 150,
      sorter: "datetime" as const,
      formatter: function (cell: any) {
        return cell.getValue();
      },
      formatterParams: {
        inputFormat: "iso",
        outputFormat: "DD/MM/YYYY",
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
        setQuotations(quotationsData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter quotations based on search query and selected category
  const filteredData = useMemo(() => {
    return quotations.filter((quote) => {
      const matchesSearch =
        quote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || quote.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [quotations, searchQuery, selectedCategory]);

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
              onClick={() => setSelectedCategory("")}
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
                onClick={() => setSelectedCategory(category.name)}
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

        {error && <div className="text-red-500 text-center">{error}</div>}

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
