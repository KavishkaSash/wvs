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
  standard_weight:number;
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
