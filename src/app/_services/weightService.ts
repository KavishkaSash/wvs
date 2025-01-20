// app/_services/weightService.ts
export interface WeightHeader {
  id: number;
  name: string;
  order_line_id: number;
  order_id: number;
  datetime: string;
  product_id: number;
  std_gross_weight: number;
  total_gross_weight: number;
  line_count: number;
  state: "draft" | "confirmed" | "cancelled";
  remark: string;
}
export interface WeightLine {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  status: string;
}

export interface WeightLineResponse {
  data: WeightLine[];
  status?: number;
  message?: string;
}
export interface WeightHeadersResponse {
  data: WeightHeader[];
  status?: number;
  message?: string;
}

export const weightService = {
  async getHeaders(): Promise<WeightHeadersResponse> {
    const response = await fetch(`api/weight/getAllHeaders`);

    if (!response.ok) {
      throw new Error("Failed to fetch weight headers");
    }

    return response.json();
  },
  async getLinesById(id: number): Promise<WeightLineResponse> {
    try {
      const response = await fetch(`/api/weight/getHeaderLinesByID?id=${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      const data = res.data;
      return {
        data,
        status: response.status,
        message: "Weight lines fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching weight lines:", error);
      throw error;
    }
  },
};
