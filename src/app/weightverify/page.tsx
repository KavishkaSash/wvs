"use client";
import { useEffect, useState } from "react";

import { TeaLabel } from "../component/PrintPreview";
import ScrollableSection from "../component/CreatedHeadersCard";
import WeightVerifyDisplay from "../component/WieghtVerifyDisplay";

type HeaderData = {
  id: number;
  title: string;
  description: string;
};

const Page = () => {
  const [selectedHeader, setSelectedHeader] = useState<HeaderData | null>(null);
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

  const handleCardClick = (data: HeaderData) => {
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
      <div className="bg-gray-50 border-r border-gray-200 flex flex-col gap-4 p-4 shadow-sm w-1/3">
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <ScrollableSection onCardClick={handleCardClick} />
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        {/* Top Section */}
        <div className="flex-1 flex justify-center items-center border-b border-gray-300">
          <WeightVerifyDisplay
            productName={selectedHeader?.title}
            onWeightVerified={handleWeightVerified}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex-1 flex">
          {/* Left half - TeaLabel */}
          <div className="w-1/2 flex justify-center items-center border-r border-gray-200">
            <TeaLabel
              data={{
                productName: selectedHeader?.title || "",
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
          <div className="w-1/2 p-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add your table rows here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
