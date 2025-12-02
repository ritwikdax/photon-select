"use client";

import { useCallback } from "react";
import { ImageData } from "../types/image";
import { http } from "../utils/http";
import { useToast } from "../components/ToastProvider";

interface UseImageSelectionHandlerOptions {
  folderId: string;
  folderName: string;
  onToggleSelection?: (imageId: string, isSelected: boolean) => boolean | void;
}

export const useImageSelectionHandler = ({
  folderId,
  folderName,
  onToggleSelection,
}: UseImageSelectionHandlerOptions) => {
  const { success, error } = useToast();

  return useCallback(
    async (
      image: ImageData,
      nextSelectedState: boolean,
      previousSelectedState: boolean
    ) => {
      const selectionAllowed = onToggleSelection?.(image.id, nextSelectedState);

      if (selectionAllowed === false) {
        return;
      }

      try {
        if (nextSelectedState) {
          await http.post("/public/selectImage", {
            imageId: image.id,
            imageFileName: image.name,
            folderId,
            folderName,
          });
          success("Image Added", `"${image.name}" added to editing selection`);
        } else {
          await http.delete(`/public/selectImage/${image.id}`);
          success(
            "Image Removed",
            `"${image.name}" removed from editing selection`
          );
        }
      } catch (apiError) {
        console.error("Error updating image selection:", apiError);
        error(
          nextSelectedState ? "Failed to Add Image" : "Failed to Remove Image",
          `Could not ${nextSelectedState ? "add" : "remove"} "${image.name}" ${
            nextSelectedState ? "to" : "from"
          } editing selection`
        );

        if (onToggleSelection) {
          onToggleSelection(image.id, previousSelectedState);
        }
      }
    },
    [folderId, folderName, onToggleSelection, success, error]
  );
};
