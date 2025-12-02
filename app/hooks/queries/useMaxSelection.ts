"use client";
import { http } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";

interface MaxSelectionData {
  maxSelectionCount: number;
  isSelectionAllowed: boolean;
}

export const useMaxSelection = () => {
  return useQuery({
    queryKey: ["maxSelection"],
    queryFn: async (): Promise<MaxSelectionData> => {
      const response = await http.get(`/public/maxSelection`);
      return response.data;
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
};
