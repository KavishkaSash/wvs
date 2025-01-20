"use client";

import React, { useState, useEffect, useCallback } from "react";

// Reusable InfoCard component
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

type WeightVerifyDisplayProps = {
  header: {
    name?: string;
    order_line_id?: number;
    std_gross_weight?: number;
  };
  onWeightVerified?: (
    status: "" | "acceptable" | "rejected",
    weight: number
  ) => void;
};

// Function to fetch weight from local API with timeout
async function fetchLocalWeight(timeout = 5000): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch("http://localhost:3000/api/weight", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch weight");
    }

    const data = await response.json();
    return parseFloat(data.weight);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
    }
    throw error;
  }
}

function WeightVerifyDisplay({
  header,
  onWeightVerified,
}: Readonly<WeightVerifyDisplayProps>) {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [status, setStatus] = useState("pending");

  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSuccessfulRead, setLastSuccessfulRead] = useState<Date | null>(
    null
  );

  // Define acceptable weight range
  const MIN_WEIGHT = 5;
  const MAX_WEIGHT = header.std_gross_weight
    ? header.std_gross_weight + 0.5
    : 10;
  const MAX_RETRIES = 3;
  const RETRY_INTERVAL = 5000; // 5 seconds between retries

  const handleWeightFetch = useCallback(async () => {
    try {
      const weight = await fetchLocalWeight();

      if (weight === null) {
        throw new Error("Invalid weight reading");
      }

      setCurrentWeight(weight);
      setLastSuccessfulRead(new Date());
      setRetryCount(0);
      setError(null);

      // Determine status based on weight range
      const newStatus =
        weight >= MIN_WEIGHT && weight <= MAX_WEIGHT
          ? "acceptable"
          : "rejected";

      setStatus(newStatus);
      onWeightVerified?.(newStatus, weight);

      // Reset polling if it was stopped
      setIsPolling(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      if (retryCount >= MAX_RETRIES) {
        setError(`Connection lost: ${errorMessage}`);
        setStatus("offline");
        setIsPolling(false);
        return;
      }

      setRetryCount((prev) => prev + 1);
      setError(`Retry ${retryCount + 1}/${MAX_RETRIES}: ${errorMessage}`);
    }
  }, [retryCount, onWeightVerified]);

  // Manual retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setStatus("pending");
    setIsPolling(true);
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    if (isPolling) {
      // Initial fetch
      handleWeightFetch();

      // Set up polling
      pollInterval = setInterval(handleWeightFetch, 1000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isPolling, handleWeightFetch]);

  const statusClass = {
    acceptable: "bg-green-500",
    rejected: "bg-red-500",
    pending: "bg-gray-400",
    offline: "bg-yellow-500",
  }[status];

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-full mx-auto space-y-6 border">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Weight Verification
      </h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard label="Line Number" value={header.order_line_id ?? "N/A"} />
        <InfoCard
          label="Product Name"
          value={header.name ?? "No product selected"}
        />
        <InfoCard
          label="Standard Weight"
          value={`${
            header.std_gross_weight ? header.std_gross_weight + " kg" : "N/A"
          }`}
        />
      </div>

      <div className="w-full flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <span className="text-lg font-medium text-blue-600">
          Current Weight
        </span>
        {error ? (
          <div className="flex flex-col items-center">
            <span className="text-red-500 text-lg font-medium">{error}</span>
            {!isPolling && (
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Retry Connection
              </button>
            )}
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
          <span className="text-yellow-600 text-lg font-medium">Offline</span>
        )}
      </div>

      <div
        className={`w-full flex items-center justify-center p-4 text-white text-xl font-bold rounded-lg shadow-md ${statusClass}`}
      >
        {status === "acceptable" && "Weight Accepted"}
        {status === "rejected" && "Weight Rejected"}
        {status === "pending" && "Verifying..."}
        {status === "offline" && "System Offline"}
      </div>
    </div>
  );
}

export default WeightVerifyDisplay;
