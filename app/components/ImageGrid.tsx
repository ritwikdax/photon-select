"use client";
import { memo } from "react";
import { ImageData } from "../types/image";
import { CheckIcon } from "./icons";
import { ImageCard } from "./ImageCard";

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

const ImageGrid = memo(
  ({
    images,
    onImageClick,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    selectedImages = new Set(),
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
              onClick={onImageClick}
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
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium">
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
