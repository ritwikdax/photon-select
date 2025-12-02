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
      await queryClient.cancelQueries({ queryKey: ["selectedImages"] });

      // Snapshot previous value
      const previousImages = queryClient.getQueryData<Set<string>>([
        "selectedImages",
      ]);

      // Optimistically update
      queryClient.setQueryData<Set<string>>(["selectedImages"], (old) => {
        const newSet = new Set(old);
        newSet.delete(imageId);
        return newSet;
      });

      return { previousImages };
    },
    onError: (_err, _imageId, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(["selectedImages"], context.previousImages);
      }
      error("Failed to unselect image");
    },
    onSuccess: () => {
      success("Image Unselected successfully");
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["selectedImages"] });
    },
  });
};
