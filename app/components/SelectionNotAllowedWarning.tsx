import { WarningIcon } from "./icons";

export default function SelectionNotAllowedWarning() {
  return (
    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-start gap-3">
        <WarningIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Image Selection Closed
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            No more images can be selected at this time. Please contact support
            for further assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
