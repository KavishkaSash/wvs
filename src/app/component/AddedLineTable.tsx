import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { weightService } from "@/app/_services/weightService";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeightLinesTableProps {
  id: number;
}

interface WeightDetails {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  status: string;
}

const ROWS_PER_PAGE = 4;

const AddedLineTable = forwardRef<
  { refreshData: () => void },
  WeightLinesTableProps
>(({ id }, ref) => {
  const [data, setData] = useState<WeightDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWeightLines = async () => {
    if (!id) {
      setError("Please select a valid header ID.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await weightService.getLinesById(id);

      if (response?.data && Array.isArray(response.data)) {
        const sortedData = [...response.data].sort(
          (a: WeightDetails, b: WeightDetails): number =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        setData(sortedData);
        setError(null);
      } else {
        setError("Invalid data format received");
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching weight lines:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Expose refresh method to parent
  useImperativeHandle(ref, () => ({
    refreshData: fetchWeightLines,
  }));

  useEffect(() => {
    fetchWeightLines();
  }, [id]);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weight History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchWeightLines}
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 mt-0">
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-gray-600">Loading...</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gross Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remark
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((line) => (
                        <tr key={line.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(line.datetime).toLocaleString()}
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

              {data.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

AddedLineTable.displayName = "AddedLineTable";

export default AddedLineTable;
