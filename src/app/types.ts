// types.ts
export interface Quotation {
  [x: string]: string;
  id: number;
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

