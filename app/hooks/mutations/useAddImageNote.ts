"use client";
import { http } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ToastProvider";

interface AddImageNoteParams {
  imageId: string;
  note: string;
}

export const useAddImageNote = () => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: AddImageNoteParams): Promise<void> => {
      await http.put(`/public/addNote/${params.imageId}`, {
        note: params.note,
      });
    },
    onError: (_err, _params, context) => {
      error("Failed to add note to image");
    },
    onSuccess: () => {
      success("Note added to image successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["selectedImages"] });
      //queryClient.invalidateQueries({ queryKey: ["selectedImagesSet"] });
    },
  });
};
