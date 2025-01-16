"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TableData } from "../component/HeaderCreateView";
import { useRouter } from "next/navigation";
import WeightDisplay from "../component/WieghtVerifyView";
import WeightVerification from "../component/WeightVerification";
import { TeaLabel } from "../component/PrintPreview";
import CreatedHeadersCard from "../component/CreatedHeadersCard";

const Page = () => {
  const router = useRouter();
  const [headerData, setHeaderData] = useState<TableData | null>(null);

  useEffect(() => {
    // Retrieve data from localStorage when component mounts
    const storedData = localStorage.getItem("headerData");
    if (storedData) {
      setHeaderData(JSON.parse(storedData));
      // Clear the data from localStorage after retrieving it
      localStorage.removeItem("headerData");
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-1/3 bg-gray-800 text-white flex flex-col gap-4 p-4">
        {/* Section 1 */}
        <div className="flex-1 bg-gray-900 rounded-lg shadow-md p-4">
          <CreatedHeadersCard />
        </div>
        {/* Section 2 */}
        <div className="flex-1 bg-gray-900 rounded-lg shadow-md p-4">
          Section 2
        </div>
        {/* Section 3 */}
        <div className="flex-1 bg-gray-900 rounded-lg shadow-md p-4">
          Section 3
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        {/* Top Section */}
        <div className="flex-1 flex justify-center items-center border-b border-gray-300"></div>

        {/* Bottom Section */}
        <div className="flex-1 flex justify-center items-center">
          <TeaLabel
            data={{
              productName: "",
              innerCount: "",
              netWeight: "",
              grossWeight: "",
              masterCartons: "",
              status: "",
              isFormValid: false,
              onPrint: function (): void {
                throw new Error("Function not implemented.");
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
