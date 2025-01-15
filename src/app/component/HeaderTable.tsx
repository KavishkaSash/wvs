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
  const [search, setSearch] = useState("");
  const [tableInstance, setTableInstance] = useState<Tabulator | null>(null);
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(
    null
  );

  const handleRowSelect = (rowData: Record<string, any>) => {
    setSelectedItem(rowData);
    onRowSelect(rowData);
  };

  const handleRemoveItem = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    if (tableRef.current) {
      const table = new Tabulator(tableRef.current, {
        data,
        columns,
        layout: "fitColumns",
        height,
        selectable: 1, // Allow only one row to be selected
      });

      table.on("rowClick", (e, row) => {
        handleRowSelect(row.getData());
      });

      setTableInstance(table);

      return () => {
        table.destroy();
      };
    }
  }, [data, columns, height, onRowSelect]);

  useEffect(() => {
    if (tableInstance) {
      tableInstance.setFilter(searchField, "like", search);
    }
  }, [search, searchField, tableInstance]);

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
