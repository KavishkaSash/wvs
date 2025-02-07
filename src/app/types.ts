// types.ts
export interface Quotation {
  [x: string]: string;
  title: string;
  body: string;
  category: string;
  author: string;
  date: string;
}

export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Header = {
  customer: string;
  line_no: string;
  product_name: string;
  job_no: number;
  fg_no: number;
  order_name: number;
  nos_inners: number;
  nos_master_cartons: number;
  master_weight: number;

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
};

export type HeaderTable = {
  line_no: string;
  product: string;
  job_no: number;
  fg_no: number;
  contract_no: number;
  inner: number;
  master: number;
  master_weight: number;
};
export type Status = "acceptable" | "rejected" | "";
export type WeightLineStatus = "valid" | "invalid" | "" | "draft";



export interface TeaLabelData {
  id: number;
  productName: string;
  innerCount: number;
  netWeight: string;
  grossWeight: number;
  masterCartons: number;
  status: Status;
  isFormValid: boolean;
  contract_no: string;
}

export interface WeightDetails {
  id: number;
  datetime: string;
  gross_weight: number;
  header_id: number;
  index_no: number;
  remark: boolean;
  status: string;
}

export interface WeightHeader {
  job_no: number;
  id: number;
  name: string;
  order_line_id: number;
  order_id: string;
  datetime: string;
  product_id: string;
  std_gross_weight: number;
  total_gross_weight: number;
  line_count: number;
  state: "draft" | "confirmed" | "cancelled";
  remark: string;
  nos_master_cartons: number;
  nos_inners: number;
  net_qty: number;
  order_line_number: number;
  index_no: number;
  pre_shipment: string;
  allow_print: boolean;
}
export interface WeightLine {
  id: number;
  header_id: number;
  index_no: number;
  datetime: string;
  gross_weight: number;
  line_serial: string;
  remark: [];
  status: "draft" | "invalid" | "completed" | string;
  product_name: string;
  product_std_weight: number;
  nos_master_cartons: number;
  nos_inners: number;
  order_id: string;
  net_qty: number | undefined;
  order_line_number: number;
  customer: string;
  allow_print: boolean;
}

export interface WeightLineResponse {
  id: number;
  datetime: string;
  gross_weight: number;
  remark: [];
  data: WeightLine[];
  status?: number;
  message?: string;
  line_serial?: string;
  product_name?: string;
  product_std_weight?: number;
  order_line_number?: number;
  index_no?: number;
  net_qty?: number;
  allow_print?: boolean;
  std_gross_weight?: number;
}
export interface WeightHeadersResponse {
  data: WeightHeader[];
  status?: number;
  message?: string;
}
