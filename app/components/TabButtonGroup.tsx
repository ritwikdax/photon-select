interface TabButtonGroupProps {
  activeTab: "all" | "selected";
  onTabChange: (tab: "all" | "selected") => void;
  selectedCount?: number;
}

export default function TabButtonGroup({
  activeTab,
  onTabChange,
  selectedCount = 0,
}: TabButtonGroupProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      <button
        onClick={() => onTabChange("all")}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
          ${
            activeTab === "all"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }
        `}>
        All Images
      </button>
      <button
        onClick={() => onTabChange("selected")}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer
          ${
            activeTab === "selected"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }
        `}>
        Selected Images
        {selectedCount > 0 && (
          <span
            className={`
            inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
            ${
              activeTab === "selected"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
            }
          `}>
            {selectedCount}
          </span>
        )}
      </button>
    </div>
  );
}
