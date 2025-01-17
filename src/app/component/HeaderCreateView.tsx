"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { Header } from "../types";

interface HeaderCreateViewProps {
  selectedRow: Header | null;
}

const HeaderCreateView: React.FC<HeaderCreateViewProps> = ({ selectedRow }) => {
  const router = useRouter();

  const handleCreateClick = useCallback(() => {
    if (selectedRow) {
      try {
        localStorage.setItem("headerData", JSON.stringify(selectedRow));
        router.push("/weightverify");
      } catch (error) {
        console.error("Error saving header data:", error);
        alert("Failed to save header data. Please try again.");
      }
    }
  }, [selectedRow, router]);

  const fields = [
    { label: "Reference", value: selectedRow?.name },
    { label: "Customer", value: selectedRow?.customer },
    { label: "Product", value: selectedRow?.product },
    { label: "Finished Good Number", value: selectedRow?.fg_no },
    { label: "Line No", value: selectedRow?.order_line_id },
    { label: "Contract No", value: selectedRow?.contract_no },
    { label: "Standard Wieght(Kg)", value: selectedRow?.std_gross_weight },
    {
      label: "Number of Inners for Master carton",
      value: selectedRow?.inner,
    },
    {
      label: "Number of Masters for Order",
      value: selectedRow?.master,
    },

    { label: "Gross Weight per Inner ", value: selectedRow?.master_weight },
    { label: "Job No", value: selectedRow?.job_no },
    { label: "Tea Weight per Inne", value: selectedRow?.master_weight },
  ];

  return (
    <div className="mt-6">
      <Card className="w-full max-w-full bg-gray-100 border border-gray-300 rounded-none shadow-sm">
        <CardHeader className="py-4 border-b border-gray-300 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700">
            Create Header
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col">
                <span className="font-semibold text-lg text-gray-600">
                  {field.label}:{" "}
                  <span className="text-gray-700">{field.value ?? "N/A"}</span>
                </span>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-6 py-3 text-base font-medium bg-blue-600 text-white rounded-none hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedRow}
            onClick={handleCreateClick}
          >
            Create Header
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderCreateView;
