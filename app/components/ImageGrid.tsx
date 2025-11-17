"use client";

import { memo, useCallback } from "react";
import { ImageData } from "../types/image";
import LazyImage from "./LazyImage";
import { http } from "../utils/http";
import { useToast } from "./ToastProvider";
import { HeartIcon, CheckIcon } from "./icons";

interface ImageGridProps {
  images: ImageData[];
  folderId: string;
  folderName: string;
  onImageClick: (image: ImageData, index: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  selectedImages?: Set<string>;
  onToggleSelection?: (imageId: string, isSelected: boolean) => boolean;
}

// Memoized individual image card component
const ImageCard = memo(
  ({
    image,
    folderId,
    folderName,
    index,
    onImageClick,
    isSelected = false,
    onToggleSelection,
  }: {
    image: ImageData;
    folderId: string;
    folderName: string;
    index: number;
    onImageClick: (image: ImageData, index: number) => void;
    isSelected?: boolean;
    onToggleSelection?: (imageId: string, isSelected: boolean) => boolean;
  }) => {
    const { success, error } = useToast();

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        // Only trigger image click if the click didn't come from the toggle button
        if ((e.target as Element).closest("button")) {
          return;
        }
        onImageClick(image, index);
      },
      [image, index, onImageClick]
    );

    const handleToggleSelection = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        const newSelectedState = !isSelected;

        // Check if the selection is allowed first
        const selectionResult = onToggleSelection?.(image.id, newSelectedState);
        
        // If selection was not allowed (returned false), don't proceed with API call
        if (selectionResult === false) {
          return;
        }

        try {
          if (newSelectedState) {
            // POST request when image is selected
            await http.post("/public/selectImage", {
              imageId: image.id,
              imageFileName: image.name,
              folderId,
              folderName,
            });
            success(
              "Image Added",
              `"${image.name}" added to editing selection`
            );
          } else {
            // DELETE request when image is deselected
            await http.delete(`/public/selectImage/${image.id}`);
            success(
              "Image Removed",
              `"${image.name}" removed from editing selection`
            );
          }
        } catch (apiError) {
          console.error("Error updating image selection:", apiError);

          // Show error toast
          error(
            newSelectedState ? "Failed to Add Image" : "Failed to Remove Image",
            `Could not ${newSelectedState ? "add" : "remove"} "${image.name}" ${
              newSelectedState ? "to" : "from"
            } editing selection`
          );

          // Revert the selection state if the API call fails
          onToggleSelection?.(image.id, isSelected);
        }
      },
      [image.id, image.name, isSelected, onToggleSelection, success, error, folderId, folderName]
    );

    return (
      <div
        className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={handleClick}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <LazyImage
            src={image.thumbnailLink}
            alt={image.name}
            className="w-full h-full group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

          {/* Selection Toggle Button */}
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
            }
          >
            <HeartIcon 
              filled={isSelected} 
              className={`w-6 h-6 transition-all duration-300 ${
                isSelected
                  ? "text-red-500 scale-110"
                  : "text-white drop-shadow-lg hover:text-red-300"
              }`}
            />
          </button>

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

          {/* <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p className="flex justify-between">
            <span>Size:</span>
            <span className="font-medium">{formatFileSize(image.size)}</span>
          </p>
          <p className="flex justify-between">
            <span>Modified:</span>
            <span className="font-medium">{formatDate(image.modifiedTime)}</span>
          </p>
        </div> */}
        </div>
      </div>
    );
  }
);

ImageCard.displayName = "ImageCard";

const ImageGrid = memo(
  ({
    images,
    folderId,
    folderName,
    onImageClick,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    selectedImages = new Set(),
    onToggleSelection,
  }: ImageGridProps) => {
    return (
      <div className="p-6">
        {/* Selection summary */}
        {selectedImages.size > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <CheckIcon className="w-5 h-5" />
                <span className="font-medium">
                  {selectedImages.size} image
                  {selectedImages.size !== 1 ? "s" : ""} selected for editing
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map((image, index) => (
            <ImageCard
              key={`${image.id}-${index}`}
              image={image}
              index={index}
              onImageClick={onImageClick}
              isSelected={selectedImages.has(image.id)}
              onToggleSelection={onToggleSelection}
              folderId={folderId}
              folderName={folderName}
            />
          ))}
        </div>

        {/* Load More Section */}
        {(hasMore || isLoadingMore) && (
          <div className="flex justify-center mt-8">
            {isLoadingMore ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Loading more images...</span>
              </div>
            ) : hasMore ? (
              <button
                onClick={onLoadMore}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Load More Images
              </button>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

ImageGrid.displayName = "ImageGrid";

export default ImageGrid;
