"use client";
import { useEffect, useRef, useState } from "react";

import { TeaLabel } from "../component/PrintPreview";
import ScrollableSection from "../component/CreatedHeadersCard";
import WeightVerifyDisplay from "../component/WieghtVerifyDisplay";

import { WeightHeader } from "../_services/weightService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddedLineTable from "../component/AddedLineTable";

const Page = () => {
  const [selectedHeader, setSelectedHeader] = useState<WeightHeader | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "" | "acceptable" | "rejected"
  >("");
  const [currentWeight, setCurrentWeight] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("headerData");
    if (storedData) {
      localStorage.removeItem("headerData");
    }
  }, []);

  const handleCardClick = (data: WeightHeader) => {
    setSelectedHeader(data);
  };

  const handleWeightVerified = (
    status: "" | "acceptable" | "rejected",
    weight: number
  ) => {
    setVerificationStatus(status);
    setCurrentWeight(weight);
  };

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className=" flex flex-col gap-4 p-4 shadow-sm w-1/3">
        <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-4">
          <ScrollableSection onCardClick={handleCardClick} />
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        {/* Top Section */}
        <div className="flex-1 flex justify-center items-center border-b border-gray-300">
          <WeightVerifyDisplay
            header={selectedHeader || { name: undefined }}
            onWeightVerified={handleWeightVerified}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex w-full gap-4 items-start px-4">
          {/* Left half - TeaLabel */}
          <div className="flex-1">
            <TeaLabel
              data={{
                id: selectedHeader?.id || 0,
                productName: selectedHeader?.name || "",
                innerCount: "",
                netWeight: currentWeight.toString(),
                grossWeight: selectedHeader?.std_gross_weight || 0,
                masterCartons: "",
                status: verificationStatus || "",
                isFormValid: false,
              }}
            />
          </div>

          {/* Right half - Table */}
          <div className="w-1/2">
            <AddedLineTable id={selectedHeader?.id || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
