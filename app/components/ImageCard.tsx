import { memo, useCallback } from "react";
import LazyImage from "./LazyImage";
import { ImageData } from "../types/image";
import { useIsImageSelected } from "../hooks/useIsImageSelected";
import { CheckIcon, HeartIcon } from "./icons";
import { useFolderContext } from "../context/FolderContext";
import { useSelectImage } from "../hooks/mutations/useSelectImage";
import { useUnselectImage } from "../hooks/mutations/useUnselectImage";
import { useMaxSelection } from "../hooks/queries/useMaxSelection";

interface ImageCardProps {
  image: ImageData;
  index: number;
  onClick?: (image: ImageData, index: number) => void;
}

export const ImageCard = memo(({ image, index, onClick }: ImageCardProps) => {
  const folder = useFolderContext();
  const isSelected = useIsImageSelected(image.id);
  const selectImageMutation = useSelectImage();
  const unselectImageMutation = useUnselectImage();
  const { data: maxSelectionData } = useMaxSelection();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Only trigger image click if the click didn't come from the toggle button
      if ((e.target as Element).closest("button")) {
        return;
      }
      onClick?.(image, index);
    },
    [image, index, onClick]
  );

  const handleToggleSelection = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      if (isSelected) {
        unselectImageMutation.mutate(image.id);
      } else {
        selectImageMutation.mutate({
          imageId: image.id,
          imageFileName: image.name,
          folderId: folder.selectedFolder ? folder.selectedFolder.folderId : "",
          folderName: folder.selectedFolder ? folder.selectedFolder.name : "",
        });
      }
    },
    [image, isSelected, folder, selectImageMutation, unselectImageMutation]
  );

  return (
    <div
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      onClick={handleClick}>
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <LazyImage
          src={image.thumbnailLink}
          alt={image.name}
          className="w-full h-full group-hover:brightness-110 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        {/* Selection Toggle Button */}
        {maxSelectionData?.isSelectionAllowed && (
          <button
            type="button"
            onClick={handleToggleSelection}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10 ${
              isSelected
                ? "bg-white/90 shadow-lg scale-110"
                : "bg-black/30 hover:bg-black/50 hover:scale-105"
            }`}
            aria-label={
              isSelected
                ? "Remove from editing selection"
                : "Add to editing selection"
            }>
            <HeartIcon
              filled={isSelected}
              className={`w-6 h-6 transition-all duration-300 ${
                isSelected
                  ? "text-red-500 scale-110"
                  : "text-white drop-shadow-lg hover:text-red-300"
              }`}
            />
          </button>
        )}

        {/* Selection indicator overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 border-4 border-blue-500 rounded-t-lg transition-all duration-300" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate mb-2">
          {image.name}
        </h3>

        {/* Selection status indicator */}
        {isSelected && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
            <CheckIcon className="w-4 h-4" />
            <span>Selected for editing</span>
          </div>
        )}
      </div>
    </div>
  );
});

ImageCard.displayName = "ImageCard";
