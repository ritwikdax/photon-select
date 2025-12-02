import { useFolderContext } from "../context/FolderContext";

/**
 * Custom hook to easily get the currently selected folder ID
 * Returns null if no folder is selected
 */
export function useSelectedFolderId(): string | null {
  const { selectedFolder } = useFolderContext();
  return selectedFolder?.folderId || null;
}

/**
 * Custom hook to easily get the currently selected folder name
 * Returns null if no folder is selected
 */
export function useSelectedFolderName(): string | null {
  const { selectedFolder } = useFolderContext();
  return selectedFolder?.name || null;
}

/**
 * Custom hook to get the complete selected folder data
 * Returns null if no folder is selected
 */
export function useSelectedFolder() {
  const { selectedFolder } = useFolderContext();
  return selectedFolder;
}

/**
 * Custom hook to get both folder ID and name as an object
 * Returns null if no folder is selected
 */
export function useSelectedFolderInfo(): {
  folderId: string;
  name: string;
} | null {
  const { selectedFolder } = useFolderContext();
  return selectedFolder
    ? { folderId: selectedFolder.folderId, name: selectedFolder.name }
    : null;
}
