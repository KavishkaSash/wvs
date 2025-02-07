"use client";

import { useEffect, useState } from "react";
import { TeaLabel } from "../components/PrintPreview";
import WeightVerifyDisplay from "../components/WieghtVerifyDisplay";

import AddedLineTable from "../components/AddedLineTable";
import ScrollableSection from "../components/CreatedHeadersCard";
import { WeightHeader } from "../types";

const Page = () => {
  const [selectedHeader, setSelectedHeader] = useState<WeightHeader | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "" | "valid" | "invalid"
  >("");
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    status: "" | "valid" | "invalid",
    weight: number
  ) => {
    setVerificationStatus(status);
    setCurrentWeight(weight);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Order List */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "w-24" : "w-72"
        }`}
      >
        <ScrollableSection
          onCardClick={handleCardClick}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Weight Verification and Tea Label */}
        <div className="flex p-4 gap-4 bg-gray-50 border-b border-gray-200">
          {/* Weight Verification Display */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
            <WeightVerifyDisplay
              header={{
                product_id: selectedHeader?.product_id || "",
                name: selectedHeader?.name,
                order_line_id: selectedHeader?.order_line_id || 0,
                std_gross_weight: selectedHeader?.std_gross_weight || 0,
                job_no: selectedHeader?.job_no || 0,
              }}
              onWeightVerified={handleWeightVerified}
            />
          </div>

          {/* Tea Label */}
          <div className="w-96 bg-white rounded-lg shadow-sm p-4">
            <TeaLabel
              data={{
                id: selectedHeader?.id || 0,
                contract_no: selectedHeader?.order_id || "",
                productName: selectedHeader?.product_id || "",
                innerCount: selectedHeader?.nos_inners || 0,
                netWeight: currentWeight || 1,
                grossWeight: selectedHeader?.std_gross_weight || 0,
                masterCartons: selectedHeader?.nos_master_cartons || 0,
                status: verificationStatus || "invalid",
                line_serial: "",
                isFormValid: false,
                net_qty: selectedHeader?.net_qty || 0,
                order_line_number: selectedHeader?.order_line_number || 0,
                index_no: selectedHeader?.index_no || 0,
                allow_print: selectedHeader?.allow_print || false,
              }}
            />
          </div>
        </div>

        {/* Bottom Section - Added Line Table */}
        <div className="flex-1 p-4 bg-gray-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm h-full">
            <div className="p-4">
              <AddedLineTable id={selectedHeader?.id ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
