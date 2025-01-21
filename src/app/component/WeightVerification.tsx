"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TeaLabel } from "./PrintPreview";

// Types with proper validation ranges
interface FormData {
  id: number;
  productName: string;
  innerCount: string;
  netWeight: string;
  grossWeight: number;
  masterCartons: string;
  serialNumber: string;
  weight: string;
  operatorName: string;
  shiftCode: string;
  lotNumber: string;
  productionDate: string;
}

// Constants
const WEIGHT_TOLERANCE = 0.1; // 0.1 kg tolerance
const DEFAULT_STANDARD_WEIGHT = 2.5;

// Form Field Component
const FormField: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: string;
}> = ({ label, ...props }) => (
  <div className="space-y-2">
    <Label className="font-medium">{label}</Label>
    <Input {...props} className="w-full" />
  </div>
);

// Main Component
const WeightVerification: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    productName: "",
    innerCount: "",
    netWeight: "",
    grossWeight: 0,
    masterCartons: "",
    serialNumber: "",
    weight: "",
    operatorName: "",
    shiftCode: "",
    lotNumber: "",
    productionDate: "",
  });

  const [status, setStatus] = useState<"acceptable" | "rejected" | "">("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "weight") {
        const currentWeight = parseFloat(value);
        if (!isNaN(currentWeight)) {
          const difference = Math.abs(currentWeight - DEFAULT_STANDARD_WEIGHT);
          setStatus(difference <= WEIGHT_TOLERANCE ? "acceptable" : "rejected");
        }
      }
    },
    []
  );

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Weight Verification Label</title>
          <style>
            @page {
              size: 7.5cm 5cm;
              margin: 0;
            }
            body { 
              margin: 0;
              font-family: monospace;
            }
            .print-content { 
              width: 7.5cm;
              height: 5cm;
              box-sizing: border-box;
              padding: 0.2cm;
            }
          </style>
        </head>
        <body>
          ${document.querySelector(".print-content")?.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, [formData]);

  const isFormValid = useCallback(() => {
    const requiredFields = [
      "productName",
      "innerCount",
      "netWeight",
      "grossWeight",
      "masterCartons",
    ];
    return requiredFields.every((field) => formData[field as keyof FormData]);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Form */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Weight Verification</h2>
                <div className="space-y-4">
                  <FormField
                    label="Current Weight (kg)"
                    type="number"
                    step="0.001"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter current weight"
                  />

                  <FormField
                    label="Standard Weight (kg)"
                    type="text"
                    name="standardWeight"
                    value={`${DEFAULT_STANDARD_WEIGHT} kg`}
                    onChange={() => {}}
                    disabled
                  />

                  {status && (
                    <Alert
                      variant={
                        status === "acceptable" ? "default" : "destructive"
                      }
                    >
                      <AlertDescription>
                        Status:{" "}
                        {status === "acceptable"
                          ? "Weight is Acceptable"
                          : "Weight is Not Acceptable"}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Product Details</h2>
                <div className="space-y-4">
                  <FormField
                    label="Product Name"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Inner Count"
                      type="number"
                      name="innerCount"
                      value={formData.innerCount}
                      onChange={handleInputChange}
                      placeholder="Enter count"
                    />
                    <FormField
                      label="Master Cartons"
                      type="number"
                      name="masterCartons"
                      value={formData.masterCartons}
                      onChange={handleInputChange}
                      placeholder="Enter cartons"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Net Weight (kg)"
                      type="number"
                      step="0.001"
                      name="netWeight"
                      value={formData.netWeight}
                      onChange={handleInputChange}
                      placeholder="Enter net weight"
                    />
                    <FormField
                      label="Gross Weight (kg)"
                      type="number"
                      step="0.001"
                      name="grossWeight"
                      value={formData.grossWeight.toString()}
                      onChange={handleInputChange}
                      placeholder="Enter gross weight"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Print Preview */}
          <TeaLabel
            data={{
              ...formData,
              grossWeight: formData.grossWeight || 0,
              status,
              isFormValid: isFormValid(),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeightVerification;
