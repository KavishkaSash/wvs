"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { TableData } from "./HeaderCreateView";

function CreatedHeadersCard() {
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

  if (!headerData) {
    return <div className="text-center p-6">No header data found.</div>;
  }
  return (
    <div>
      <Card className="max-w-2xl mx-auto">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatedHeadersCard;
