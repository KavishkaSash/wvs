"use client";

import React, { useState, useEffect, useCallback } from "react";
import qz from "qz-tray";

// Serial port configuration for common scale types
type Parity = "NONE" | "EVEN" | "ODD" | "MARK" | "SPACE";
type FlowControl = "NONE" | "XONXOFF" | "RTSCTS";
type DataBits = 5 | 6 | 7 | 8;
type StopBits = 1 | 1.5 | 2;

interface SerialPortConfig {
  rx: {
    start: string;
    end: string;
    width: number | undefined;
  };
  baudRate: number;
  dataBits: DataBits;
  stopBits: StopBits;
  parity: Parity;
  flowControl: FlowControl;
}

// Now define the configuration with proper types
const SERIAL_CONFIG: SerialPortConfig = {
  rx: {
    start: "\x02", // STX - Start of Text
    end: "\x0D", // CR - Carriage Return
    width: 8, // Read 8 bytes at a time
  },
  baudRate: 9600,
  dataBits: 8, // Most scales use 7 data bits
  stopBits: 1,
  parity: "EVEN", // Common for Mettler Toledo and similar scales
  flowControl: "NONE",
} as const;
// Initialize QZ Tray connection
async function initializeQZ() {
  if (await qz.websocket.isActive()) {
    return true;
  }

  try {
    await qz.websocket.connect({
      retries: 2,
      delay: 1000,
    });

    // Replace with your actual certificate
    await qz.security.setCertificatePromise((resolve) => {
      resolve(
        "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE_HERE\n-----END CERTIFICATE-----"
      );
    });

    // Simple signature implementation - replace with your actual signing logic
    await qz.security.setSignaturePromise((toSign) => {
      return Promise.resolve("");
    });

    return true;
  } catch (error) {
    console.error("QZ Tray initialization error:", error);
    return false;
  }
}

// Function to read weight from serial port
async function getWeightFromScale(portName: string): Promise<number> {
  try {
    // Close port if already open
    try {
      await qz.serial.closePort(portName);
    } catch {
      // Ignore close errors
    }

    // Open port with configuration
    await qz.serial.openPort(portName, SERIAL_CONFIG);

    // Read weight with timeout
    const weight = await new Promise<number>((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Weight reading timeout"));
      }, 5000);

      const cleanup = () => {
        clearTimeout(timeout);
        qz.serial.setSerialCallbacks([]);
      };

      // Set up data callback
      qz.serial.setSerialCallbacks((response) => {
        if (response.type === "ERROR") {
          cleanup();
          reject(new Error(response.exception));
          return;
        }

        if (response.portName === portName) {
          const weight = parseWeight(response.output);
          if (weight !== null) {
            cleanup();
            resolve(weight);
          }
        }
      });

      // Send command to request weight
      qz.serial.sendData(portName, "W\r\n").catch((err) => {
        cleanup();
        reject(err);
      });
    });

    return weight;
  } finally {
    // Always try to close the port
    try {
      await qz.serial.closePort(portName);
    } catch {
      // Ignore close errors
    }
  }
}

// Parse weight from scale response
function parseWeight(data: string): number | null {
  // Remove non-printable characters and trim
  const cleanData = data.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
  console.log("Cleaned scale data:", cleanData);

  // Common weight patterns
  const patterns = [
    /ST,GS,([0-9.]+)/, // Stable Gross weight
    /ST,NT,([0-9.]+)/, // Stable Net weight
    /US,GS,([0-9.]+)/, // Unstable Gross weight
    /US,NT,([0-9.]+)/, // Unstable Net weight
    /W[ST],([0-9.]+)/, // Weight with stability indicator
    /^([0-9.]+)$/, // Simple number
    /([0-9.]+)kg/, // Weight with kg unit
    /([+-]?[0-9]*\.?[0-9]+)/, // Any decimal number
  ];

  for (const pattern of patterns) {
    const match = cleanData.match(pattern);
    if (match && match[1]) {
      const weight = parseFloat(match[1]);
      if (!isNaN(weight)) {
        return weight;
      }
    }
  }

  return null;
}

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
    name?: string;
    order_line_id?: number;
    std_gross_weight?: number;
  };
  portName?: string;
  onWeightVerified?: (
    status: "" | "acceptable" | "rejected",
    weight: number
  ) => void;
}

// Main component
function WeightVerifyDisplay({
  header,
  portName = "COM1",
  onWeightVerified,
}: Readonly<WeightVerifyDisplayProps>) {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "pending" | "acceptable" | "rejected" | "offline"
  >("pending");
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSuccessfulRead, setLastSuccessfulRead] = useState<Date | null>(
    null
  );
  const [isQzReady, setIsQzReady] = useState(false);

  const MIN_WEIGHT = 5;
  const MAX_WEIGHT = header.std_gross_weight
    ? header.std_gross_weight + 0.5
    : 10;
  const MAX_RETRIES = 3;

  // Initialize QZ Tray
  useEffect(() => {
    const init = async () => {
      const connected = await initializeQZ();
      setIsQzReady(connected);
      if (!connected) {
        setError(
          "Failed to connect to QZ Tray. Please ensure it's installed and running."
        );
        setStatus("offline");
        setIsPolling(false);
      }
    };

    init();

    return () => {
      qz.websocket.disconnect();
    };
  }, []);

  // Weight reading handler
  const handleWeightFetch = useCallback(async () => {
    if (!isQzReady) {
      setError("QZ Tray not connected");
      setStatus("offline");
      return;
    }

    try {
      const weight = await getWeightFromScale(portName);

      setCurrentWeight(weight);
      setLastSuccessfulRead(new Date());
      setRetryCount(0);
      setError(null);

      const newStatus =
        weight >= MIN_WEIGHT && weight <= MAX_WEIGHT
          ? "acceptable"
          : "rejected";

      setStatus(newStatus);
      onWeightVerified?.(newStatus, weight);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Weight reading error:", err);

      if (retryCount >= MAX_RETRIES) {
        setError(`Connection lost: ${errorMessage}`);
        setStatus("offline");
        setIsPolling(false);
        return;
      }

      setRetryCount((prev) => prev + 1);
      setError(`Retry ${retryCount + 1}/${MAX_RETRIES}: ${errorMessage}`);
    }
  }, [
    isQzReady,
    portName,
    retryCount,
    onWeightVerified,
    MIN_WEIGHT,
    MAX_WEIGHT,
  ]);

  // Manual retry handler
  const handleRetry = useCallback(async () => {
    setRetryCount(0);
    setError(null);
    setStatus("pending");

    const connected = await initializeQZ();
    setIsQzReady(connected);

    if (connected) {
      setIsPolling(true);
    } else {
      setError("Failed to reconnect to QZ Tray");
      setStatus("offline");
    }
  }, []);

  // Polling effect
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    if (isPolling && isQzReady) {
      handleWeightFetch();
      pollInterval = setInterval(handleWeightFetch, 1000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isPolling, handleWeightFetch, isQzReady]);

  // Status styling
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
