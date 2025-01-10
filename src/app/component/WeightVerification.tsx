"use client";
import { useState } from "react";

const WeightVerification = () => {
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState("");
  const standardWeight = 2.5; // Example standard weight

  const verifyWeight = () => {
    const currentWeight = parseFloat(weight);
    if (currentWeight >= standardWeight - 0.02) {
      // 20g tolerance
      setStatus("acceptable");
    } else {
      setStatus("rejected");
    }
  };

  const printSticker = () => {
    if (status === "rejected") {
      const confirm = window.confirm(
        "Weight is not acceptable. Are you sure you want to print the sticker?"
      );
      if (!confirm) return;
    }

    // Simulate printing
    console.log("Printing sticker with details:", {
      weight,
      status,
      timestamp: new Date().toISOString(),
      verificationSymbol: status === "acceptable" ? "✓" : "✗",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Weight Verification</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Current Weight (kg)
          </label>
          <input
            type="number"
            step="0.001"
            className="w-full p-2 border rounded"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Standard Weight
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-50"
            value={`${standardWeight} kg`}
            disabled
          />
        </div>

        <button
          onClick={verifyWeight}
          className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Verify Weight
        </button>

        {status && (
          <div className="mb-4">
            <div
              className={`p-3 rounded ${
                status === "acceptable"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Status:{" "}
              {status === "acceptable"
                ? "Weight is OK"
                : "Weight is Not Acceptable"}
            </div>

            <button
              onClick={printSticker}
              className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Print Sticker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightVerification;
