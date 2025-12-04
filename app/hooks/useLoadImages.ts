import { useState, useCallback } from "react";
import { ImageData } from "../types/image";
import { imageService } from "../services/imageService";

export function useLoadImages(selectedFolderId: string | null) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const [hasMore, setHasMore] = useState(true);

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
  );

  return {
    images,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    nextPageToken,
    loadImages,
  };
}
