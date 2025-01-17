// app/weight/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HeaderCreateView from "./HeaderCreateView";
import TableComponent from "./HeaderTable";
import { weightService, WeightHeader } from "@/app/_services/weightService";
import type { TableData } from "./HeaderCreateView";

const WeightHeadersPage = () => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
  const [weightHeaders, setWeightHeaders] = useState<WeightHeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentState = searchParams.get("state");

  const columns = [
    { title: "Header No", field: "name" },
    { title: "Order Line", field: "order_line_id", sorter: "number" as const },
    { title: "Order", field: "order_id", sorter: "number" as const },
    { title: "Date & Time", field: "datetime", sorter: "date" as const },
    { title: "Product", field: "product_id", sorter: "number" as const },
    {
      title: "Std Gross Weight",
      field: "std_gross_weight",
      sorter: "number" as const,
    },
    {
      title: "Total Gross Weight",
      field: "total_gross_weight",
      sorter: "number" as const,
    },
    { title: "Line Count", field: "line_count", sorter: "number" as const },
    { title: "State", field: "state" },
    { title: "Remarks", field: "remark" },
  ];

  useEffect(() => {
    const fetchWeightHeaders = async () => {
      try {
        setIsLoading(true);
        const response = await weightService.getHeaders();
        setWeightHeaders(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching weight headers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightHeaders();
  }, [currentState]);

  const handleRowSelect = (rowData: TableData) => {
    setSelectedRow(rowData);
  };

  return (
    <div className="flex flex-col w-full h-screen gap-4 p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Weight Headers</h1>
        <div className="flex gap-2">
          {isLoading && <div className="text-gray-500">Loading...</div>}
        </div>
      </div>

      {error ? (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          Error loading weight headers: {error}
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <TableComponent
            data={weightHeaders}
            columns={columns}
            searchField="name"
            height="100%"
            onRowSelect={handleRowSelect}
          />

          <HeaderCreateView selectedRow={selectedRow} />
        </div>
      )}
    </div>
  );
};

export default WeightHeadersPage;
