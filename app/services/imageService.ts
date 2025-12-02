import { ImageData } from "../types/image";
import { http, BASE_API_URL } from "../utils/http";

interface PaginationParams {
  nextPageToken?: string;
  folderId?: string;
}

interface PaginatedResponse {
  images: ImageData[];
  nextPageToken?: string;
  hasMore: boolean;
}

// Helper function to create alternative Google Drive URLs
export const createAlternativeGoogleDriveUrl = (
  originalUrl: string
): string => {
  return `${BASE_API_URL}${originalUrl}`;
};

export const imageService = {
  async fetchImages(params: PaginationParams = {}): Promise<PaginatedResponse> {
    try {
      const { nextPageToken, folderId } = params;

      if (!folderId) {
        return {
          images: [],
          nextPageToken: undefined,
          hasMore: false,
        };
      }
      // Use provided folderId or fallback to default
      const targetFolderId = folderId;

      const url = `/public/images/${targetFolderId}${
        nextPageToken ? `?nextPageToken=${nextPageToken}` : ""
      }`;

      console.log("Fetching URL:", url); // Debug log to verify URL construction

      const response = await http.get(url);
      const data = response.data;

      // Handle the new response structure with nextPageToken
      const transformedImages = data.images.map((image: ImageData) => ({
        ...image,
        thumbnailLink: createAlternativeGoogleDriveUrl(image.thumbnailLink),
        preview: image.hdPreviewLink,
      }));

      return {
        images: transformedImages,
        nextPageToken: data.nextPageToken,
        hasMore: !!data.nextPageToken,
      };
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  },
};
