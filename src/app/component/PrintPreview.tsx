"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface TeaLabelProps {
  data: {
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

export const TeaLabel: React.FC<TeaLabelProps> = ({ data }) => {
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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Print styles remain the same as they're for the actual label printing
    const style = `
    @page {
      size: 75mm 50mm;
      margin: 0;
    }
    @media print {
      html, body {
        margin: 0;
        padding: 0;
        width: 75mm;
        height: 50mm;
      }
      .print-label {
        width: 75mm;
        height: 50mm;
        padding: 2mm;
        box-sizing: border-box;
        font-family: poppins;
        font-size: 10pt;
        line-height: 1.2;
        position: relative;
        page-break-after: always;
      }
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5mm;
      }
      .product-info {
        font-weight: bold;
        margin-bottom: 3mm;
      }
      .details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2mm;
      }
      .weight-info {
        width: 32mm;
      }
      .weight-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1mm;
      }
      .verification-box {
        border: 0.5mm solid black;
        width: 20mm;
        height: 20mm;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        margin-top: 2mm;
      }
      .status-mark {
        font-size: 18pt;
        margin-top: 1mm;
      }
      .carton-info {
        display: flex;
        gap: 3mm; /* Adjusted space to reduce gap */
        margin-top: 0.5mm; /* Reduced margin for better alignment */
        font-size: 12pt; /* Slightly increased font size for better readability */
      }
    }
  `;

    const content = `
    <div class="print-label">
      <div class="header">
        <div style="font-weight: bold;">E24/00845</div>
        <div style="display: flex; gap: 4mm;">
          <div>1</div>
          <div>${getCurrentDateTime()}</div>
        </div>
      </div>
      
      <div class="product-info">
        <div>${data.productName || "SUWALIF PUR CEY BLACK TEA"}</div>
        <div>${data.innerCount || "36"}x100x2G TEA</div>
      </div>
      
      <div class="details">
        <div class="weight-info">
          <div class="weight-row">
            <div>INNERS</div>
            <div>${data.innerCount || "36"}</div>
          </div>
          <div class="weight-row">
            <div>NET(Kg)</div>
            <div>${data.netWeight || "7.20"}</div>
          </div>
          <div class="weight-row">
            <div>GROSS(Kg)</div>
            <div>${data.grossWeight || "11.70"}</div>
          </div>
        </div>
        
        <div class="verification-box">
          <div>${VERIFICATION_NUMBER}</div>
          <div class="status-mark">
            ${
              data.status === "acceptable"
                ? "✓"
                : data.status === "rejected"
                ? "✗"
                : ""
            }
          </div>
        </div>
      </div>
      
      <div class="carton-info">
        <div style="font-weight: bold;">CARTON NO</div>
        <div>${data.masterCartons || "115"}</div>
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
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Label Preview</h2>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Label
          </Button>
        </div>

        {/* Label Preview with small padding */}
        <div className="bg-white border border-gray-200 shadow-sm p-2 rounded-lg">
          {/* Label Container with fixed aspect ratio */}

          {/* Label Content */}
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
              <div>{data.productName || "SUWALIF PUR CEY BLACK TEA"}</div>
              <div className="text-sm text-gray-600">
                {`${data.innerCount || "36"}x100x2G TEA`}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex justify-between items-start mb-3">
              {/* Weight Info */}
              <div className="font-mono text-sm text-gray-800">
                <div className="flex justify-between gap-4">
                  <span>INNERS</span>
                  <span className="font-semibold text-gray-600">
                    {data.innerCount || "36"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>NET(Kg)</span>
                  <span className="font-semibold text-gray-600">
                    {data.netWeight || "7.20"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>GROSS(Kg)</span>
                  <span className="font-semibold text-gray-600">
                    {data.grossWeight || "11.70"}
                  </span>
                </div>
              </div>

              {/* Verification Box */}
              <div className="border-2 border-gray-800 w-16 h-16 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                <span className="font-mono font-bold text-sm text-gray-700 mb-1">
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
              <span className="text-gray-600">
                {data.masterCartons || "115"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
