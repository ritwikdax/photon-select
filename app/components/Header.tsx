import { useLogo } from "../hooks/queries/useLogo";
import FolderDropdown from "./FolderDropdown";
import MaxCountExceedWarning from "./MaxCountExceedWarning";
import SelectionNotAllowedWarning from "./SelectionNotAllowedWarning";
import TabButtonGroup from "./TabButtonGroup";

interface HeaderProps {
  isLoading: boolean;
  error: string | null;
  imagesCount: number;
  selectedImagesCount: number;
  selectedImagesError: string | null;
  hasMore: boolean;
  isMaxCountExceeded?: boolean;
  maxSelectionCount?: number;
  isSelectionAllowed?: boolean;
  activeTab?: "all" | "selected";
  onTabChange?: (tab: "all" | "selected") => void;
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
  isSelectionAllowed,
  activeTab = "all",
  onTabChange = () => {},
}: HeaderProps) {
  const { data: logoData } = useLogo();
  return (
    <>
      {/* Main Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {logoData?.logo && logoData?.logoDark && (
                  <>
                    <img
                      src={logoData.logoDark}
                      alt="Logo"
                      className="h-12 w-auto dark:hidden"
                    />
                    <img
                      src={logoData.logo}
                      alt="Logo"
                      className="h-12 w-auto hidden dark:block"
                    />
                  </>
                )}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                View and select images for editing.
                {selectedImagesError && (
                  <span className="block text-red-500 text-sm mt-1">
                    Warning: Could not load selected images (
                    {selectedImagesError})
                  </span>
                )}
              </p>
            </div>
            {/* Maximum Count Exceeded Warning */}
            {isMaxCountExceeded && <MaxCountExceedWarning />}
            {!isSelectionAllowed && <SelectionNotAllowedWarning />}
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

            {/* Tab Button Group */}
            <div className="flex items-center justify-center">
              <TabButtonGroup
                activeTab={activeTab}
                onTabChange={onTabChange}
                selectedCount={selectedImagesCount}
              />
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
                {/* <span className="hidden sm:inline">•</span>
                <span className="hidden lg:inline">
                  Click any image to open as slide
                </span>
                {hasMore && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden md:inline">
                      Scroll down to load more
                    </span>
                  </>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
