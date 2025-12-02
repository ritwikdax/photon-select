"use client";
import { http } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";

interface SelectedImages {
  imageId: string;
}

export const useSelectedImages = () => {
  return useQuery({
    queryKey: ["selectedImages"],
    queryFn: async (): Promise<Set<string>> => {
      const response = await http.get<Array<SelectedImages>>(
        `/public/selectedImages`
      );
      return new Set(response.data.map((item) => item.imageId));
    },
  });
};
