import { FolderData, FoldersResponse } from "../types/image";
import { http } from "../utils/http";

export const folderService = {
  async fetchFolders(): Promise<FolderData[]> {
    try {
      const data = await http.get<FoldersResponse>(
        `/public/folders`
      );

      return data.data.folders;
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw new Error("Failed to fetch folders");
    }
  },
};
