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


export type Header={
  
}