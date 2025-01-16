"use client";
import React, { useState, useEffect } from "react";

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
  productName?: string;

  onWeightVerified?: (
    status: "" | "acceptable" | "rejected",
    weight: number
  ) => void;
};

function WeightVerifyDisplay({
  productName,
  onWeightVerified,
}: WeightVerifyDisplayProps) {
  const [currentWeight, setCurrentWeight] = useState(0.0);
  const [status, setStatus] = useState("pending");
  const [lineNumber] = useState("LN-12345");
  const [standardWeight] = useState(7.0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newWeight = parseFloat((Math.random() * 10).toFixed(2));
      setCurrentWeight(newWeight);
      const newStatus =
        newWeight >= 5 && newWeight <= 8 ? "acceptable" : "rejected";
      setStatus(newStatus);
      onWeightVerified?.(newStatus, newWeight);
    }, 3000);

    return () => clearInterval(interval);
  }, [onWeightVerified]);

  const statusClass = {
    acceptable: "bg-green-500",
    rejected: "bg-red-500",
    pending: "bg-gray-400",
  }[status];

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-full mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Weight Verification
      </h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard label="Line Number" value={lineNumber} />
        <InfoCard
          label="Product Name"
          value={productName || "No product selected"}
        />
        <InfoCard label="Standard Weight" value={`${standardWeight} kg`} />
      </div>

      <div className="w-full flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <span className="text-lg font-medium text-blue-600">
          Current Weight
        </span>
        <span className="text-4xl font-extrabold text-blue-800">
          {currentWeight.toFixed(2)} kg
        </span>
      </div>

      <div
        className={`w-full flex items-center justify-center p-4 text-white text-xl font-bold rounded-lg shadow-md ${statusClass}`}
      >
        {status === "acceptable" && "Weight Accepted"}
        {status === "rejected" && "Weight Rejected"}
        {status === "pending" && "Verifying..."}
      </div>
    </div>
  );
}

export default WeightVerifyDisplay;
