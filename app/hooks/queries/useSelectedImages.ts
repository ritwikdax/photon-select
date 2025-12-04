"use client";
import { ImageData } from "@/app/types/image";
import { BASE_API_URL, http } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";

interface SelectedImages {
  imageId: string;
  imageFileName: string;
  note?: string;
}

export const useSelectedImages = () => {
  return useQuery({
    queryKey: ["selectedImages"],
    queryFn: async (): Promise<Array<ImageData>> => {
      const response = await http.get<Array<SelectedImages>>(
        `/public/selectedImages`
      );
      return response.data.map((item) => ({
        id: item.imageId,
        name: item.imageFileName,
        note: item.note || "",
        mimeType: "",
        thumbnailLink: `${BASE_API_URL}/public/thumbnail/${item.imageId}`,
        hdPreviewLink: `${BASE_API_URL}/public/preview/${item.imageId}`,
        originalLink: `https://drive.google.com/uc?export=view&id=${item.imageId}`,
        modifiedTime: "",
        size: "1", //does not matter
      }));
    },
  });
};
