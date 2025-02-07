"use client";

import React, { useState, useEffect, useCallback } from "react";

// InfoCard component
function InfoCard({
  label,
  value,
  className,
}: Readonly<{ label: string; value: string | number; className?: string }>) {
  return (
    <div
      className={`flex items-center justify-between bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 ${className}`}
    >
      <span className="text-sm font-medium text-blue-600">{label}:</span>
      <span className="ml-2 text-sm font-semibold text-blue-800">{value}</span>
    </div>
  );
}

// Component props interface
interface WeightVerifyDisplayProps {
  header: {
    product_id: string;
    name?: string;
    order_line_id?: number;
    std_gross_weight?: number;
    job_no?: number;
  };
  apiUrl?: string;
  onWeightVerified?: (status: "" | "valid" | "invalid", weight: number) => void;
}

interface ScaleReading {
  weight: string;
  status: string;
  timestamp: string;
}

function WeightVerifyDisplay({
  header,
  apiUrl = "http://localhost:8000/scale/read",
  onWeightVerified,
}: Readonly<WeightVerifyDisplayProps>) {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "pending" | "valid" | "invalid" | "offline"
  >("pending");
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulRead, setLastSuccessfulRead] = useState<Date | null>(
    null
  );

  const MIN_WEIGHT = header.std_gross_weight
    ? header.std_gross_weight * (1 - 0.0125)
    : 0;
  const MAX_WEIGHT = header.std_gross_weight
    ? header.std_gross_weight * (1 - 0.0125)
    : 0;

  // Parse weight from scale output
  const parseWeight = (weightString: string): number => {
    // Extract the numeric value from format "ST,NT, 9,    0.54 kg"
    const match = weightString.match(/[\d.]+(?=\s*kg)/);
    if (!match) {
      throw new Error("Invalid weight format");
    }
    return parseFloat(match[0]);
  };

  // Weight reading handler
  const handleWeightFetch = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ScaleReading = await response.json();
      const weight = parseWeight(data.weight);

      if (isNaN(weight)) {
        throw new Error("Invalid weight reading");
      }

      setCurrentWeight(weight);
      setLastSuccessfulRead(new Date());
      setError(null);

      const newStatus =
        weight >= MIN_WEIGHT && weight <= MAX_WEIGHT ? "valid" : "invalid";

      setStatus(newStatus);
      onWeightVerified?.(newStatus, weight);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Weight reading error:", err);
      setError(`Connection error: ${errorMessage}`);
      setStatus("offline");
    }
  }, [apiUrl, onWeightVerified, MIN_WEIGHT, MAX_WEIGHT]);

  // Polling effect
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    // Start polling immediately when the component mounts
    handleWeightFetch();
    pollInterval = setInterval(handleWeightFetch, 1000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [handleWeightFetch]);

  // Status styling
  const statusClass = {
    valid: "bg-green-500",
    invalid: "bg-red-500",
    pending: "bg-gray-400",
    offline: "bg-yellow-500",
  }[status];

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-full mx-auto space-y-6 border">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Weight Verification
      </h1>

      <div className="w-full space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        <InfoCard label="Line Number" value={header.job_no ?? "N/A"} />
        <InfoCard
          label="Product Name"
          value={header.product_id ?? "No product selected"}
        />
        <InfoCard
          label="Standard Weight"
          value={`${
            header.std_gross_weight ? header.std_gross_weight + " kg" : "N/A"
          }`}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>

      <div className="w-full flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <span className="text-lg font-medium text-blue-600">
          Current Weight
        </span>
        {error ? (
          <div className="flex flex-col items-center">
            <span className="text-red-500 text-lg font-medium">{error}</span>
          </div>
        ) : currentWeight !== null ? (
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-blue-800">
              {currentWeight.toFixed(2)} kg
            </span>
            {lastSuccessfulRead && (
              <span className="text-xs text-gray-500 mt-1">
                Last updated: {lastSuccessfulRead.toLocaleTimeString()}
              </span>
            )}
          </div>
        ) : (
          <span className="text-yellow-600 text-lg font-medium">
            Waiting for reading...
          </span>
        )}
      </div>

      <div
        className={`w-full flex items-center justify-center p-4 text-white text-xl font-bold rounded-lg shadow-md ${statusClass}`}
      >
        {status === "valid" && "Weight Accepted"}
        {status === "invalid" && "Weight Rejected"}
        {status === "pending" && "Verifying..."}
        {status === "offline" && "System Offline"}
      </div>
    </div>
  );
}

export default WeightVerifyDisplay;
