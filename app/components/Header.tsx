import FolderDropdown from "./FolderDropdown";
import { WarningIcon } from "./icons";

interface HeaderProps {
  isLoading: boolean;
  error: string | null;
  imagesCount: number;
  selectedImagesCount: number;
  selectedImagesError: string | null;
  hasMore: boolean;
  isMaxCountExceeded?: boolean;
  maxSelectionCount?: number;
}

export default function Header({
  isLoading,
  error,
  imagesCount,
  selectedImagesCount,
  selectedImagesError,
  hasMore,
  isMaxCountExceeded = false,
  maxSelectionCount = 50,
}: HeaderProps) {
  return (
    <>
      {/* Main Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Photon Gallery
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Browse and view your image collection
                {selectedImagesError && (
                  <span className="block text-red-500 text-sm mt-1">
                    Warning: Could not load selected images (
                    {selectedImagesError})
                  </span>
                )}
              </p>
            </div>

            {/* Maximum Count Exceeded Warning */}
            {isMaxCountExceeded && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <WarningIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Maximum Count Exceeded
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      You have exceeded the selection limit. Additional charges
                      may apply for extra selections.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Status Bar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Folder Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Select Folder:
              </label>
              <FolderDropdown />
            </div>

            {/* Status Info */}
            {!isLoading && !error && (
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                <span>{imagesCount} images loaded</span>
                {selectedImagesCount > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span
                      className={`font-medium ${
                        isMaxCountExceeded
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}>
                      {selectedImagesCount} / {maxSelectionCount} selected for
                      edit
                      {isMaxCountExceeded && (
                        <span className="text-xs ml-1 text-yellow-700 dark:text-yellow-300">
                          (over limit)
                        </span>
                      )}
                    </span>
                  </>
                )}
                <span className="hidden sm:inline">•</span>
                <span className="hidden lg:inline">
                  Click any image to open in new tab
                </span>
                {hasMore && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden md:inline">
                      Scroll down to load more
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
