"use client";
import React, { useEffect, useState, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { weightService } from "../_services/weightService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Loader2,
  TrendingUp,
  Package,
  Scale,
  CheckCircle,
  Calendar,
  RefreshCcw,
  Search,
} from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "tabulator-tables/dist/css/tabulator_semanticui.min.css";
import { Input } from "@/components/ui/input";
import StatsDashboard from "./StatsDashboard";

export interface WeightLine {
  id: number;
  header_id: number;
  index_no: number;
  datetime: string;
  gross_weight: number;
  line_serial: string;
  remark: [];
  status: "draft" | "invalid" | "valid" | string;
  product_name: string;
  product_std_weight: number;
  nos_master_cartons: number;
  nos_inners: number;
  order_id: string;
  net_qty: number | undefined;
  order_line_number: number;
  customer: string;
}

interface SummaryStats {
  totalWeight: number;
  avgWeight: number;
  totalOrders: number;
  completedCount: number;
  completionRate: number;
  lastUpdated: string;
  invalidCount: number;
}

function Reports() {
  const [lineData, setLineData] = useState<WeightLine[]>([]);
  const [filteredData, setFilteredData] = useState<WeightLine[]>([]);
  const [contractSearch, setContractSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<Tabulator | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalWeight: 0,
    avgWeight: 0,
    totalOrders: 0,
    completedCount: 0,
    completionRate: 0,
    invalidCount: 0,
    lastUpdated: new Date().toLocaleString(),
  });

  const calculateSummaryStats = (data: WeightLine[]) => {
    const totalWeight = data.reduce((sum, item) => sum + item.gross_weight, 0);
    const completedCount = data.filter(
      (item) => item.status === "completed"
    ).length;
    const invalidCount = data.filter(
      (item) => item.status === "invalid"
    ).length;
    setSummaryStats({
      totalWeight,
      avgWeight: totalWeight / data.length || 0,
      totalOrders: data.length,
      completedCount,
      invalidCount,
      completionRate: (completedCount / data.length) * 100 || 0,
      lastUpdated: new Date().toLocaleString(),
    });
  };

  const statusFormatter = (cell: any) => {
    const value = cell.getValue();
    const className = `px-2 py-1 rounded-full text-xs font-medium ${
      value === "valid"
        ? "bg-green-100 text-green-800"
        : value === "draft"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"
    }`;
    return `<span class="${className}">${value}</span>`;
  };
  const handleContractSearch = (searchValue: string) => {
    setContractSearch(searchValue);

    if (!searchValue.trim()) {
      // If search is empty, show all data
      setFilteredData(lineData);
      calculateSummaryStats(lineData);
    } else {
      // Filter data based on search value
      const filtered = lineData.filter((item) =>
        item.order_id.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
      calculateSummaryStats(filtered);
    }
    // Remove initializeTable call since useEffect will handle it
  };

  const initializeTable = (data: WeightLine[]) => {
    if (!tableContainerRef.current) return;

    tableRef.current = new Tabulator(tableContainerRef.current, {
      data: data,
      layout: "fitData",
      height: "70vh",
      pagination: true,
      paginationSize: 15,
      paginationSizeSelector: [10, 15, 20, 25, 30],
      movableColumns: true,
      groupBy: "customer",
      placeholder: "No Data Available",
      scrollToRowIfVisible: false,
      layoutColumnsOnNewData: true,
      columns: [
        {
          title: "Header ID",
          field: "header_id",
          headerFilter: true,
        },

        {
          title: "Product Name",
          field: "product_name",
          headerFilter: true,
        },
        {
          title: "Contract No",
          field: "order_id",
          headerFilter: true,
        },
        {
          title: "Line No",
          field: "order_line_number",
          headerFilter: true,
        },
        {
          title: "Masters",
          field: "nos_master_cartons",
          headerFilter: true,
        },
        {
          title: "Serial",
          field: "line_serial",
          headerFilter: true,
        },
        {
          title: "Gross Weight",
          field: "gross_weight",
          formatterParams: { precision: 2 },
        },
        {
          title: "Std Weight",
          field: "product_std_weight",
          formatterParams: { precision: 2 },
        },
        {
          title: "Status 01",
          field: "created_date",
        },
        {
          title: "Status 02",
          field: "last_updated",
        },
        {
          title: "Net Qty",
          field: "net_qty",

          formatterParams: { precision: 2 },
          width: 100,
        },
        {
          title: "Order Line",
          field: "order_line_number",
          headerFilter: true,
          width: 100,
        },
        {
          title: "Remark",
          field: "remark",
          headerFilter: true,
          width: 100,
        },
        {
          title: "Customer name",
          field: "customer",
          headerFilter: true,
        },
        {
          title: "Status",
          field: "status",
          frozen: true,
          formatter: statusFormatter,

          headerFilterParams: {
            values: {
              valid: "Valid",
              draft: "Draft",
              invalid: "Invalid",
            },
          },
          width: 120,
        },
      ],
      rowFormatter: function (row) {
        const data = row.getData();
        if (data.status === "valid") {
          row.getElement().style.backgroundColor = "#f0fdf4";
        } else if (data.status === "invalid") {
          row.getElement().style.backgroundColor = "#fef2f2";
        }
      },
    });
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await weightService.getAllLines();
      const data = response.data || [];
      setLineData(data);
      setFilteredData(data); // Set filtered data to all data initially
      calculateSummaryStats(data);
      initializeTable(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these two useEffect hooks
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (tableContainerRef.current && filteredData.length > 0) {
      // Destroy existing table if it exists
      if (tableRef.current) {
        tableRef.current.destroy();
      }

      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        initializeTable(filteredData);
      }, 0);
    }

    return () => {
      if (tableRef.current) {
        tableRef.current.destroy();
      }
    };
  }, [filteredData]); // Depend on filteredData instead of running once

  const exportToExcel = async () => {
    if (!tableRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(filteredData); // Use filtered data

      // Add styles to the worksheet
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:J1");
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!worksheet[address]) continue;
        worksheet[address].s = {
          fill: { fgColor: { rgb: "4A90E2" } },
          font: { color: { rgb: "FFFFFF" }, bold: true },
        };
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, "Weight Data");
      XLSX.writeFile(workbook, `weight_data_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!tableRef.current || isExporting) return;
    try {
      setIsLoading(true);

      // Group data by customer
      const groupedData = filteredData.reduce<Record<string, WeightLine[]>>(
        (acc, curr) => {
          const customer = curr.customer || "Unassigned";
          if (!acc[customer]) {
            acc[customer] = [];
          }
          acc[customer].push(curr);
          return acc;
        },
        {}
      );

      // Create PDF
      const doc = new jsPDF("landscape");

      // Set initial position
      let yPos = 20;

      // For each customer group
      Object.entries(groupedData).forEach(([customer, items]) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        // Add customer header
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Customer: ${customer}`, 14, yPos);
        yPos += 10;

        // Get first item for header details
        const firstItem = items[0];

        // Add contract details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          [
            `Contract No: ${firstItem.order_id}`,
            `Product: ${firstItem.product_name}`,
            `Standard Weight: ${firstItem.product_std_weight}kg`,
          ],
          14,
          yPos
        );

        yPos += 20;

        // Create table for this group
        autoTable(doc, {
          startY: yPos,
          head: [
            [
              "Header ID",
              "Line No",
              "Masters",
              "Serial",
              "Gross Weight",
              "Net Qty",
              "Status",
              "Remark",
            ],
          ],
          body: items.map((item) => [
            item.header_id,
            item.order_line_number,
            item.nos_master_cartons,
            item.line_serial,
            item.gross_weight.toFixed(2),
            item.net_qty?.toFixed(2) || "-",
            item.status,
            item.remark || "-",
          ]),
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [0, 0, 0], // Black lines
            lineWidth: 0.1,
            textColor: [0, 0, 0], // Black text
          },
          headStyles: {
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0], // Black text
            fontSize: 9,
            fontStyle: "bold",
            lineWidth: 0.1,
            lineColor: [0, 0, 0], // Black lines
          },
          bodyStyles: {
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0], // Black text
            lineWidth: 0.1,
            lineColor: [0, 0, 0], // Black lines
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245], // Light gray for alternate rows
          },
          margin: { top: 10 },
        });

        // Update yPos for next group
        yPos = (doc as any).lastAutoTable.finalY + 20;
      });

      // Save the PDF
      doc.save(`weight_report_${new Date().toISOString()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <StatsDashboard summaryStats={summaryStats} />

      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Weight Data Report</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Last updated: {summaryStats.lastUpdated}
              </div>
            </div>
            <div className="space-x-2 flex items-center">
              {/* Add search input and button */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by Contract No..."
                  value={contractSearch}
                  onChange={(e) => handleContractSearch(e.target.value)}
                  className="w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={exportToExcel}
                disabled={isLoading || isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={exportToPDF}
                disabled={isLoading || isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div ref={tableContainerRef} className="w-full min-h-[500px]" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports;
