"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { weightService } from "@/app/_services/weightService";

// Types and Interfaces
type Status = "invalid" | "valid" | "";
type WeightLineStatus = "valid" | "invalid" | "" | "draft";

interface WeightLine {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  line_serial: string;
  status: WeightLineStatus;
}

interface TeaLabelData {
  id: number;
  productName: string;
  innerCount: number;
  netWeight: number;
  grossWeight: number;
  masterCartons: number;
  status: Status;
  isFormValid: boolean;
  contract_no: string;
  line_serial: string;
  net_qty: number;
  order_line_number: number;
  index_no: number;
  allow_print: boolean;
}

interface WeightDetails {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  line_serial: string;
  status: string;
  order_line_number: number;
}

interface TeaLabelProps {
  data: TeaLabelData;
  onProcessComplete?: () => void;
}

// Constants
const VERIFICATION_NUMBER = generateUniqueId();
const PRINT_WINDOW_SETTINGS = "width=400,height=300";
const PRINT_DIMENSIONS = {
  width: "75mm",
  height: "50mm",
};
function generateUniqueId(): string {
  // Get current timestamp in milliseconds
  const timestamp = Date.now();

  // Add a random component
  const random = Math.floor(Math.random() * 1000);

  // Combine timestamp and random number
  const combined = `${timestamp}${random}`;

  // Convert to base-36 and take last 6 characters
  const uniqueId = parseInt(combined).toString(36).slice(-6).toUpperCase();

  // Pad with random numbers if needed
  return uniqueId.padStart(6, Math.floor(Math.random() * 10).toString());
}

// Utility Functions
const getCurrentDateTime = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = now.toLocaleString("en-US", { month: "short" });
  const year = now.getFullYear();
  const time = now.toLocaleTimeString();

  return `${day}-${month}-${year} ${time}`;
};

// Main Component
export const TeaLabel: React.FC<TeaLabelProps> = ({
  data,
  onProcessComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weightLines, setWeightLines] = useState<WeightDetails[]>([]);
  const processingRef = useRef(false);

  useEffect(() => {
    let lastKeyPressTime = 0;
    const DEBOUNCE_DELAY = 500; // 500ms debounce

    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const currentTime = Date.now();

        // Prevent rapid repeated triggers
        if (currentTime - lastKeyPressTime < DEBOUNCE_DELAY) {
          return;
        }

        // Prevent processing if already in progress
        if (processingRef.current) {
          return;
        }

        lastKeyPressTime = currentTime;
        event.preventDefault();

        // Only process if we have valid data
        if (data.id && data.netWeight > 0) {
          await handleProcess();
        }
      }
    };

    // Add event listener
    window.addEventListener("keypress", handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [data.id, data.netWeight]); // Dependencies include necessary data properties

  // Update processing ref when isProcessing changes
  useEffect(() => {
    processingRef.current = isProcessing;
  }, [isProcessing]);
  // Validation Function
  const validateData = useCallback(() => {
    if (!data.id) {
      throw new Error("Missing header ID");
    }
    if (!data.netWeight || data.netWeight < 0) {
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
        const sortedData = [...response.data]
          .map((item) => ({
            ...item,
            remark: Boolean(item.remark),
            order_line_number: item.order_line_number ?? 0, // Provide default value if missing
          }))
          .sort(
            (a, b) =>
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
  console.log(data.netWeight);
  // Print Document Function
  const handlePrintDocument = useCallback(
    async (weightLineResponse?: WeightDetails): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          const printWindow = window.open("", "", PRINT_WINDOW_SETTINGS);
          if (!printWindow) {
            throw new Error("Failed to open print window");
          }

          const printData = {
            ...data,
            weightLine: weightLineResponse,
          };
          console.log(printData);
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
  width: 23mm;
  height: 23mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  margin-right: 1mm;
}
.verification-number {
  font-size: 8.5pt;
  margin-top: 1mm;
  text-align: center;
}
.carton-info {
  display: flex;
  gap: 1mm; /* Reduced gap for better alignment */
  font-size: 14pt; /* Adjusted font size */
  align-items: center;
  margin-top: -1mm;
  justify-content: space-between; /* Ensure content is spaced evenly */
}
.cartoon {
  width: 20mm; /* Fixed width for consistent sizing */
  height: auto; /* Maintain aspect ratio */
  margin-right: 2mm; /* Adjust spacing from adjacent elements */
  object-fit: contain; /* Ensure the image fits within the dimensions */
  display: block;
}

      `;

          const content = `
        <div class="print-label">
          <div class="header">
            <div style="font-weight: bold;">${printData.contract_no}</div>
            <div class='date' style="display: flex; gap: 4mm;">
              
              <div style="font-weight: bold;">${getCurrentDateTime()}</div>
            </div>
          </div>
          <div class="product-info">
            <div>${printData.weightLine?.order_line_number}</div>
            
          </div>
          <div class="product-info">
            <div>${printData.productName}</div>
            
          </div>
          <div class="details" style="font-weight: bold;">
            <div class="weight-info">
              <div class="weight-row">
                <div>INNERS</div>
                <div>${printData.innerCount}</div>
              </div>
              <div class="weight-row">
                <div>NET(Kg)</div>
                <div>${data.net_qty.toFixed(2)}</div>
              </div>
              <div class="weight-row">
                <div>GROSS(Kg)</div>
                <div>${printData.netWeight}</div>
              </div>
            </div>
            <div class="verification-box">
              <div class="verification-number" style="font-weight: bold;">${
                printData.weightLine?.line_serial || ""
              }</div>
              <div class="status-mark">
                ${
                  data.status === "valid"
                    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20mm" height="20mm" fill="black">
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                    </svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18mm" height="18mm" fill="black">
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </svg>`
                }
              </div>
            </div>
          </div>
          <div class="carton-info">
            <div style="font-weight: bold;">CARTON NO : ${
              printData.weightLine?.index_no ?? 0
            }</div>
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
          console.log(printData);
          printWindow.document.close();

          const handlePrintMessage = (event: MessageEvent) => {
            if (event.data === "printComplete") {
              window.removeEventListener("message", handlePrintMessage);
              resolve();
            }
          };

          window.addEventListener("message", handlePrintMessage);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    },
    [data]
  );

  // Process Function
  const handleProcess = async () => {
    if (isProcessing) return;
    console.log(data);
    setIsProcessing(true);
    try {
      validateData();
      const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const weightLine = {
        gross_weight: data.netWeight,
        datetime: date,
        status: data.status,
        remark: true,
        line_serial: "",
        allow_print: data.allow_print,
      };

      console.log("Submitting weight line:", weightLine);
      // Store the response from createWeightLine
      const response = await weightService.createWeightLine(
        data.id,
        weightLine
      );
      console.log("Weight Line Response:", response);

      // Access the nested data object (first item if it's an array)
      const weightLineResponse = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      // Create a WeightDetails object from the response
      const weightDetails: WeightDetails = {
        id: weightLineResponse.id,
        datetime: weightLineResponse.datetime,
        gross_weight: weightLineResponse.gross_weight,
        header_id: weightLineResponse.header_id,
        index_no: weightLineResponse.index_no,
        line_serial: weightLineResponse.line_serial,
        remark: Boolean(weightLineResponse.remark), // Convert to boolean
        status: weightLineResponse.status,
        order_line_number: weightLineResponse.order_line_number,
      };

      // Log the line serial from the correct path
      if (!data.allow_print) {
        await handlePrintDocument(weightDetails);
        await fetchWeightLines(data.id);
      }
      toast({
        title: "Success",
        description: "Weight Line processed successfully",
        variant: "success",
      });

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
    <>
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
                disabled={isProcessing || !data.id}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Print Label"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        {data.allow_print ? (
          <CardContent className="p-6">
            <LabelPreview data={data} />
          </CardContent>
        ) : (
          <CardHeader>Print not allowed for this label</CardHeader>
        )}
      </Card>
    </>
  );
};

// Subcomponents
const LabelPreview: React.FC<{ data: TeaLabelData }> = ({ data }) => (
  <div className="bg-white border border-gray-200 shadow-sm p-2 rounded-lg mb-6">
    <div
      className="bg-white  justify-center mx-auto"
      style={{ width: "75mm", height: "50mm", padding: "1mm" }}
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="font-mono font-semibold text-gray-800">
          {data.contract_no}
        </span>
        <div className="flex gap-3 font-mono text-gray-600">
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
        <DetailRow label="NET(Kg)" value={data.net_qty.toFixed(2)} />
        <DetailRow label="GROSS(Kg)" value={data.netWeight.toFixed(2)} />
        <CartonInfo masterCartons={data.index_no} />
      </div>
      <VerificationBox status={data.status} />
    </div>
  </>
);

const DetailRow: React.FC<{ label: string; value: string | number }> = ({
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
          status === "valid" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status === "valid" ? "✓" : "✗"}
      </span>
    )}
  </div>
);

const CartonInfo: React.FC<{ masterCartons: number }> = ({ masterCartons }) => (
  <div className="flex gap-4 mt-3 font-mono text-sm text-gray-800">
    <span className="font-semibold">CARTON NO {masterCartons}</span>
  </div>
);
