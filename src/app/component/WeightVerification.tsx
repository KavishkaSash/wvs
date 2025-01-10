import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";

// Types
interface FormData {
  productName: string;
  innerCount: string;
  netWeight: string;
  grossWeight: string;
  masterCartons: string;
  serialNumber: string;
  weight: string;
  operatorName?: string;
  shiftCode?: string;
  lotNumber?: string;
  productionDate?: string;
}

interface PrintData extends FormData {
  status: string;
  printingDateTime: string;
  verificationSymbol: string;
}

// Print Preview Component
const PrintPreview: React.FC<{ data: PrintData }> = ({ data }) => (
  <div className="print-content w-[400px] h-[600px] mx-auto bg-white">
    <div className="border-2 border-black p-4 h-full">
      <div className="text-center border-b-2 border-black pb-2">
        <h2 className="text-xl font-bold">Weight Verification Label</h2>
        <p className="text-sm">{data.printingDateTime}</p>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="font-bold">Product Name:</p>
          <p>{data.productName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">Inner Count:</p>
            <p>{data.innerCount}</p>
          </div>
          <div>
            <p className="font-bold">Master Cartons:</p>
            <p>{data.masterCartons}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">Net Weight:</p>
            <p>{data.netWeight} kg</p>
          </div>
          <div>
            <p className="font-bold">Gross Weight:</p>
            <p>{data.grossWeight} kg</p>
          </div>
        </div>

        <div>
          <p className="font-bold">Serial Number:</p>
          <p className="font-mono">{data.serialNumber}</p>
        </div>

        <div className="mt-6 border-t-2 border-black pt-4">
          <div className="text-center">
            <p className="font-bold text-xl">Weight Check</p>
            <p className="text-3xl mt-2">{data.weight} kg</p>
            <div
              className={`mt-2 inline-block px-4 py-1 rounded ${
                data.status === "acceptable"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {data.verificationSymbol} {data.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const WeightVerification: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    innerCount: "",
    netWeight: "",
    grossWeight: "",
    masterCartons: "",
    serialNumber: "",
    weight: "",
    operatorName: "",
    shiftCode: "",
    lotNumber: "",
    productionDate: "",
  });

  const [status, setStatus] = useState<string>("");
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);
  const standardWeight = 2.5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "weight" || name === "netWeight" || name === "grossWeight") {
      if (value && !isNaN(parseFloat(value))) {
        verifyWeight(value);
      }
    }
  };

  const verifyWeight = (weightValue: string) => {
    const currentWeight = parseFloat(weightValue);
    setStatus(
      currentWeight >= standardWeight - 0.02 ? "acceptable" : "rejected"
    );
  };

  const handlePrint = () => {
    const printContent = document.querySelector(".print-content");
    if (!printContent) return;

    const printWindow = window.open("", "", "width=600,height=800");
    if (!printWindow) return;

    const printData: PrintData = {
      ...formData,
      status,
      printingDateTime: new Date().toLocaleString(),
      verificationSymbol: status === "acceptable" ? "✓" : "✗",
    };

    printWindow.document.write(`
      <html>
        <head>
          <title>Weight Verification Label</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .print-content { 
                page-break-inside: avoid;
                margin: auto;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for styles to load
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const isFormValid = () => {
    return (
      formData.productName &&
      formData.innerCount &&
      formData.grossWeight &&
      formData.masterCartons &&
      formData.serialNumber &&
      formData.weight
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          {/* Left side - Form */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Weight Verification</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="weight"
                      className="w-full p-2 border rounded"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Standard Weight
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-gray-50"
                      value={`${standardWeight} kg`}
                      disabled
                    />
                  </div>

                  {status && (
                    <div
                      className={`p-3 rounded ${
                        status === "acceptable"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Status:{" "}
                      {status === "acceptable"
                        ? "Weight is OK"
                        : "Weight is Not Acceptable"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <div className="space-y-4 mb-20">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      className="w-full p-2 border rounded"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Inner Count
                    </label>
                    <input
                      type="number"
                      name="innerCount"
                      className="w-full p-2 border rounded"
                      value={formData.innerCount}
                      onChange={handleInputChange}
                      placeholder="Enter inner count"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gross Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="grossWeight"
                      className="w-full p-2 border rounded"
                      value={formData.grossWeight}
                      onChange={handleInputChange}
                      placeholder="Enter gross weight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Master Cartons
                    </label>
                    <input
                      type="number"
                      name="masterCartons"
                      className="w-full p-2 border rounded"
                      value={formData.masterCartons}
                      onChange={handleInputChange}
                      placeholder="Enter master cartons"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      className="w-full p-2 border rounded"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      placeholder="Enter serial number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Print Preview */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Print Preview</h2>
                <PrintPreview
                  data={{
                    ...formData,
                    status,
                    printingDateTime: new Date().toLocaleString(),
                    verificationSymbol: status === "acceptable" ? "✓" : "✗",
                  }}
                />
                <div className="mt-4">
                  <button
                    onClick={handlePrint}
                    disabled={!isFormValid()}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded text-white ${
                      isFormValid()
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Printer className="w-5 h-5" />
                    Print Sticker
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Print Button */}
      </div>
    </div>
  );
};

export default WeightVerification;
