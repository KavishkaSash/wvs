"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { TeaLabel } from "./PrintPreview";

interface HeaderData {
  name: string;
  progress: string;
  gender: string;
  col: string;
  [key: string]: string;
}

interface FormData {
  productName: string;
  innerCount: string;
  netWeight: string;
  grossWeight: string;
  masterCartons: string;
  serialNumber: string;
  weight: string;
  operatorName: string;
  shiftCode: string;
  lotNumber: string;
  productionDate: string;
}

const WEIGHT_TOLERANCE = 0.1;
const DEFAULT_STANDARD_WEIGHT = 2.5;

const WeightVerificationSystem = () => {
  const router = useRouter();
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const [weightHistory, setWeightHistory] = useState<
    Array<{
      timestamp: string;
      weight: number;
      status: boolean;
    }>
  >([]);

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
    productionDate: new Date().toISOString().split("T")[0],
  });

  // Load header data from localStorage
  useEffect(() => {
    try {
      const savedHeaderData = localStorage.getItem("headerData");
      if (savedHeaderData) {
        const parsedData = JSON.parse(savedHeaderData);
        setHeaderData(parsedData);
        // Update form data with header data
        setFormData((prev) => ({
          ...prev,
          productName: parsedData.gender || "", // Using gender as product name as per your data structure
          innerCount: parsedData.col || "", // Using col as inner count
        }));
      } else {
        console.error("No header data found");
        // Optionally redirect back if no data found
        // router.push("/");
      }
    } catch (error) {
      console.error("Error loading header data:", error);
    }
  }, []);

  // Simulate serial port connection
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedWeight =
        DEFAULT_STANDARD_WEIGHT + (Math.random() - 0.5) * 0.2;
      handleWeightUpdate(simulatedWeight);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleWeightUpdate = (weight: number) => {
    setCurrentWeight(weight);
    const accepted =
      Math.abs(weight - DEFAULT_STANDARD_WEIGHT) <= WEIGHT_TOLERANCE;
    setIsAccepted(accepted);
    setFormData((prev) => ({ ...prev, weight: weight.toFixed(3) }));
  };

  const handleVerifyWeight = () => {
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      weight: currentWeight,
      status: isAccepted,
    };
    setWeightHistory((prev) => [newEntry, ...prev]);
  };

  const handleBack = () => {
    localStorage.removeItem("headerData"); // Clean up stored data
    router.push("/"); // Return to previous page
  };

  if (!headerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <Alert>
              <AlertDescription>
                Loading weight verification data...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-2xl font-bold ml-4">
                    Weight Verification
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Line No</Label>
                    <div>{headerData.name}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Contract No</Label>
                    <div>{headerData.progress}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Product</Label>
                    <div>{headerData.gender}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Quantity</Label>
                    <div>{headerData.col}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weight Display */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-black p-8 rounded-lg text-center">
                    <div className="text-7xl font-mono text-green-500">
                      {currentWeight.toFixed(3)}
                      <span className="text-4xl ml-2">kg</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      {isAccepted ? (
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-500" />
                      )}
                      <span
                        className={
                          isAccepted ? "text-green-500" : "text-red-500"
                        }
                      >
                        {isAccepted ? "Weight Accepted" : "Weight Rejected"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="flex-1 text-lg py-6"
                      onClick={handleVerifyWeight}
                    >
                      Verify Weight
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentWeight(0)}
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weight History */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Weight History</h2>
                <div className="h-[300px] overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-right">Weight</th>
                        <th className="px-4 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightHistory.map((entry, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{entry.timestamp}</td>
                          <td className="px-4 py-2 text-right">
                            {entry.weight.toFixed(3)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-sm ${
                                entry.status
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {entry.status ? "Accepted" : "Rejected"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Label Preview */}
          <div className="space-y-6">
            <TeaLabel
              data={{
                ...formData,
                status: isAccepted ? "acceptable" : "rejected",
                isFormValid: true,
                onPrint: () => {},
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightVerificationSystem;
