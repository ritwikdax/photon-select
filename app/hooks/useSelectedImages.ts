'use client';

import { useState, useEffect, useCallback } from 'react';
import { http } from '../utils/http';
import { useToast } from '../components/ToastProvider';

interface SelectedImageData {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  imageId: string;
  imageFileName: string;
  projectId: string;
}

interface MaxSelectionData {
  maxSelectionCount: number;
  isSelectionAllowed: boolean;
}

export const useSelectedImages = (maxSelectionData?: MaxSelectionData | null) => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showError, success: showSuccess } = useToast();

  // Fetch selected images from API and create efficient Set lookup
  const fetchSelectedImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.get('/public/selectedImages');
      const selectedImagesData: SelectedImageData[] = response.data;
      
      // Create Set from imageId values for efficient lookup
      const selectedImageIds = new Set(
        selectedImagesData.map(item => item.imageId)
      );
      
      setSelectedImages(selectedImageIds);
      
      if (selectedImagesData.length > 0) {
        showSuccess(
          'Selection Loaded',
          `${selectedImagesData.length} previously selected image${selectedImagesData.length !== 1 ? 's' : ''} restored`
        );
      }
    } catch (err) {
      console.error('Error fetching selected images:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch selected images';
      setError(errorMessage);
      
      // Show error toast
      showError(
        'Failed to Load Selections',
        'Could not restore previously selected images'
      );
      
      // Initialize with empty Set on error
      setSelectedImages(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [showError, showSuccess]);

  // Load selected images on mount
  useEffect(() => {
    fetchSelectedImages();
  }, [fetchSelectedImages]);

  // Toggle selection locally and optimistically update UI
  const toggleSelection = useCallback((imageId: string, isSelected: boolean) => {
    // Check if selection/deselection is allowed
    if (maxSelectionData && !maxSelectionData.isSelectionAllowed) {
      showError(
        'Selection Not Allowed',
        'You are not allowed to modify image selections at this time'
      );
      return false;
    }

    // Check if we would exceed the maximum selection count
    if (isSelected && maxSelectionData) {
      const currentCount = selectedImages.size;
      if (currentCount >= maxSelectionData.maxSelectionCount) {
        // Allow selection but show warning that extra charges will apply
        // This warning will be shown in the header component
      }
    }

    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(imageId);
      } else {
        newSet.delete(imageId);
      }
      return newSet;
    });

    return true;
  }, [maxSelectionData, selectedImages.size, showError]);

  // Helper function to check if maximum count is exceeded
  const isMaxCountExceeded = maxSelectionData ? selectedImages.size > maxSelectionData.maxSelectionCount : false;

  return {
    selectedImages,
    isLoading,
    error,
    toggleSelection,
    refetch: fetchSelectedImages,
    isMaxCountExceeded,
    isSelectionAllowed: maxSelectionData?.isSelectionAllowed ?? true,
    maxSelectionCount: maxSelectionData?.maxSelectionCount ?? 50
  };
};