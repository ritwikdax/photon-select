"use client";
import { useSelectedImages } from "./queries/useSelectedImages";
import { useMaxSelection } from "./queries/useMaxSelection";

export const useIsCountExceeded = () => {
  const { data: selectedImagesSet } = useSelectedImages();
  const { data: maxSelectionData } = useMaxSelection();

  return Boolean(
    selectedImagesSet?.size &&
      selectedImagesSet.size > (maxSelectionData?.maxSelectionCount || 0)
  );
};
