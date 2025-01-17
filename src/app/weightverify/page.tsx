"use client";
import { useEffect, useState } from "react";

import { TeaLabel } from "../component/PrintPreview";
import ScrollableSection from "../component/CreatedHeadersCard";
import WeightVerifyDisplay from "../component/WieghtVerifyDisplay";
import AddedLineTable from "../component/AddedLineTable";
import { WeightHeader } from "../_services/weightService";

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
            productName={selectedHeader?.name}
            onWeightVerified={handleWeightVerified}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex w-full gap-4 items-start px-4">
          {/* Left half - TeaLabel */}
          <div className="flex-1">
            <TeaLabel
              data={{
                productName: selectedHeader?.name || "",
                innerCount: "",
                netWeight: currentWeight.toString(),
                grossWeight: "",
                masterCartons: "",
                status: verificationStatus,
                isFormValid: false,
                onPrint: function (): void {
                  throw new Error("Function not implemented.");
                },
              }}
            />
          </div>

          {/* Right half - Table */}
          <div className="flex-1">
            <div className="bg-white shadow">
              <AddedLineTable id={selectedHeader?.id ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
