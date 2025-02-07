// app/_services/weightService.ts

import {
  WeightHeader,
  WeightHeadersResponse,
  WeightLineResponse,
} from "../types";

export const weightService = {
  async getHeaders(): Promise<WeightHeadersResponse> {
    const response = await fetch(`api/weight/getAllHeaders`);

    if (!response.ok) {
      throw new Error("Failed to fetch weight headers");
    }

    return response.json();
  },
  async getLines(): Promise<WeightLineResponse> {
    const response = await fetch(`api/weight/getAllInvalidLines`);

    if (!response.ok) {
      throw new Error("Failed to fetch weight headers");
    }

    return response.json();
  },
  async getAllLines(): Promise<WeightLineResponse> {
    const response = await fetch(`api/weight/getAllLines`);

    if (!response.ok) {
      throw new Error("Failed to fetch weight headers");
    }

    return response.json();
  },

  async updateLine(payload: {
    id: number;
    remark: string;
    status: string;
    gross_weight_2: number;
  }): Promise<any> {
    try {
      console.log(payload);
      const response = await fetch("api/weight/updateLine", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update line: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Update line error:", error);
      throw error;
    }
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
        id: data[0]?.id ?? 0,
        datetime: data[0]?.datetime ?? "",
        gross_weight: data[0]?.gross_weight ?? 0,
        remark: data[0]?.remark ?? false,
        index_no: data[0]?.index_no ?? 0,
        data,
        status: response.status,
        std_gross_weight: data[0]?.product_std_weight ?? 0,
        message: "Weight lines fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching weight lines:", error);
      throw error;
    }
  },
  // POST request implementation
  async createWeightLine(
    headerId: number,
    weightLineData: {
      gross_weight: number;
      datetime: string;
      status: string;
      remark: boolean;
      line_serial: string;
      allow_print: boolean;
    }
  ): Promise<WeightLineResponse> {
    if (!headerId) {
      throw new Error("Header ID is required");
    }

    try {
      const response = await fetch(`/api/weight/lines?id=${headerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weightLineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating weight line:", error);
      throw error;
    }
  },
  // In weightService.ts, add this function
  async createWeightHeader(headerData: {
    std_gross_weight: number;
    order_line_id: number;
    allow_print: boolean;
  }): Promise<WeightHeader> {
    try {
      const response = await fetch("/api/weight/createHeaders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(headerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating weight header:", error);
      throw error;
    }
  },
  async updateHeaderPrintStatus(headerpayload: {
    order_line_id: number;
    std_gross_weight: number;
    allow_print: boolean;
  }): Promise<WeightHeader> {
    try {
      const response = await fetch(
        `/api/weight/headers/${headerpayload.order_line_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(headerpayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating header print status:", error);
      throw error;
    }
  },
};
