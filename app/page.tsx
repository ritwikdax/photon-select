"use client";
import { useState, useEffect, useCallback, use } from "react";
import ImageGrid from "./components/ImageGrid";
import ImagePreviewLightbox from "./components/ImagePreviewLightbox";
import LoadingSpinner from "./components/LoadingSpinner";
import Header from "./components/Header";
import { ImageData } from "./types/image";
import { imageService } from "./services/imageService";
import { useSelectedFolderId, useSelectedFolderName } from "./hooks/useFolders";
import { AlertIcon, RefreshIcon, ImageIcon } from "./components/icons";
import { useMaxSelection } from "./hooks/queries/useMaxSelection";
import { useSelectedImages } from "./hooks/queries/useSelectedImages";
import { useIsCountExceeded } from "./hooks/useIsCountExceeded";

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMaxCountExceeded = useIsCountExceeded();
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const [hasMore, setHasMore] = useState(true);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");

  const selectedFolderName = useSelectedFolderName();
  const selectedFolderId = useSelectedFolderId();
  const { data: maxSelectionData, isLoading: isMaxSelectionLoading } =
    useMaxSelection();
  const {
    data: selectedImagesSet,
    isLoading: isSelectedImagesLoading,
    error: selectedImagesError,
  } = useSelectedImages();

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
    [selectedFolderId]
  ); // Add selectedFolderId as dependency

  useEffect(() => {
    loadImages(undefined, false); // Load first page without token
  }, [loadImages]);

  // Reload images when folder changes
  useEffect(() => {
    if (selectedFolderId) {
      loadImages(undefined, false); // Reload from first page when folder changes
    }
  }, [selectedFolderId, loadImages]);

  const handleImageClick = useCallback((_image: ImageData, index: number) => {
    setActivePreviewIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsLightboxOpen(false);
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
      return true;
    },
    []
  );

  const handleTabChange = useCallback((tab: "all" | "selected") => {
    setActiveTab(tab);
  }, []);

  // Filter images based on active tab
  const displayedImages =
    activeTab === "selected"
      ? images.filter((img) => selectedImagesSet?.has(img.id))
      : images;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        isLoading={isLoading}
        error={error}
        imagesCount={images.length}
        selectedImagesCount={selectedImagesSet?.size || 0}
        selectedImagesError={selectedImagesError?.message || null}
        hasMore={hasMore}
        isMaxCountExceeded={isMaxCountExceeded}
        maxSelectionCount={maxSelectionData?.maxSelectionCount ?? 0}
        isSelectionAllowed={maxSelectionData?.isSelectionAllowed ?? false}
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
              {isLoading
                ? "Loading images..."
                : isSelectedImagesLoading
                ? "Loading selected images..."
                : "Loading selection limits..."}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-96 p-8">
            <div className="text-center">
              <AlertIcon className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Failed to Load Images
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                <RefreshIcon className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        ) : displayedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96 p-8">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {activeTab === "selected"
                  ? "No Selected Images"
                  : "No Images Found"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {activeTab === "selected"
                  ? "You haven't selected any images yet. Switch to 'All Images' to select some."
                  : "There are no images available to display."}
              </p>
              {activeTab === "all" && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                  <RefreshIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <ImageGrid
              folderId={selectedFolderId ?? ""}
              folderName={selectedFolderName ?? ""}
              images={displayedImages}
              onImageClick={handleImageClick}
              onLoadMore={handleLoadMore}
              hasMore={activeTab === "all" && hasMore}
              isLoadingMore={isLoadingMore}
              selectedImages={selectedImagesSet || new Set()}
              //onToggleSelection={handleToggleSelection}
            />

            <ImagePreviewLightbox
              images={displayedImages}
              currentIndex={activePreviewIndex}
              isOpen={isLightboxOpen}
              onClose={handleClosePreview}
              folderId={selectedFolderId ?? ""}
              folderName={selectedFolderName ?? ""}
              selectedImages={selectedImagesSet || new Set()}
              onToggleSelection={handleToggleSelection}
            />
          </>
        )}
      </main>
    </div>
  );
}
