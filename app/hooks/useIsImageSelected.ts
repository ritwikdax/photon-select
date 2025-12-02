import { useSelectedImages } from "./queries/useSelectedImages";

export const useIsImageSelected = (imageId: string): boolean => {
  const { data: selectedImages } = useSelectedImages();
  return selectedImages ? selectedImages.has(imageId) : false;
};
