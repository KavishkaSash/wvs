"use client";

import { useEffect, useRef, useState } from "react";
import "tabulator-tables/dist/css/tabulator.min.css";
import { TabulatorFull as Tabulator } from "tabulator-tables";

interface Props {}

const Page: React.FC<Props> = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const data = [
    {
      id: 1,
      name: "Alice",
      progress: 75,
      gender: "Female",
      rating: 4.5,
      col: "Blue",
      dob: "1990-01-01",
    },
    {
      id: 2,
      name: "Bob",
      progress: 50,
      gender: "Male",
      rating: 3.8,
      col: "Red",
      dob: "1985-05-15",
    },
    {
      id: 3,
      name: "Charlie",
      progress: 90,
      gender: "Male",
      rating: 4.9,
      col: "Green",
      dob: "2000-10-25",
    },
  ];

  const columns = [
    { title: "Line_NO", field: "name" },
    { title: "Contract_NO", field: "progress", sorter: "number" as const },
    { title: "Product", field: "gender" },
    { title: "Job_No", field: "rating", sorter: "number" as const },
    { title: "Quantity", field: "col" },
    { title: "Customer", field: "dob", sorter: "date" as const },
  ];

  useEffect(() => {
    if (tableRef.current) {
      new Tabulator(tableRef.current, {
        data, // Table data
        columns, // Column definitions
        layout: "fitColumns", // Fit columns to width of table
        height: "311px", // Height of table
      });
    }
  }, []);

  // Filtering logic
  useEffect(() => {
    if (tableRef.current) {
      const tableInstance = Tabulator.findTable("#tabulatorTable")[0];
      if (tableInstance) {
        tableInstance.setFilter("name", "like", search);
      }
    }
  }, [search]);

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
      />
      <div id="tabulatorTable" ref={tableRef}></div>
    </div>
  );
};

export default Page;
