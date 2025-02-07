// app/_services/salesOrderService.ts

export interface SaleOrder {
  id: number;
  state: "sale" | "draft" | "cancel";
  name: string;
  partner_id: number;
  date_order: string;
  amount_total: number;
  currency_id: number;
}

export interface SaleOrderLine {
  id: number;
  sale_order_id: number;
  product_id: number;
  product_uom_qty: number;
  price_unit: number;
  price_subtotal: number;
  state: string;
  std_gross_weight: number;
}

export interface ManufacturingOrder {
  id: number;
  sale_line_id: number;
  product_id: number;
  product_qty: number;
  state: "draft" | "confirmed" | "in_progress" | "done" | "cancelled";
  date_planned_start: string;
  date_planned_finished: string;
}

export interface SaleOrderResponse {
  data: SaleOrder[];
  status?: number;
  message?: string;
}

export interface SaleOrderLinesResponse {
  data: SaleOrderLine[];
  status?: number;
  message?: string;
}

export interface ManufacturingOrdersResponse {
  data: ManufacturingOrder[];
  status?: number;
  message?: string;
}

export const salesOrderService = {
  async getSaleOrders(): Promise<SaleOrderResponse> {
    try {
      const response = await fetch(`/api/preShipment/getAllShipments`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data: data.data,
        status: response.status,
        message: "Sale orders fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching sale orders:", error);
      throw error;
    }
  },

  async getSaleOrderLines(
    saleOrderId: number
  ): Promise<SaleOrderLinesResponse> {
    try {
      // Add input validation
      if (!saleOrderId || saleOrderId <= 0) {
        throw new Error("Invalid sale order ID");
      }

      const response = await fetch(
        `/api/preShipment/getLineDetailsByID?id=${saleOrderId}`
      );

      if (!response.ok) {
        // More detailed error logging

        throw new Error(`HTTP error! status: ${response.status}, `);
      }

      const data = await response.json();
      return {
        data: data.data,
        status: response.status,
        message: "Sale order lines fetched successfully",
      };
    } catch (error) {
      console.error("Detailed error fetching sale order lines:", error);
      throw error;
    }
  },

  async getManufacturingOrders(
    saleLineId: number
  ): Promise<ManufacturingOrdersResponse> {
    try {
      const response = await fetch(
        `/api/manufacturing-orders?sale_line_id=${saleLineId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data: data.data,
        status: response.status,
        message: "Manufacturing orders fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching manufacturing orders:", error);
      throw error;
    }
  },
};
