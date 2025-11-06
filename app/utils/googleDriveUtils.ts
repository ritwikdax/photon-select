/**
 * Alternative solutions for Google Drive CORS issues
 */

// Alternative 1: Use Google Drive thumbnail API with different parameters
export const getGoogleDriveThumbnail = (fileId: string, size: number = 220) => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=s${size}`;
};

// Alternative 2: Use Google Drive direct link with different format
export const getGoogleDriveDirectLink = (fileId: string) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// Alternative 3: Use lh3.googleusercontent.com with different parameters
export const getGoogleUserContentLink = (originalUrl: string) => {
  // Extract the path from the original URL and modify it
  if (originalUrl.includes('lh3.googleusercontent.com')) {
    // Remove size parameter to get full resolution
    return originalUrl.replace(/=s\d+$/, '=s0');
  }
  return originalUrl;
};

// Alternative 4: Transform Google Drive URLs to use iframe-friendly format
export const getGoogleDriveEmbedUrl = (fileId: string) => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

// Alternative 5: Use Google Drive viewer URL
export const getGoogleDriveViewerUrl = (fileId: string) => {
  return `https://docs.google.com/viewer?url=https://drive.google.com/uc?export=view%26id=${fileId}`;
};