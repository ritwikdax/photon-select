"use client";
import { http } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ToastProvider";

export const useUnselectImage = () => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string): Promise<void> => {
      await http.delete(`/public/selectImage/${imageId}`);
    },
    onMutate: async (imageId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["selectedImagesSet"] });
      await queryClient.cancelQueries({ queryKey: ["selectedImages"] });

      // Snapshot previous value
      const previousImagesSet = queryClient.getQueryData<Set<string>>([
        "selectedImagesSet",
      ]);

      // Optimistically update
      queryClient.setQueryData<Set<string>>(["selectedImagesSet"], (old) => {
        const newSet = new Set(old);
        newSet.delete(imageId);
        return newSet;
      });

      return { previousImagesSet };
    },
    onError: (_err, _imageId, context) => {
      // Rollback on error
      if (context?.previousImagesSet) {
        queryClient.setQueryData(
          ["selectedImagesSet"],
          context.previousImagesSet
        );
      }
      error("Failed to unselect image");
    },
    onSuccess: () => {
      success("Image Unselected successfully");
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["selectedImagesSet"] });
      queryClient.invalidateQueries({ queryKey: ["selectedImages"] });
    },
  });
};
