'use client';

import { useState, useEffect, useCallback } from 'react';
import { http } from '../utils/http';
import { useToast } from '../components/ToastProvider';

interface MaxSelectionData {
  maxSelectionCount: number;
  isSelectionAllowed: boolean;
}

export const useMaxSelection = (projectId: string) => {
  const [maxSelectionData, setMaxSelectionData] = useState<MaxSelectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchMaxSelection = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.get(`/public/maxSelection/${projectId}`);
      setMaxSelectionData(response.data);
    } catch (err) {
      console.error('Error fetching max selection data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch max selection data';
      setError(errorMessage);
      
      // Show error toast
      showError(
        'Failed to Load Selection Limits',
        'Could not retrieve selection limits for this project'
      );
      
      // Set default values on error
      setMaxSelectionData({
        maxSelectionCount: 50,
        isSelectionAllowed: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, showError]);

  useEffect(() => {
    fetchMaxSelection();
  }, [fetchMaxSelection]);

  return {
    maxSelectionData,
    isLoading,
    error,
    refetch: fetchMaxSelection
  };
};