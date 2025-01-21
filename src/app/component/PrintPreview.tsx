"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { weightService } from "@/app/_services/weightService";

// Types and Interfaces
type Status = "acceptable" | "rejected" | "";
type WeightLineStatus = "valid" | "invalid" | "" | "draft";

interface WeightLine {
  gross_weight: number;
  datetime: string;
  status: WeightLineStatus;
  remark: boolean;
}

interface TeaLabelData {
  id: number;
  productName: string;
  innerCount: string;
  netWeight: string;
  grossWeight: number;
  masterCartons: string;
  status: Status;
  isFormValid: boolean;
}

interface WeightDetails {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  status: string;
}

interface TeaLabelProps {
  data: TeaLabelData;
  onProcessComplete?: () => void;
}

// Constants
const VERIFICATION_NUMBER = "123456";
const PRINT_WINDOW_SETTINGS = "width=400,height=300";
const PRINT_DIMENSIONS = {
  width: "75mm",
  height: "50mm",
};

// Utility Functions
const getCurrentDateTime = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = now.toLocaleString("en-US", { month: "short" });
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  const formatHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${day}-${month}-${year} ${formatHours}:${minutes} ${period}`;
};

// Main Component
export const TeaLabel: React.FC<TeaLabelProps> = ({
  data,
  onProcessComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weightLines, setWeightLines] = useState<WeightDetails[]>([]);

  // Validation Function
  const validateData = useCallback(() => {
    if (!data.id) {
      throw new Error("Missing header ID");
    }
    if (!data.grossWeight || data.grossWeight <= 0) {
      throw new Error("Invalid gross weight");
    }
    if (!data.productName) {
      throw new Error("Missing product name");
    }
  }, [data]);

  // Fetch Weight Lines
  const fetchWeightLines = useCallback(async (headerId: number) => {
    setIsLoading(true);
    try {
      const response = await weightService.getLinesById(headerId);

      if (response?.data && Array.isArray(response.data)) {
        const sortedData = [...response.data].sort(
          (a: WeightDetails, b: WeightDetails) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        setWeightLines(sortedData);

        toast({
          title: "Weight Lines Updated",
          description: `Successfully loaded ${sortedData.length} weight lines`,
        });
      }
    } catch (error) {
      console.error("Error fetching weight lines:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weight lines",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Print Document Function
  const handlePrintDocument = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const printWindow = window.open("", "", PRINT_WINDOW_SETTINGS);
        if (!printWindow) {
          throw new Error("Failed to open print window");
        }
        const style = `
        @page {
          size: 75mm 50mm;
          margin: 0;
          overflow: hidden;
        }
        html, body {
          margin: 0.25mm;
          padding: 0;
          width: 75mm;
          height: 50mm;
          overflow: hidden;
        }
        .print-label {
          width: 75mm;
          height: 50mm;
          padding: 2mm;
          box-sizing: border-box;
          font-family: poppins, sans-serif;
          font-size: 10.5pt;
          line-height: 1.1;
          position: relative;
          page-break-inside: avoid;
        }
        .header {
          font-size: 12pt;
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5mm;
        }
        .date {
          font-size: 8.5pt;
        }
        .product-info {
          font-weight: bold;
          margin: 0.5mm 0;
        }
        .details {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5mm;
        }
        .weight-info {
          width: 32mm;
          margin-top: 1mm;
        }
        .weight-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25mm;
        }
        .verification-box {
          border: 0.5mm solid #000;
          width: 26mm;
          height: 26mm;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fafafa;
          margin-right: 1mm;
        }
        .verification-number {
          font-size: 6.5pt;
          margin-top: -2mm;
          text-align: center;
        }
        .carton-info {
          display: flex;
          gap: 2mm;
          font-size: 12pt;
          align-items: center;
          margin-top: -1mm;
        }
      `;

        const content = `
        <div class="print-label">
          <div class="header">
            <div style="font-weight: bold;">E24/00845</div>
            <div class='date' style="display: flex; gap: 4mm;">
              <div style="font-weight: bold;">1</div>
              <div style="font-weight: bold;">${getCurrentDateTime()}</div>
            </div>
          </div>
          <div class="product-info">
            <div>${data.productName}</div>
            <div>${data.innerCount}x100x2G TEA</div>
          </div>
          <div class="details" style="font-weight: bold;">
            <div class="weight-info">
              <div class="weight-row">
                <div>INNERS</div>
                <div>${data.innerCount}</div>
              </div>
              <div class="weight-row">
                <div>NET(Kg)</div>
                <div>${data.netWeight}</div>
              </div>
              <div class="weight-row">
                <div>GROSS(Kg)</div>
                <div>${data.grossWeight}</div>
              </div>
            </div>
            <div class="verification-box">
              <div class="verification-number">${VERIFICATION_NUMBER}</div>
              <div class="status-mark">
                ${
                  data.status === "acceptable"
                    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12mm" height="12mm" fill="black">
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                    </svg>`
                    : data.status === "rejected"
                    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12mm" height="12mm" fill="black">
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </svg>`
                    : ""
                }
              </div>
            </div>
          </div>
          <div class="carton-info">
            <div style="font-weight: bold;">CARTON NO</div>
            <div style="font-weight: bold;">${data.masterCartons}</div>
          </div>
        </div>
      `;

        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tea Label</title>
            <style>${style}</style>
          </head>
          <body>
            ${content}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { 
                  window.close();
                  window.opener.postMessage('printComplete', '*');
                }, 500);
              };
            </script>
          </body>
        </html>
      `);

        printWindow.document.close();

        const handlePrintMessage = (event: MessageEvent) => {
          if (event.data === "printComplete") {
            window.removeEventListener("message", handlePrintMessage);
            resolve();
          }
        };

        window.addEventListener("message", handlePrintMessage);
      } catch (error) {
        reject(error);
      }
    });
  }, [data]);

  // Process Function
  const handleProcess = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      validateData();

      const weightLine: WeightLine = {
        gross_weight: data.grossWeight,
        datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
        status: "invalid",
        remark: true,
      };

      await weightService.createWeightLine(data.id, weightLine);
      toast({
        title: "Success",
        description: "Label processed and printed successfully",
      });

      await handlePrintDocument();
      await fetchWeightLines(data.id);

      onProcessComplete?.();
    } catch (error: any) {
      console.error("Process failed:", error);
      toast({
        title: "Error",
        description: error.message || "Process failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (data.id) {
      fetchWeightLines(data.id);
    }
  }, [data.id, fetchWeightLines]);

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Label Preview</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchWeightLines(data.id)}
              disabled={isLoading}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Print Label"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <LabelPreview data={data} />
      </CardContent>
    </Card>
  );
};

// Subcomponents
const LabelPreview: React.FC<{ data: TeaLabelData }> = ({ data }) => (
  <div className="bg-white border border-gray-200 shadow-sm p-2 rounded-lg mb-6">
    <div
      className="bg-white border border-gray-300 rounded-lg justify-center mx-auto"
      style={{ width: "75mm", height: "50mm", padding: "1mm" }}
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="font-mono font-semibold text-gray-800">E24/00845</span>
        <div className="flex gap-3 font-mono text-gray-600">
          <span>1</span>
          <span>{getCurrentDateTime()}</span>
        </div>
      </div>

      <div className="font-mono font-bold text-sm text-gray-800 mb-3">
        <div>{data.productName}</div>
        <div className="text-sm text-gray-600">{`${data.innerCount}x100x2G TEA`}</div>
      </div>

      <LabelDetails data={data} />
    </div>
  </div>
);

const LabelDetails: React.FC<{ data: TeaLabelData }> = ({ data }) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <div className="font-mono text-sm text-gray-800">
        <DetailRow label="INNERS" value={data.innerCount} />
        <DetailRow label="NET(Kg)" value={data.netWeight} />
        <DetailRow label="GROSS(Kg)" value={data.grossWeight.toString()} />
      </div>
      <VerificationBox status={data.status} />
    </div>
    <CartonInfo masterCartons={data.masterCartons} />
  </>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4">
    <span>{label}</span>
    <span className="font-semibold text-gray-600">{value}</span>
  </div>
);

const VerificationBox: React.FC<{ status: Status }> = ({ status }) => (
  <div className="border-2 border-gray-800 w-16 h-16 rounded-lg flex flex-col items-center justify-center bg-gray-50">
    <span className="font-mono font-bold text-xs text-gray-700 mb-1">
      {VERIFICATION_NUMBER}
    </span>
    {status && (
      <span
        className={`text-2xl ${
          status === "acceptable" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status === "acceptable" ? "✓" : "✗"}
      </span>
    )}
  </div>
);

const CartonInfo: React.FC<{ masterCartons: string }> = ({ masterCartons }) => (
  <div className="flex gap-4 mt-3 font-mono text-sm text-gray-800">
    <span className="font-semibold">CARTON NO</span>
    <span className="text-gray-600 font-semibold">{masterCartons}</span>
  </div>
);
