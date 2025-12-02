"use client";
import { http } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";

interface Logos {
  logo: string;
  logoDark: string;
}

export const useLogo = () => {
  return useQuery({
    queryKey: ["logo"],
    queryFn: async () => {
      const response = await http.get<Logos>(`/public/merchantLogo`);
      return response.data;
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
};
