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
  product: string;
  job_no: number;
  fg_no: number;
  contract_no: number;
  inner: number;
  master: number;
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
