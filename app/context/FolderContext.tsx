'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FolderData } from '../types/image';
import { folderService } from '../services/folderService';
import { useParams } from 'next/navigation';

interface FolderContextType {
  folders: FolderData[];
  selectedFolder: FolderData | null;
  isLoading: boolean;
  error: string | null;
  setSelectedFolder: (folder: FolderData | null) => void;
  refreshFolders: () => Promise<void>;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

interface FolderProviderProps {
  children: ReactNode;
}

export function FolderProvider({ children }: FolderProviderProps) {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const projectId = params.projectId as string;

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const foldersData = await folderService.fetchFolders(projectId);
      setFolders(foldersData);
      
      // Auto-select first folder if none selected
      if (!selectedFolder && foldersData.length > 0) {
        setSelectedFolder(foldersData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
      console.error('Error fetching folders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFolders = async () => {
    await fetchFolders();
  };

  useEffect(() => {
    if (projectId) {
      fetchFolders();
    }
  }, [projectId]);

  const value: FolderContextType = {
    folders,
    selectedFolder,
    isLoading,
    error,
    setSelectedFolder,
    refreshFolders,
  };

  return (
    <FolderContext.Provider value={value}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolderContext() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error('useFolderContext must be used within a FolderProvider');
  }
  return context;
}