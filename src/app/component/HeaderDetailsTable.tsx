import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import HeaderCreateView from "./HeaderCreateView";
import TableComponent from "./HeaderTable";
import type { TableData } from "./HeaderCreateView";

const Page: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

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

  const handleRowSelect = (rowData: TableData) => {
    setSelectedRow(rowData);
  };

  return (
    <div className="flex flex-col w-full h-screen gap-4 p-6">
      <div className="flex-1 min-h-0">
        <TableComponent
          data={data}
          columns={columns}
          searchField="name"
          height="100%"
          onRowSelect={handleRowSelect}
        />

        <HeaderCreateView selectedRow={selectedRow} />
      </div>
    </div>
  );
};

export default Page;
