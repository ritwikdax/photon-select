"use client";

import { useLoading } from "../context/LoadingContext";
import { ImageIcon } from "./icons";

export default function GlobalLoadingScreen() {
  const { isInitialLoading } = useLoading();

  if (!isInitialLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-out">
      <div className="flex flex-col items-center justify-center">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-ping opacity-75" />
          </div>

          {/* Middle rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
            <div className="w-28 h-28 rounded-full border-t-4 border-r-4 border-blue-500 dark:border-blue-400" />
          </div>

          {/* Inner icon */}
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="bg-white dark:bg-gray-800 rounded-full p-6 shadow-xl">
              <ImageIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 animate-pulse">
            Loading Your Gallery
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Preparing your images...
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 w-64">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 animate-loading-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
