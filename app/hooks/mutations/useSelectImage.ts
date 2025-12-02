"use client";
import { http } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ToastProvider";

interface SelectImageParams {
  imageId: string;
  imageFileName: string;
  folderId: string;
  folderName: string;
}

export const useSelectImage = () => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SelectImageParams): Promise<void> => {
      await http.post("/public/selectImage", {
        imageId: params.imageId,
        imageFileName: params.imageFileName,
        folderId: params.folderId,
        folderName: params.folderName,
      });
    },
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["selectedImages"] });

      // Snapshot previous value
      const previousImages = queryClient.getQueryData<Set<string>>([
        "selectedImages",
      ]);

      // Optimistically update
      queryClient.setQueryData<Set<string>>(["selectedImages"], (old) => {
        const newSet = new Set(old);
        newSet.add(params.imageId);
        return newSet;
      });

      return { previousImages };
    },
    onError: (_err, _params, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(["selectedImages"], context.previousImages);
      }
      error("Failed to select image");
    },
    onSuccess: () => {
      success("Image selected successfully");
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["selectedImages"] });
    },
  });
};
