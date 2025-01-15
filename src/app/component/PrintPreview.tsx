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
  const generateNumber = () => Math.floor(100000 + Math.random() * 900000);

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
          font-family: monospace;
          font-size: 10pt;
          line-height: 1.2;
          position: relative;
          page-break-after: always;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2mm;
        }
        .product-info {
          font-weight: bold;
          margin-bottom: 4mm;
        }
        .details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4mm;
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
        }
        .status-mark {
          font-size: 24pt;
          margin-top: 1mm;
        }
        .carton-info {
          display: flex;
          gap: 8mm;
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
            <div>${generateNumber()}</div>
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
    <Card className="sticky top-4">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">Print Preview</h2>
        <div
          className="print-content font-mono bg-white mx-auto border border-gray-200"
          style={{
            width: "7.5cm",
            height: "5cm",
            padding: "0.2cm",
            fontSize: "10px",
          }}
        >
          {/* Preview content remains the same as your original code */}
          <div className="flex justify-between items-start">
            <div className="font-bold">E24/00845</div>
            <div className="flex gap-4">
              <div>1</div>
              <div>{getCurrentDateTime()}</div>
            </div>
          </div>

          <div className="font-bold mt-2">
            {data.productName || "SUWALIF PUR CEY BLACK TEA"}
          </div>
          <div className="font-bold">
            {`${data.innerCount || "36"}x100x2G TEA`}
          </div>

          <div className="mt-4 flex">
            <div className="w-32">
              <div className="flex justify-between">
                <div>INNERS</div>
                <div>{data.innerCount || "36"}</div>
              </div>
              <div className="flex justify-between">
                <div>NET(Kg)</div>
                <div>{data.netWeight || "7.20"}</div>
              </div>
              <div className="flex justify-between">
                <div>GROSS(Kg)</div>
                <div>{data.grossWeight || "11.70"}</div>
              </div>
            </div>

            <div className="flex-1 flex justify-end">
              <div className="border-2 border-black w-20 h-20 flex flex-col justify-center items-center">
                <div className="text-center font-bold">{generateNumber()}</div>
                {data.status === "acceptable" && (
                  <div className="text-3xl mt-1">✓</div>
                )}
                {data.status === "rejected" && (
                  <div className="text-3xl mt-1 text-red-500">✗</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex gap-8">
              <div className="font-bold">CARTON NO</div>
              <div>{data.masterCartons || "115"}</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handlePrint}
            disabled={!data.isFormValid}
            className="w-full"
            variant={data.isFormValid ? "default" : "secondary"}
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Label
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
