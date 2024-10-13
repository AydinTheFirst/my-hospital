import { API_URL } from "@/config";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFileUrl = (file: string) => {
  return `${API_URL}/files/${file}`;
};

export const getDefaultDateValue = (date: Date | null | string | undefined) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export const localeDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
};
