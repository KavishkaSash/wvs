import axios, { AxiosRequestConfig } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ApiclientConfig = {
  url: string;
  data?: object;
  method: string;
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text";
};

// For external api calls
export const apiClient = (configs: ApiclientConfig) => {
  const token = process.env.NEXT_PUBLIC_API_KEY;
  const mainConfigs: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axios({ ...configs, ...mainConfigs });
};
