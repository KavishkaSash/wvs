"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const QuotationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [quotations, setQuotations] = useState<any[]>([]); // Update to store fetched posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from JSONPlaceholder API (example API)
  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      setQuotations(response.data); // Set the fetched data into quotations
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch quotations");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []); // Fetch data once when component mounts

  // Filter quotations based on search query
  const filteredQuotations = quotations.filter((quote) =>
    quote.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Placeholder row completeness check for your original logic
  const isRowComplete = (quote: any) => quote.title && quote.body; // Checking title and body for completeness

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quotation Search</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Quotations Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border">Title</th>
                <th className="px-6 py-3 border">Body</th>
                <th className="px-6 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuotations.map((quote) => (
                <tr
                  key={quote.id}
                  className={isRowComplete(quote) ? "" : "bg-red-100"}
                >
                  <td className="px-6 py-4 border">{quote.title || "N/A"}</td>
                  <td className="px-6 py-4 border">{quote.body || "N/A"}</td>
                  <td className="px-6 py-4 border">
                    {isRowComplete(quote) && (
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:bg-gray-200"
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === page + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuotationSearch;
