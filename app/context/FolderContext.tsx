"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { FolderData } from "../types/image";
import { useFolders } from "../hooks/queries/useFolders";

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
  const { data: folders, isLoading, error, refetch } = useFolders();
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);

  useEffect(() => {
    if (folders?.folders && folders.folders.length > 0 && !selectedFolder) {
      setSelectedFolder(folders.folders[0]);
    }
  }, [folders, selectedFolder]);

  const value: FolderContextType = {
    folders: folders?.folders || [],
    selectedFolder,
    isLoading,
    error: error ? error.toString() : null,
    setSelectedFolder,
    refreshFolders: async () => {
      await refetch();
    },
  };

  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
}

export function useFolderContext() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolderContext must be used within a FolderProvider");
  }
  return context;
}
