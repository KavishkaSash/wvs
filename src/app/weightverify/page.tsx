"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TableData } from "../component/HeaderCreateView";
import { useRouter } from "next/navigation";
import WeightDisplay from "../component/WieghtVerifyView";

const Page = () => {
  const router = useRouter();
  const [headerData, setHeaderData] = useState<TableData | null>(null);

  useEffect(() => {
    // Retrieve data from localStorage when component mounts
    const storedData = localStorage.getItem("headerData");
    if (storedData) {
      setHeaderData(JSON.parse(storedData));
      // Clear the data from localStorage after retrieving it
      localStorage.removeItem("headerData");
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (!headerData) {
    return <div className="text-center p-6">No header data found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Weight Verification
            </h1>
            <Button variant="outline" onClick={handleBack} className="text-sm">
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header Information */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Line No</span>
                <span className="font-medium">{headerData.name}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Contract No</span>
                <span className="font-medium">{headerData.progress}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Product</span>
                <span className="font-medium">{headerData.gender}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Quantity</span>
                <span className="font-medium">{headerData.col}</span>
              </div>
            </div>

            {/* Weight Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
                <span className="font-medium text-blue-800">
                  Current Weight
                </span>
                <span className="text-2xl font-bold text-blue-800">
                  0.00 kg
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  variant="default"
                >
                  Verify Weight
                </Button>
                <Button className="flex-1" variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </div>
          <WeightDisplay />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
