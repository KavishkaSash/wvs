import { useEffect, useRef, useState } from "react";
import "tabulator-tables/dist/css/tabulator_materialize.min.css";
import { TabulatorFull as Tabulator } from "tabulator-tables";

interface TableComponentProps {
  data: Record<string, any>[];
  columns: {
    title: string;
    field: string;
    sorter?:
      | "string"
      | "number"
      | "boolean"
      | "date"
      | "time"
      | "datetime"
      | "alphanum"
      | "exists"
      | "array";
  }[];
  searchField: string;
  height?: string;
  onRowSelect: (rowData: any) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  columns,
  searchField,
  height = "311px",
  onRowSelect,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstanceRef = useRef<Tabulator | null>(null);
  const [search, setSearch] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize table
  useEffect(() => {
    if (tableRef.current && !isInitialized) {
      const table = new Tabulator(tableRef.current, {
        data,
        columns,
        layout: "fitColumns",
        height,
        pagination: true,
        paginationSize: 5,
        paginationSizeSelector: [5, 10, 20, 50],
        selectable: 1,
      });

      // Add row click event handler
      table.on("rowClick", function (e, row) {
        onRowSelect(row.getData());
      });

      tableInstanceRef.current = table;
      setIsInitialized(true);
    }
  }, [columns, height, onRowSelect, data, isInitialized]);

  // Handle search
  useEffect(() => {
    const table = tableInstanceRef.current;

    if (table && search) {
      table.setFilter((rowData: any) => {
        const searchTerm = search.toLowerCase();
        return Object.values(rowData).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        );
      });
    } else if (table) {
      table.clearFilter(true);
    }
  }, [search]);

  // Update data only when necessary
  useEffect(() => {
    const table = tableInstanceRef.current;
    if (table && isInitialized) {
      table
        .replaceData(data)
        .then(() => {
          // Data update successful
        })
        .catch((error) => {
          console.error("Error updating table data:", error);
        });
    }
  }, [data, isInitialized]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search by ${searchField}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
        />
      </div>
      <div ref={tableRef} />
    </div>
  );
};

export default TableComponent;
