import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator, ColumnDefinition } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

interface TableData {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

const AddedLineTable: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null); // Reference to the table container

  const columns: ColumnDefinition[] = [
    { title: "ID", field: "id", width: 50 },
    { title: "Product Name", field: "productName" },
    {
      title: "Quantity",
      field: "quantity",
      hozAlign: "left",
      sorter: "number",
    },
    {
      title: "Price",
      field: "price",
      formatter: "money",
      formatterParams: { symbol: "$" },
    },
  ];

  const data: TableData[] = [
    { id: 1, productName: "Sample Product", quantity: 1, price: 100 },
  ];

  useEffect(() => {
    if (tableRef.current) {
      const table = new Tabulator(tableRef.current, {
        data, // Table data
        columns, // Column definitions
        layout: "fitColumns", // Adjust column width to fit
        height: "311px", // Set a fixed height
        pagination: true, // Enable local pagination
        paginationSize: 5, // Rows per page
        paginationSizeSelector: [5, 10, 20], // Allow user to select rows per page
      });

      // Cleanup the table instance when the component unmounts
      return () => {
        table.destroy();
      };
    }
  }, []);

  return <div ref={tableRef} />;
};

export default AddedLineTable;
