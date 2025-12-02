export interface ImageData {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;
  hdPreviewLink: string;
  modifiedTime: string;
  size: string;
  originalLink: string;
}

export interface FolderData {
  folderId: string;
  name: string;
}

export interface FoldersResponse {
  folders: FolderData[];
}
