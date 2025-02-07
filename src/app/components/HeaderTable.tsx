import React, { useEffect, useRef, useState } from "react";
import "tabulator-tables/dist/css/tabulator_semanticui.min.css";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import PreShipmentDropDown from "./PreShipmentDropDown";
import {
  SaleOrderLine,
  salesOrderService,
} from "../_services/salesOrderService";
import { useSearchParams } from "next/navigation";

interface TableComponentProps {
  searchField?: string;
  height?: string;
  onRowSelect: (rowData: SaleOrderLine) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  searchField = "order_line_id",
  height = "311px",
  onRowSelect,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstanceRef = useRef<Tabulator | null>(null);
  const [search, setSearch] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [saleOrderLines, setSaleOrderLines] = useState<SaleOrderLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSaleOrderId, setSelectedSaleOrderId] = useState<number>(0);
  const searchParams = useSearchParams();
  const currentState = searchParams.get("state");

  const columns = [
    { title: "Line NO", field: "id" },
    { title: "Product Name", field: "product_name" },
    {
      title: "Finish Good Number",
      field: "product_id",
      sorter: "number" as const,
    },
    { title: "Inners", field: "nos_inners", sorter: "number" as const },
    {
      title: "Masters",
      field: "nos_master_cartons",
      sorter: "number" as const,
    },
    {
      title: "Wieght Per Master",
      field: "product_uom_qty",
      sorter: "number" as const,
    },
    { title: "State", field: "state" },
  ];

  const handleSaleOrderSelect = (selectedId: number) => {
    setSelectedSaleOrderId(selectedId);
    console.log("Selected Sale Order ID:", selectedId);
  };

  useEffect(() => {
    const fetchSaleOrderLines = async () => {
      if (!selectedSaleOrderId) return;

      try {
        setIsLoading(true);
        const response = await salesOrderService.getSaleOrderLines(
          selectedSaleOrderId
        );
        setSaleOrderLines(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching sale order lines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleOrderLines();
  }, [selectedSaleOrderId, currentState]);

  useEffect(() => {
    if (tableRef.current && !isInitialized) {
      const table = new Tabulator(tableRef.current, {
        data: saleOrderLines,
        columns,
        layout: "fitDataFill",
        height,
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [5, 20, 50],
        selectableRows: 1,
        placeholder: "No Data Available",
      });

      table.on("rowClick", (e, row) => {
        onRowSelect(row.getData() as SaleOrderLine);
      });

      tableInstanceRef.current = table;
      setIsInitialized(true);
    }
  }, [columns, height, onRowSelect, saleOrderLines, isInitialized]);

  useEffect(() => {
    const table = tableInstanceRef.current;
    if (table) {
      interface TableData {
        [key: string]: any;
      }

      type FilterFunction = (data: TableData) => boolean;

      table.setFilter(
        search
          ? ([
              (data: TableData): boolean =>
                Object.values(data).some((value: any) =>
                  String(value).toLowerCase().includes(search.toLowerCase())
                ),
            ] as FilterFunction[])
          : ([] as FilterFunction[])
      );
    }
  }, [search]);

  useEffect(() => {
    const table = tableInstanceRef.current;
    if (table && isInitialized) {
      table.replaceData(saleOrderLines).catch(console.error);
    }
  }, [saleOrderLines, isInitialized]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 mt-2">
        <PreShipmentDropDown onSelect={handleSaleOrderSelect} />
      </div>

      {error && <div className="text-red-500">{error}</div>}
      <div ref={tableRef} className="w-full min-h-[500px]" />
    </div>
  );
};

export default TableComponent;
