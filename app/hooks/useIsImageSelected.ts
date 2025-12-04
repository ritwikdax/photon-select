import { useSelectedImagesSet } from "./queries/useSelectedImagesSet";

export const useIsImageSelected = (imageId: string): boolean => {
  const { data: selectedImages } = useSelectedImagesSet();
  return selectedImages ? selectedImages.has(imageId) : false;
};
