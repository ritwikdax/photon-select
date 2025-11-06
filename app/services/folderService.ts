import axios from "axios";
import { FolderData, FoldersResponse } from "../types/image";
import { API_BASE_URL } from "./imageService";


export const folderService = {
  async fetchFolders(projectId: string): Promise<FolderData[]> {
    if (projectId === undefined || projectId === null) {
      return [];
    }

    try {
      const data = await axios.get<FoldersResponse>(
        `${API_BASE_URL}/public/folders/${projectId}`
      );

      return data.data.folders;
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw new Error("Failed to fetch folders");
    }
  },
};
