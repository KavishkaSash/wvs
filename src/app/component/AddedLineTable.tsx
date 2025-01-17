"use client";

import React, { useEffect, useState } from "react";
import { weightService } from "@/app/_services/weightService";

interface WeightLinesTableProps {
  id: number;
}

interface WeightLine {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  status: string;
}

const WeightLinesTable: React.FC<WeightLinesTableProps> = ({ id }) => {
  const [data, setData] = useState<WeightLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeightLines = async () => {
      if (!id) {
        setError("Please select a header");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await weightService.getLinesById(id);

        // Ensure response is an array
        const weightLines = response.data[0] ? response.data : [];
        setData(weightLines);
        console.log(weightLines); // Logs the correctly extracted array
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching weight lines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightLines();
  }, [id]);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Header ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Index No
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Gross Weight
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Remarks
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((line) => (
              <tr key={line.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {line.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {line.header_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {line.index_no}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {line.gross_weight.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      line.status === "valid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {line.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(line.datetime).toLocaleString("en-GB")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {line.remark ? (
                    <span className="text-green-600">✔</span>
                  ) : (
                    <span className="text-red-600">✘</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeightLinesTable;
