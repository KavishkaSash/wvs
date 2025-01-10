// types.ts
export interface Quotation {
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
