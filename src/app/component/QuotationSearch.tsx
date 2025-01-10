"use client";
import { useState } from "react";

const QuotationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [quotations, setQuotations] = useState([
    {
      id: 1,
      orderNumber: "SO-001",
      productName: "Premium Tea",
      jobNumber: "JOB001",
      finishGoodNumber: "FG001",
      mastersCount: 10,
      innersCount: 5,
      weightPerMaster: 2.5,
      isSelected: false,
    },
    {
      id: 2,
      orderNumber: "SO-002",
      productName: "Green Tea",
      jobNumber: "JOB002",
      finishGoodNumber: "FG002",
      mastersCount: 15,
      innersCount: 6,
      weightPerMaster: 3.0,
      isSelected: false,
    },
  ]);

  const filteredQuotations = quotations.filter((quote) =>
    quote.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Quotation Search</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by order number..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quotations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border">Order Number</th>
              <th className="px-6 py-3 border">Product Name</th>
              <th className="px-6 py-3 border">Job Number</th>
              <th className="px-6 py-3 border">FG Number</th>
              <th className="px-6 py-3 border">Masters Count</th>
              <th className="px-6 py-3 border">Inners Count</th>
              <th className="px-6 py-3 border">Weight/Master</th>
              <th className="px-6 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.map((quote) => (
              <tr key={quote.id}>
                <td className="px-6 py-4 border">{quote.orderNumber}</td>
                <td className="px-6 py-4 border">{quote.productName}</td>
                <td className="px-6 py-4 border">{quote.jobNumber}</td>
                <td className="px-6 py-4 border">{quote.finishGoodNumber}</td>
                <td className="px-6 py-4 border">{quote.mastersCount}</td>
                <td className="px-6 py-4 border">{quote.innersCount}</td>
                <td className="px-6 py-4 border">{quote.weightPerMaster}</td>

                <td className="px-6 py-4 border">
                  <button
                    onClick={() => (window.location.href = "/weight")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                    Weight
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationSearch;
