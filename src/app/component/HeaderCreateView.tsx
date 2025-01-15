import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";

export interface TableData {
  id: number;
  name: string;
  progress: number;
  gender: string;
  rating: number;
  col: string;
  dob: string;
}

interface HeaderCreateViewProps {
  selectedRow: TableData | null;
}

const HeaderCreateView: React.FC<HeaderCreateViewProps> = ({ selectedRow }) => {
  return (
    <div className="mt-6">
      <Card className="w-full max-w-2xl  bg-white shadow-lg border rounded-md">
        <CardHeader className="py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Header
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Line No</span>
              <span className="text-gray-800">
                {selectedRow?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Contract No</span>
              <span className="text-gray-800">
                {selectedRow?.progress || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Product</span>
              <span className="text-gray-800">
                {selectedRow?.gender || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Job No</span>
              <span className="text-gray-800">
                {selectedRow?.rating || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Quantity</span>
              <span className="text-gray-800">{selectedRow?.col || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Customer</span>
              <span className="text-gray-800">{selectedRow?.dob || "N/A"}</span>
            </div>
          </div>
          <Button
            className="w-full mt-6 py-3 text-base font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={!selectedRow}
          >
            Create Header
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderCreateView;
