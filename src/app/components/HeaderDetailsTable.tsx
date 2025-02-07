import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import HeaderCreateView from "./HeaderCreateView";
import TableComponent from "./HeaderTable";
import { Header } from "../types";
import { SaleOrderLine } from "../_services/salesOrderService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

const WeightHeadersPage = () => {
  const [selectedRow, setSelectedRow] = useState<Header | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreateViewVisible, setIsCreateViewVisible] = useState(false);

  const searchParams = useSearchParams();
  const currentState = searchParams.get("state");

  const handleRowSelect = (rowData: SaleOrderLine) => {
    setSelectedRow(rowData as unknown as Header);
    setIsCreateViewVisible(true);
  };

  const handleCreateViewClose = () => {
    setSelectedRow(null);
    setIsCreateViewVisible(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weight Headers</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and create weight headers for shipments efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Error loading weight headers: {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex h-full ">
            {/* Table Section */}
            <Card className="flex-1 overflow-hidden radius-none">
              <CardContent className="p-0 h-full">
                <TableComponent
                  searchField="name"
                  onRowSelect={handleRowSelect}
                />
              </CardContent>
            </Card>

            {/* Sliding Create/Edit Panel */}
            {isCreateViewVisible && (
              <Card className="w-1/3 flex-shrink-0 overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedRow ? "Edit Header" : "Create Header"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateViewClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <HeaderCreateView selectedRow={selectedRow} />
                </ScrollArea>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightHeadersPage;
