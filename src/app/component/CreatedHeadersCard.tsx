"use client";

import React, { useEffect, useState } from "react";
import { weightService, WeightHeader } from "@/app/_services/weightService";

interface ScrollableSectionProps {
  onCardClick?: (data: WeightHeader) => void;
  currentState?: string;
}

const ScrollableSection: React.FC<ScrollableSectionProps> = ({
  onCardClick,
  currentState,
}) => {
  const [headers, setHeaders] = useState<WeightHeader[]>([]);
  const [filteredHeaders, setFilteredHeaders] = useState<WeightHeader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    setFilteredHeaders(
      headers.filter(
        (header) =>
          header.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          header.remark.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, headers]);

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Error loading headers: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search headers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div
        className="flex-1 rounded-lg p-4 overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-slate-600">Loading headers...</div>
          </div>
        ) : filteredHeaders.length === 0 ? (
          <p className="text-center text-slate-600">No headers found...</p>
        ) : (
          filteredHeaders.map((header) => (
            <button
              key={header.id}
              className="w-full text-left bg-white p-4 rounded-lg mb-4 shadow-sm hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onCardClick?.(header)}
              onKeyDown={(e) => e.key === "Enter" && onCardClick?.(header)}
              aria-label={`Select header: ${header.name}`}
            >
              <h3 className="font-semibold text-slate-800">{header.name}</h3>
              <div className="text-sm text-slate-600">
                <p>Order ID: {header.order_id}</p>
                <p>Date: {new Date(header.datetime).toLocaleDateString()}</p>
                <p>State: {header.state}</p>
                <p>{header.remark}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ScrollableSection;
