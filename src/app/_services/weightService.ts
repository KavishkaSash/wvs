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

export interface WeightHeadersResponse {
  data: WeightHeader[];
}

export const weightService = {
  async getHeaders(): Promise<WeightHeadersResponse> {
    const response = await fetch(`api/weight/getAllHeaders`);

    if (!response.ok) {
      throw new Error("Failed to fetch weight headers");
    }

    return response.json();
  },
};
