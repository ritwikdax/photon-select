"use client";

import { useState, useEffect, useCallback } from "react";
import ImageGrid from "../components/ImageGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import { ImageData } from "../types/image";
import { imageService } from "../services/imageService";
import { useSelectedImages } from "../hooks/useSelectedImages";
import { useMaxSelection } from "../hooks/useMaxSelection";
import {
  useSelectedFolderId,
  useSelectedFolderName,
} from "../hooks/useFolders";
import { useParams } from "next/navigation";

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const [hasMore, setHasMore] = useState(true);
  const params = useParams();

  const selectedFolderName = useSelectedFolderName();

  // Get the currently selected folder ID
  const selectedFolderId = useSelectedFolderId();
  
  // Fetch max selection data for this project
  const {
    maxSelectionData,
    isLoading: isMaxSelectionLoading,
    error: maxSelectionError
  } = useMaxSelection(params.projectId as string);
  
  // Use the custom hook for selected images
  const {
    selectedImages,
    isLoading: isSelectedImagesLoading,
    error: selectedImagesError,
    toggleSelection,
    isMaxCountExceeded,
    isSelectionAllowed,
    maxSelectionCount
  } = useSelectedImages(maxSelectionData);

  const loadImages = useCallback(
    async (pageToken?: string, append: boolean = false) => {
      try {
        if (!pageToken) {
          // First load
          setIsLoading(true);
          setImages([]);
          setNextPageToken(undefined);
        } else {
          // Loading more
          setIsLoadingMore(true);
        }
        setError(null);

        const response = await imageService.fetchImages({
          projectId: params.projectId as string,
          nextPageToken: pageToken,
          folderId: selectedFolderId || undefined, // Pass the selected folder ID
        });

        if (append) {
          setImages((prev) => [...prev, ...response.images]);
        } else {
          setImages(response.images);
        }

        setHasMore(response.hasMore);
        setNextPageToken(response.nextPageToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
        console.error("Failed to fetch images:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [selectedFolderId, params]
  ); // Add selectedFolderId and params as dependencies

  useEffect(() => {
    loadImages(undefined, false); // Load first page without token
  }, [loadImages]);

  // Reload images when folder changes
  useEffect(() => {
    if (selectedFolderId) {
      loadImages(undefined, false); // Reload from first page when folder changes
    }
  }, [selectedFolderId, loadImages]);

  const handleImageClick = useCallback((image: ImageData, index: number) => {
    // Open the full-size image in a new window/tab
    window.open(image.previewUrl, "_blank", "noopener,noreferrer");
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && nextPageToken) {
      loadImages(nextPageToken, true);
    }
  }, [nextPageToken, hasMore, isLoadingMore, loadImages]);

  const handleRetry = useCallback(() => {
    loadImages(undefined, false); // Retry from first page
  }, [loadImages]);

  const handleToggleSelection = useCallback(
    (imageId: string, isSelected: boolean) => {
      return toggleSelection(imageId, isSelected);
    },
    [toggleSelection]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        isLoading={isLoading}
        error={error}
        imagesCount={images.length}
        selectedImagesCount={selectedImages.size}
        selectedImagesError={selectedImagesError}
        hasMore={hasMore}
        isMaxCountExceeded={isMaxCountExceeded}
        maxSelectionCount={maxSelectionCount}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Folder Context Demo - Remove this in production */}
        {/* <div className="px-4 sm:px-6 lg:px-8 py-4">
          <FolderDemo />
        </div> */}

        {isLoading || isSelectedImagesLoading || isMaxSelectionLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96 p-8">
            <LoadingSpinner
              size="lg"
              className="text-blue-600 dark:text-blue-400 mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">
              {isLoading ? "Loading images..." : isSelectedImagesLoading ? "Loading selected images..." : "Loading selection limits..."}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-96 p-8">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Failed to Load Images
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96 p-8">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Images Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                There are no images available to display.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <ImageGrid
            projectId={params.projectId as string}
            folderId={selectedFolderId ?? ""}
            folderName={selectedFolderName ?? ""}
            images={images}
            onImageClick={handleImageClick}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            selectedImages={selectedImages}
            onToggleSelection={handleToggleSelection}
          />
        )}
      </main>
    </div>
  );
}
