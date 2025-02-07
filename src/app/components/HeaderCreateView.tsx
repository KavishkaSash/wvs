import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Header } from "../types";
import { Label } from "@/components/ui/label";
import { Scale, Weight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { weightService } from "@/app/_services/weightService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HeaderCreateViewProps {
  selectedRow: Header | null;
}

const HeaderCreateView: React.FC<HeaderCreateViewProps> = ({ selectedRow }) => {
  const router = useRouter();
  const [standardWeight, setStandardWeight] = useState<number>();
  const [Print, setPrint] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Update standardWeight when selectedRow changes
  useEffect(() => {
    if (selectedRow?.std_gross_weight) {
      setStandardWeight(selectedRow.std_gross_weight);
    }
  }, [selectedRow]);
  console.log(standardWeight);
  const fields = [
    { label: "Customer Name", value: selectedRow?.customer },
    { label: "Product Name", value: selectedRow?.product_name },
    { label: "Finished Good Number", value: selectedRow?.product_id },
    { label: "Sales Order No", value: selectedRow?.order_name },
    {
      label: "Standard Weight(Kg)",
      value: selectedRow?.std_gross_weight,
      type: "weight",
    },
    {
      label: "Number of Inners for Master carton",
      value: selectedRow?.nos_inners,
    },
    {
      label: "Number of Masters for Order",
      value: selectedRow?.nos_master_cartons,
    },
    {
      label: "Gross Weight per Inner",
      value: ((standardWeight || 0) / (selectedRow?.nos_inners ?? 1)).toFixed(
        2
      ),
    },
  ];

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStandardWeight(value ? parseFloat(value) : undefined);
      setError("");
    }
  };

  const handleCreateHeader = async () => {
    const weight = standardWeight;

    if (!weight || weight <= 0) {
      setError("Please enter a valid weight");
      return;
    }

    if (!selectedRow) {
      setError("Please select a row first");
      return;
    }

    try {
      setIsLoading(true);
      const headerData = {
        std_gross_weight: weight,
        order_line_id: selectedRow.id,
        allow_print: Print,
      };

      await weightService.createWeightHeader(headerData);
      router.push("/weightverify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create header");
      console.error("Header creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: { label: string; value: any; type?: string }) => {
    if (field.type === "weight") {
      return (
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Enter weight"
            value={standardWeight}
            onChange={handleWeightChange}
            max="99"
            className="w-full sm:w-40"
            step="0.01"
          />
          <Weight className="hidden sm:block w-5 h-5 text-blue-600" />
        </div>
      );
    }
    return (
      <span className="text-gray-800 break-words">{field.value ?? "N/A"}</span>
    );
  };

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-full bg-white rounded-lg shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="py-4 sm:py-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Standard Weight Entry
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {fields.map((field) => (
              <div
                key={field.label}
                className="flex flex-col space-y-2 bg-gray-50 p-3 sm:p-4 rounded-lg"
              >
                <Label className="text-xs sm:text-sm font-medium text-gray-600">
                  {field.label}
                </Label>
                <div className="font-semibold text-sm sm:text-base">
                  {renderField(field)}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-2 bg-gray-50 p-3 sm:p-4 rounded-lg">
            <Checkbox
              id="Print"
              checked={Print}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setPrint(!!checked)
              }
            />
            <Label
              htmlFor="noPrint"
              className="text-xs sm:text-sm font-medium cursor-pointer"
            >
              Print
            </Label>
          </div>

          <Button
            className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            disabled={!selectedRow || isLoading}
            onClick={handleCreateHeader}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              "Create Header"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderCreateView;
