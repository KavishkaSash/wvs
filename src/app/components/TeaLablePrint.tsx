import React, { forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TeaLabelPrintProps {
  data: {
    id: number;
    productName: string;
    innerCount: number;
    netWeight: number;
    grossWeight: number;
    masterCartons: number;
    status: "valid" | "invalid" | "";
    contract_no: string;
    line_serial: string;
    index_no:number;
    net_qty:number;
    order_line_number:number;
  };
  onPrint?: () => void;
}

const TeaLabelPrint = forwardRef<any, TeaLabelPrintProps>((props, ref) => {
  const { data, onPrint } = props;
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString();
    return `${day}-${month}-${year} ${time}`;
  };

  const handlePrint = async () => {
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
          font-size: 6.5pt;
          margin-top: 1mm;
          text-align: center;
        }
        .carton-info {
          display: flex;
          gap: 1mm;
          font-size: 10pt;
          align-items: center;
          margin-top: -1mm;
          justify-content: space-between;
        }
      `;

      const content = `
        <div class="print-label">
          <div class="header">
            <div style="font-weight: bold;">${data.contract_no}</div>
            <div class='date' style="display: flex; gap: 4mm;">
              <div style="font-weight: bold;">   ${data.id} </div>
              <div style="font-weight: bold;">${getCurrentDateTime()}</div>
            </div>
          </div>
          <div class="product-info">
            <div>${data.order_line_number}</div>
            
          </div>
          <div class="product-info">
            <div>${data.productName}</div>
            
          </div>
          <div class="details" style="font-weight: bold;">
            <div class="weight-info">
              <div class="weight-row">
                <div>INNERS</div>
                <div>${data.innerCount}</div>
              </div>
              <div class="weight-row">
                <div>NET(Kg)</div>
                <div>${data.net_qty.toFixed(2)}</div>
              </div>
              <div class="weight-row">
                <div>GROSS(Kg)</div>
                <div>${data.netWeight}</div>
              </div>
            </div>
            <div class="verification-box">
              <div class="verification-number" style="font-weight: bold;">${
                data.line_serial || ""
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
              data.index_no ?? 0
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

      printWindow.document.close();

      const handlePrintMessage = (event: MessageEvent) => {
        if (event.data === "printComplete") {
          window.removeEventListener("message", handlePrintMessage);
          onPrint?.();
          toast({
            title: "Success",
            description: "Label printed successfully",
          });
        }
      };

      window.addEventListener("message", handlePrintMessage);
    } catch (error) {
      console.error("Print failed:", error);
      toast({
        title: "Error",
        description: "Failed to print label",
        variant: "destructive",
      });
    }
  };
  useImperativeHandle(ref, () => ({
    handlePrint,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Label Print Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-white border border-gray-200 shadow-sm p-2 rounded-lg">
          <div
            className="bg-white border border-gray-300 rounded-lg justify-center mx-auto"
            style={{ width: "75mm", height: "50mm", padding: "1mm" }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="font-mono font-semibold text-gray-800">
                {data.contract_no}
              </span>
              <div className="flex gap-3 font-mono text-gray-600">
                <span>{data.id}</span>
                <span>{getCurrentDateTime()}</span>
              </div>
            </div>
            <div className="font-mono font-bold text-sm text-gray-800 mb-3">
              <div>{data.productName}</div>
              <div className="text-sm text-gray-600">{`${data.innerCount}x100x2G TEA`}</div>
            </div>
            <div className="flex justify-between items-start mb-3">
              <div className="font-mono text-sm text-gray-800">
                <div className="flex justify-between gap-4">
                  <span>INNERS</span>
                  <span className="font-semibold">{data.innerCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>NET(Kg)</span>
                  <span className="font-semibold">{data.netWeight}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>GROSS(Kg)</span>
                  <span className="font-semibold">{data.grossWeight}</span>
                </div>
              </div>
              <div className="border-2 border-gray-800 w-16 h-16 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                <span className="font-mono font-bold text-xs text-gray-700 mb-1">
                  {data.line_serial}
                </span>
                <span
                  className={`text-2xl ${
                    data.status === "valid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.status === "valid" ? "✓" : "✗"}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-3 font-mono text-sm text-gray-800">
              <span className="font-semibold">
                CARTON NO {data.masterCartons}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default TeaLabelPrint;
