"use client";
import { useSelectedImagesSet } from "./queries/useSelectedImagesSet";
import { useMaxSelection } from "./queries/useMaxSelection";

export const useIsCountExceeded = () => {
  const { data: selectedImagesSet } = useSelectedImagesSet();
  const { data: maxSelectionData } = useMaxSelection();

  return Boolean(
    selectedImagesSet?.size &&
      selectedImagesSet.size > (maxSelectionData?.maxSelectionCount || 0)
  );
};
