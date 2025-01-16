"use client";
import React, { useEffect, useState } from "react";
import HeaderCreateView from "./HeaderCreateView";
import TableComponent from "./HeaderTable";
import type { TableData } from "./HeaderCreateView";
import { ordersApi } from "../api/orders/route";

interface OrderData {
  name: string;
  gender: string;
  rating: number;
  progress: number;
  col: string;
  dob: string;
}
const Page: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  // const data = [
  //   {
  //     id: 1,
  //     name: "Alice",
  //     progress: 75,
  //     gender: "Female",
  //     rating: 4.5,
  //     col: "Blue",
  //     dob: "1990-01-01",
  //   },
  //   {
  //     id: 2,
  //     name: "Bob",
  //     progress: 50,
  //     gender: "Male",
  //     rating: 3.8,
  //     col: "Red",
  //     dob: "1985-05-15",
  //   },
  //   {
  //     id: 3,
  //     name: "Charlie",
  //     progress: 90,
  //     gender: "Male",
  //     rating: 4.9,
  //     col: "Green",
  //     dob: "2000-10-25",
  //   },
  // ];

  const columns = [
    { title: "Line_NO", field: "name" },
    { title: "Product", field: "gender" },
    { title: "Job_No", field: "rating", sorter: "number" as const },
    {
      title: "Finish Good Number",
      field: "progress",
      sorter: "number" as const,
    },
    { title: "Contract_NO", field: "progress", sorter: "number" as const },

    { title: "No/Inners for a Master  ", field: "col" },
    { title: "No/Masters for the Order ", field: "col" },
    { title: "Weight per Master", field: "dob", sorter: "date" as const },
  ];

  const handleRowSelect = (rowData: TableData) => {
    setSelectedRow(rowData);
  };
  const [data, setData] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.getOrders();
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
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
