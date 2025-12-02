import { WarningIcon } from "./icons";

export default function MaxCountExceedWarning() {
  return (
    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-start gap-3">
        <WarningIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Maximum Count Exceeded
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            You have exceeded the selection limit. Additional charges may apply
            for extra selections.
          </p>
        </div>
      </div>
    </div>
  );
}
