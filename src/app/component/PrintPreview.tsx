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

  const handleDirectPrint = () => {
    const printWindow = window.open("", "", "width=400,height=300");
    if (!printWindow) return;

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
       padding: 2mm; /* Reduced padding for more compactness */
       box-sizing: border-box;
       font-family: poppins, sans-serif;
       font-size: 10.5pt;
       line-height: 1.1;
       position: relative;
       page-break-inside: avoid; /* Prevent breaking inside */
   }
   .header {
   font-size: 12pt;
       display: flex;
       justify-content: space-between;
       margin-bottom: 0.5mm; /* Reduced margin for compactness */
   }
   .date {
       font-size: 8.5pt;
   }
   .product-info {
       font-weight: bold;
       margin: 0.5mm 0; /* Reduced margin for compactness */
   }
   .details {
       display: flex;
       justify-content: space-between;
       margin-top: 1.5mm; /* Moved details slightly closer */
   }
   .weight-info {
       width: 32mm;
       margin-top: 1mm; /* Moved weight info slightly down */
   }
   .weight-row {
       display: flex;
       justify-content: space-between;
       margin-bottom: 0.25mm; /* Reduced margin for compactness */
   }
   .verification-box {
       border: 0.5mm solid #000;
       width: 26mm; /* Maintained increased size */
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
       margin-top: -1mm; /* Moved carton info slightly up */
   }
`;

    const content = `
  <div class="print-label">
    <div class="header">
      <div style="font-weight: bold;">E24/00845</div>
      <div class='date' style="display: flex; gap: 4mm;">
        <div style="font-weight: bold;" >1</div>
        <div style="font-weight: bold;">${getCurrentDateTime()}</div>
      </div>
    </div>
    
    <div class="product-info">
      <div>${data.productName || "SUWALIF PUR CEY BLACK TEA"}</div>
      <div>${data.innerCount || "36"}x100x2G TEA</div>
    </div>
    
    <div class="details" style="font-weight: bold;">
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
      <div style="font-weight: bold;">${data.masterCartons || "115"}</div>
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
          setTimeout(function() { window.close(); }, 500);
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
            onClick={handleDirectPrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Label
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
              <span className="text-gray-600 font-semibold">
                {data.masterCartons || "115"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
