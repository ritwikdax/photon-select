export interface ImageData {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;
  modifiedTime: string;
  size: string;
  previewUrl: string;
}

export interface FolderData {
  folderId: string;
  name: string;
}

export interface FoldersResponse {
  folders: FolderData[];
}