"use client";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { weightService } from "@/app/_services/weightService";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import "tabulator-tables/dist/css/tabulator_semanticui.min.css";

import type { ColumnDefinition, ReactTabulatorOptions } from "react-tabulator";

// Dynamically import Tabulator to avoid SSR issues
const ReactTabulator = dynamic(
  () => import("react-tabulator").then((mod) => mod.ReactTabulator),
  { ssr: false }
);

// Types
interface WeightDetails {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  status: string;
  line_serial: string;
}

interface WeightLinesTableProps {
  id: number;
}

interface WeightLinesTableRef {
  refreshData: () => Promise<void>;
}

interface TableHeaderProps {
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

// Constants
const STATUS_STYLES = {
  valid: "bg-green-100 text-green-800",
  invalid: "bg-red-100 text-red-800",
} as const;

// Component: Table Header
const TableHeader: React.FC<TableHeaderProps> = ({ onRefresh, isLoading }) => (
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Weight History</CardTitle>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCcw
          className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>
    </div>
  </CardHeader>
);

// Main Component
const WeightLinesTable = forwardRef<WeightLinesTableRef, WeightLinesTableProps>(
  ({ id }, ref) => {
    const [data, setData] = useState<WeightDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeightLines = async () => {
      if (!id) {
        setError("Please select a valid header ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await weightService.getLinesById(id);

        if (response?.data && Array.isArray(response.data)) {
          const sortedData = [...response.data]
            .map((item) => ({
              ...item,
              remark: Boolean(item.remark),
            }))
            .sort(
              (a, b) =>
                new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
            );
          setData(sortedData);
          setError(null);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching weight lines:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refreshData: fetchWeightLines,
    }));

    useEffect(() => {
      fetchWeightLines();
    }, [id]);

    // Tabulator column definitions
    const columns: ColumnDefinition[] = [
      {
        title: "#",
        field: "line_serial",
        headerFilter: true,
        width: 100,
      },
      {
        title: "Date & Time",
        field: "datetime",
        formatter: (cell) => {
          return new Date(cell.getValue()).toLocaleString();
        },
        headerFilter: true,
        sorter: "datetime",
      },
      {
        title: "Gross Weight",
        field: "gross_weight",
        formatter: (cell) => {
          return Number(cell.getValue()).toFixed(2);
        },
        headerFilter: true,
        sorter: "number",
        width: 150,
      },
      {
        title: "Status",
        field: "status",
        formatter: (cell) => {
          const status = cell.getValue() as string;
          const styleClass =
            STATUS_STYLES[status as keyof typeof STATUS_STYLES];
          return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styleClass}">${status}</span>`;
        },
        headerFilter: true,
        width: 120,
      },
      {
        title: "Remark",
        field: "remark",
        formatter: (cell) => {
          const remark = cell.getValue() as boolean;
          return remark
            ? '<span class="text-green-600">✔</span>'
            : '<span class="text-red-600">✘</span>';
        },
        headerFilter: true,
        width: 100,
      },
    ];

    // Tabulator options
    const options: ReactTabulatorOptions = {
      layout: "fitColumns",
      responsiveLayout: "hide",
      pagination: true,
      paginationSize: 4,
      paginationSizeSelector: [4, 8, 16, 32],
      movableColumns: true,
      sortable: true,
      filterMode: "local",
      headerFilterLiveFilter: true,
      height: "250px",
    };

    if (error) {
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      );
    }

    return (
      <Card className="w-full">
        <TableHeader onRefresh={fetchWeightLines} isLoading={isLoading} />
        <CardContent className="p-6 mt-0">
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-pulse text-gray-600">Loading...</div>
              </div>
            ) : (
              <ReactTabulator
                data={data}
                columns={columns}
                options={options}
                className="custom-tabulator"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

WeightLinesTable.displayName = "WeightLinesTable";

export default WeightLinesTable;
