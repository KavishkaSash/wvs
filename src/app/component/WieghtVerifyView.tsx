import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const WeightDisplay = ({
  standardWeight = 10.0, // Expected weight in kg
  tolerance = 0.05, // 5% tolerance
  onWeightUpdate = (weight: number) => {},
  onStatusChange = (status: boolean) => {},
}) => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [cells, setCells] = useState<boolean[]>(Array(10).fill(null));

  // Load initial weight data from localStorage (if exists)
  useEffect(() => {
    const savedWeight = localStorage.getItem("currentWeight");
    const savedIsAccepted = localStorage.getItem("isAccepted");
    const savedHistory = localStorage.getItem("cells");

    if (savedWeight) setCurrentWeight(parseFloat(savedWeight));
    if (savedIsAccepted) setIsAccepted(savedIsAccepted === "true");
    if (savedHistory) setCells(JSON.parse(savedHistory));
  }, []);

  // Simulate serial port data for demonstration
  // In production, replace with actual serial port connection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate weight reading with some random variation
      const simulatedWeight = standardWeight + (Math.random() - 0.5) * 0.2;
      handleWeightUpdate(simulatedWeight);
    }, 1000);

    return () => clearInterval(interval);
  }, [standardWeight, tolerance]);

  const handleWeightUpdate = (weight: number) => {
    setCurrentWeight(weight);
    onWeightUpdate(weight);

    // Check if weight is within acceptable range
    const lowerBound = standardWeight * (1 - tolerance);
    const upperBound = standardWeight * (1 + tolerance);
    const accepted = weight >= lowerBound && weight <= upperBound;

    setIsAccepted(accepted);
    onStatusChange(accepted);

    // Update cells array
    setCells((prev) => {
      const newCells = [accepted, ...prev.slice(0, 9)]; // Add new entry at start, keeping the length 10
      localStorage.setItem("cells", JSON.stringify(newCells)); // Save history to localStorage
      return newCells;
    });

    // Save current weight and acceptance status to localStorage
    localStorage.setItem("currentWeight", weight.toString());
    localStorage.setItem("isAccepted", accepted.toString());
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Weight Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* History Grid */}

          {/* Settings Display */}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightDisplay;
