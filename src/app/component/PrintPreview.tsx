"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { weightService } from "@/app/_services/weightService";

interface WeightLine {
  gross_weight: number;
  datetime: string;
  status: "acceptable" | "rejected" | "";
  remark: boolean;
  inner_count: number;
  net_weight: number;
  index_no: number;
}

interface TeaLabelProps {
  data: {
    id: number;
    productName: string;
    innerCount: string;
    netWeight: string;
    grossWeight: string;
    masterCartons: string;
    status: "acceptable" | "rejected" | "";
    isFormValid: boolean;
    onPrint: () => void;
  };
}

// async function createWeightLine(headerId: number, weightLine: WeightLine) {
//   const response = await fetch(`/api/weight-lines/${headerId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(weightLine),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to save weight data");
//   }

//   return await response.json();
// }

export const TeaLabel: React.FC<TeaLabelProps> = ({ data }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const VERIFICATION_NUMBER = "123456";

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "pm" : "am";
    const formatHours = hours % 12 || 12;
    return `${day}-${month}-${year} ${formatHours}.${minutes} ${period}`;
  };
  console.log(data);
  const validateData = () => {
    if (!data.id) {
      throw new Error("Missing header ID");
    }
    if (!data.grossWeight || isNaN(parseFloat(data.grossWeight))) {
      throw new Error("Invalid gross weight");
    }
    if (!data.netWeight || isNaN(parseFloat(data.netWeight))) {
      throw new Error("Invalid net weight");
    }
    if (!data.innerCount || isNaN(parseInt(data.innerCount))) {
      throw new Error("Invalid inner count");
    }
    if (!data.status) {
      throw new Error("Status is required");
    }
  };

  const handlePrintDocument = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const printWindow = window.open("", "", "width=400,height=300");
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

        // Listen for the print completion message
        window.addEventListener("message", function handler(event) {
          if (event.data === "printComplete") {
            window.removeEventListener("message", handler);
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleProcess = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      // 1. Validate data
      validateData();

      // 2. Prepare weight line data
      const weightLine: WeightLine = {
        gross_weight: parseFloat(data.grossWeight),
        datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
        status: data.status,
        remark: true,
        inner_count: parseInt(data.innerCount),
        net_weight: parseFloat(data.netWeight),
        index_no: 1,
      };

      // 3. Send API request
      await weightService.createWeightLine(data.id, weightLine);

      // 4. Handle printing
      await handlePrintDocument();

      // 5. Call onPrint callback and show success message
      data.onPrint();
      toast({
        title: "Success",
        description: "Label printed and data saved successfully",
      });
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

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Label Preview</h2>
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <Printer className="w-4 h-4 mr-2" />
            {isProcessing ? "Processing..." : "Print Label"}
          </Button>
        </div>

        {/* Label Preview with small padding */}
        <div className="bg-white border border-gray-200 shadow-sm p-2 rounded-lg">
          {/* Label Container with fixed aspect ratio */}
          <div
            className="bg-white border border-gray-300 rounded-lg justify-center mx-auto"
            style={{ width: "75mm", height: "50mm", padding: "1mm" }}
          >
            {/* Header Row */}
            <div className="flex justify-between text-sm mb-2">
              <span className="font-mono font-semibold text-gray-800">
                E24/00845
              </span>
              <div className="flex gap-3 font-mono text-gray-600">
                <span>1</span>
                <span>{getCurrentDateTime()}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="font-mono font-bold text-sm text-gray-800 mb-3">
              <div>{data.productName}</div>
              <div className="text-sm text-gray-600">
                {`${data.innerCount}x100x2G TEA`}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex justify-between items-start mb-3">
              {/* Weight Info */}
              <div className="font-mono text-sm text-gray-800">
                <div className="flex justify-between gap-4">
                  <span>INNERS</span>
                  <span className="font-semibold text-gray-600">
                    {data.innerCount}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>NET(Kg)</span>
                  <span className="font-semibold text-gray-600">
                    {data.netWeight}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>GROSS(Kg)</span>
                  <span className="font-semibold text-gray-600">
                    {data.grossWeight}
                  </span>
                </div>
              </div>

              {/* Verification Box */}
              <div className="border-2 border-gray-800 w-16 h-16 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                <span className="font-mono font-bold text-xs text-gray-700 mb-1">
                  {VERIFICATION_NUMBER}
                </span>
                {data.status && (
                  <span
                    className={`text-2xl ${
                      data.status === "acceptable"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {data.status === "acceptable" ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>

            {/* Carton Info */}
            <div className="flex gap-4 mt-3 font-mono text-sm text-gray-800">
              <span className="font-semibold">CARTON NO</span>
              <span className="text-gray-600 font-semibold">
                {data.masterCartons}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
