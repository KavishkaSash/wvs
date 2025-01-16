"use client";
import React, { useEffect, useState } from "react";

type HeaderData = {
  id: number;
  title: string;
  description: string;
};

// Mock Data Function (Replace with API call later)
const fetchMockData = async () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Header ${i + 1}`,
    description: `Description for header ${i + 1}`,
  }));
};

const ScrollableSection = ({
  onCardClick,
}: {
  onCardClick?: (data: HeaderData) => void;
}) => {
  const [headers, setHeaders] = useState<HeaderData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHeaders, setFilteredHeaders] = useState<HeaderData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMockData();
      setHeaders(data);
      setFilteredHeaders(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredHeaders(
      headers.filter(
        (header) =>
          header.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          header.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, headers]);

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
        className="flex-1  rounded-lg  p-4 overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        {filteredHeaders.length === 0 ? (
          <p className="text-center text-slate-600">No headers found...</p>
        ) : (
          filteredHeaders.map((header) => (
            <button
              key={header.id}
              className="w-full text-left bg-white p-4 rounded-lg mb-4 shadow-sm hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onCardClick?.(header)}
              onKeyDown={(e) => e.key === "Enter" && onCardClick?.(header)}
              aria-label={`Select header: ${header.title}`}
            >
              <h3 className="font-semibold text-slate-800">{header.title}</h3>
              <p className="text-sm text-slate-600">{header.description}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ScrollableSection;
