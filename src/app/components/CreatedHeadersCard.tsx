"use client";

import React, { useEffect, useState, useMemo } from "react";
import { weightService } from "@/app/_services/weightService";
import {
  Search,
  Clock,
  Package,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { WeightHeader } from "../types";

interface ScrollableSectionProps {
  onCardClick?: (data: WeightHeader) => void;
  currentState?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ScrollableSection: React.FC<ScrollableSectionProps> = ({
  onCardClick,
  currentState,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [headers, setHeaders] = useState<WeightHeader[]>([]);
  const [filteredHeaders, setFilteredHeaders] = useState<WeightHeader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHeaderId, setSelectedHeaderId] = useState<number | null>(null);
  const [showSearchInCollapsed, setShowSearchInCollapsed] = useState(false);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        setIsLoading(true);
        const response = await weightService.getHeaders();
        setHeaders(response.data);
        setFilteredHeaders(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching weight headers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaders();
  }, []);

  const searchHeaders = useMemo(() => {
    const searchTerms = searchTerm.toLowerCase().split(" ");
    return headers.filter((header) => {
      const searchableText =
        `${header.name} ${header.order_id} ${header.product_id} ${header.job_no} ${header.remark}`.toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [headers, searchTerm]);

  useEffect(() => {
    setFilteredHeaders(searchHeaders);
  }, [searchHeaders]);

  const handleHeaderClick = (header: WeightHeader) => {
    setSelectedHeaderId(header.id);
    onCardClick?.(header);
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchInCollapsed(false);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Error loading headers: {error}
      </div>
    );
  }

  const renderSearchInput = () => (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search orders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm"
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-2 top-2 p-1 hover:bg-slate-100 rounded-full"
        >
          <X className="h-4 w-4 text-slate-400" />
        </button>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <h2 className={`font-bold text-lg ${isCollapsed ? "hidden" : "block"}`}>
          Order List
        </h2>
        <div className="flex items-center gap-2">
          {isCollapsed && (
            <button
              onClick={() => setShowSearchInCollapsed(!showSearchInCollapsed)}
              className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {(!isCollapsed || showSearchInCollapsed) && (
        <div className="p-3">{renderSearchInput()}</div>
      )}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-600 animate-pulse">Loading orders...</div>
        </div>
      );
    }

    if (filteredHeaders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-slate-500">
          <FileText className="h-8 w-8 mb-2" />
          <p className="text-center">
            {searchTerm ? "No matching orders found" : "No orders available"}
          </p>
        </div>
      );
    }

    return (
      <div className="p-2 border">
        {filteredHeaders.map((header) => (
          <button
            key={header.id}
            className={`w-full ${
              isCollapsed ? "p-2" : "p-3 text-left"
            } rounded-lg mb-2 transition-all duration-200 hover:bg-blue-50 hover:shadow-md 
          ${
            selectedHeaderId === header.id
              ? "bg-blue-50 shadow-md border-blue-400 border"
              : "bg-white border border-slate-100"
          }`}
            onClick={() => handleHeaderClick(header)}
            onKeyDown={(e) => e.key === "Enter" && handleHeaderClick(header)}
            aria-label={`Select order: ${header.order_id}`}
          >
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-1">
                <Package className="h-4 w-4 text-blue-600" />
                <div className="text-xs text-slate-700 font-bold truncate w-full text-center">
                  {header.job_no}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-1">
                  <div className="font-bold text-slate-800">
                    {header.order_id}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(header.datetime)}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center text-slate-700">
                    <Package className="h-3 w-3 mr-1 text-blue-600" />
                    {header.product_id || "No product"}
                  </div>
                  {header.job_no && (
                    <div className="text-slate-600 text-xs">
                      {header.job_no}
                    </div>
                  )}
                  {header.pre_shipment && (
                    <div className="text-slate-500 text-xs italic">
                      {header.pre_shipment}
                    </div>
                  )}
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all duration-300 ${
        isCollapsed ? "w-24" : "w-full"
      }`}
    >
      {renderHeader()}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default ScrollableSection;
