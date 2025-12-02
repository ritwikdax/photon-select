"use client";
import { FoldersResponse } from "@/app/types/image";
import { http } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";

export const useFolders = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await http.get<FoldersResponse>(`/public/folders`);
      return response.data;
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
};
