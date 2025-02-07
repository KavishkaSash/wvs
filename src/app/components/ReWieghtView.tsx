"use client";
import React, { useEffect, useRef, useState } from "react";
import { weightService } from "../_services/weightService";
import WeightVerifyDisplay from "./WieghtVerifyDisplay";
import { toast } from "@/hooks/use-toast";
import TeaLabelPrint from "./TeaLablePrint";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Printer,
  RefreshCw,
  ClipboardCheck,
  Scale,
  ClipboardList,
  Search,
} from "lucide-react";

// Keep the existing interfaces...
interface LineResponse {
  id: number;
  header_id: number;
  index_no: number;
  datetime: string;
  gross_weight: number;
  line_serial: string;
  remark: [];
  status: "draft" | "invalid" | "completed" | string;
  product_name: string;
  product_std_weight: number;
  nos_master_cartons: number;
  nos_inners: number;
  order_id: string;
  net_qty: number | undefined;
  order_line_number: number;
}

type Status = "invalid" | "valid";

interface LineOption {
  value: string;
  label: string;
  headerid: number;
  status: "invalid" | "valid" | "draft" | "";
  gross_weight: number;
  std_weight: number;
  product_name: string;
  nos_inners: number;
  nos_master_cartons: number;
  order_id: string;
  index_no: number;
  net_qty: number | undefined;
  order_line_number: number;
}

function ReWeightView() {
  const [serialNumber, setSerialNumber] = useState("");
  const [remark, setRemark] = useState("");
  const [lines, setLines] = useState<LineResponse[]>([]);
  const [lineOptions, setLineOptions] = useState<LineOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<LineOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<LineOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<number>();
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printEnabled, setPrintEnabled] = useState(true);
  const teaLabelRef = useRef<{ handlePrint: () => void }>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Existing useEffect hooks...
  useEffect(() => {
    const fetchLines = async () => {
      try {
        setIsLoading(true);
        const response = await weightService.getLines();
        const array = response.data;

        const validLines: LineResponse[] = Array.isArray(array)
          ? array.filter((line) => line.line_serial)
          : [];

        setLines(validLines);

        const options: LineOption[] = validLines.map((line) => ({
          value: line.line_serial,
          label: `${line.line_serial} (${line.status})`,
          headerid: line.id,
          status:
            line.status === "completed"
              ? "valid"
              : line.status === "invalid"
              ? "invalid"
              : "",
          gross_weight: line.gross_weight,
          std_weight: line.product_std_weight,
          product_name: line.product_name,
          nos_inners: line.nos_inners,
          nos_master_cartons: line.nos_master_cartons,
          order_id: line.order_id,
          index_no: line.index_no,
          net_qty: line.net_qty,
          order_line_number: line.order_line_number,
        }));

        setLineOptions(options);
        setFilteredOptions(options);
      } catch (error) {
        console.error("Error fetching lines:", error);
        setError("Failed to fetch lines");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLines();
  }, []);

  const handleUpdate = async () => {
    if (!selectedOption) {
      toast({
        title: "Error",
        description: "Please select a valid serial number and enter a remark",
        variant: "destructive",
      });
      return;
    }
    if (!verificationStatus) {
      toast({
        title: "Error",
        description: "Please verify the weight first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (currentWeight === undefined) {
        throw new Error("Weight must be verified first");
      }

      const payload = {
        id: selectedOption.headerid,
        remark: remark,
        status: verificationStatus === "valid" ? "valid" : "cancelled",
        gross_weight_2: currentWeight,
      };

      await weightService.updateLine(payload);

      // Only print if printing is enabled
      if (printEnabled) {
        teaLabelRef.current?.handlePrint();
      }

      toast({
        title: "Success",
        description: "Weight updated successfully",
      });

      setTimeout(handleClear, 1000);
    } catch (error) {
      console.error("Error updating line:", error);
      toast({
        title: "Error",
        description: "Failed to update weight",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Other handler functions...
  const handleSerialInputChange = (value: string) => {
    setSerialNumber(value);
    setIsDropdownVisible(true);

    const filtered = lineOptions.filter((option) =>
      option.value.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);

    const matchedOption = filtered.find((option) => option.value === value);
    if (matchedOption) {
      setSelectedOption(matchedOption);
    } else {
      setSelectedOption(null);
    }
  };

  const handleClear = () => {
    setSerialNumber("");
    setRemark("");
    setFilteredOptions(lineOptions);
    setSelectedOption(null);
    setIsDropdownVisible(false);
    setVerificationStatus("");
    setCurrentWeight(undefined);
  };

  const handleWeightVerified = (
    status: "" | "valid" | "invalid",
    weight: number
  ) => {
    setVerificationStatus(status);
    setCurrentWeight(weight);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Top Bar with Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <RefreshCw className="w-6 h-6" />
            Reweight Information
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={printEnabled}
                onCheckedChange={setPrintEnabled}
                id="print-mode"
                
              />
              <label
                htmlFor="print-mode"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {printEnabled ? "Printing Enabled" : "Printing Disabled"}
              </label>
            </div>
            <Button
              onClick={handleUpdate}
              disabled={isLoading || !selectedOption}
              className="min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Printer className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Updating..." : "Update & Print"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Search and Details Card */}
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="relative" ref={dropdownRef}>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Serial Number
                </label>
                <div className="flex gap-2">
                  <Input
                    value={serialNumber}
                    onChange={(e) => handleSerialInputChange(e.target.value)}
                    onFocus={() => setIsDropdownVisible(true)}
                    placeholder="Type to search for a serial number"
                    disabled={isLoading}
                    className="flex-1"
                  />
                  {serialNumber && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleClear}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isDropdownVisible && filteredOptions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSerialNumber(option.value);
                          setSelectedOption(option);
                          setIsDropdownVisible(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          option.status === "invalid"
                            ? "text-red-500"
                            : option.status === "draft"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedOption && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">
                    Selected Item Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Product Name:</span>
                      <span className="text-gray-600">
                        {selectedOption.product_name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Standard Weight:</span>
                      <span className="text-gray-600">
                        {selectedOption.std_weight}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Gross Weight:</span>
                      <span className="text-gray-600">
                        {selectedOption.gross_weight}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Status:</span>
                      <span className="text-gray-600">
                        {selectedOption.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Remark
                </label>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remark"
                  disabled={isLoading}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Weight Verification Card */}
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Weight Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <WeightVerifyDisplay
                header={{
                  product_id: selectedOption?.order_id || "",
                  name: selectedOption?.product_name,
                  order_line_id: selectedOption?.headerid,
                  std_gross_weight: selectedOption?.std_weight,
                }}
                onWeightVerified={handleWeightVerified}
              />
            </CardContent>
          </Card>

          {/* Print Preview Card */}
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Print Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TeaLabelPrint
                data={{
                  productName: selectedOption?.product_name || "",
                  netWeight: currentWeight || 0,
                  id: selectedOption?.headerid || 0,
                  innerCount: selectedOption?.nos_inners || 0,
                  grossWeight: selectedOption?.gross_weight || 0,
                  masterCartons: selectedOption?.nos_master_cartons || 0,
                  line_serial: serialNumber,
                  status: verificationStatus === "valid" ? "valid" : "invalid",
                  contract_no: selectedOption?.order_id || "",
                  index_no: selectedOption?.index_no || 0,
                  net_qty: selectedOption?.net_qty || 0,
                  order_line_number: selectedOption?.order_line_number || 0,
                }}
                ref={teaLabelRef}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ReWeightView;
