"use client";
import { memo } from "react";
import { ImageData } from "../types/image";
import { HeartIcon, DownloadIcon } from "./icons";

interface LightboxToolbarActionsProps {
  image: ImageData;
  isSelected: boolean;
  isSelectionAllowed: boolean;
  onDownload: (image: ImageData) => void;
  onToggleSelection: (image: ImageData, isSelected: boolean) => void;
}

const LightboxToolbarActions = memo(
  ({
    image,
    isSelected,
    isSelectionAllowed,
    onDownload,
    onToggleSelection,
  }: LightboxToolbarActionsProps) => {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDownload(image);
          }}
          style={{ cursor: "pointer" }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white/10 text-white hover:bg-white/20"
          title="Download full-size image">
          <DownloadIcon className="w-5 h-5" />
          View Original
        </button>
        {isSelectionAllowed && (
          <button
            type="button"
            style={{ cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              onToggleSelection(image, isSelected);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-white text-red-500"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}>
            <HeartIcon
              filled={isSelected}
              className={`w-5 h-5 ${
                isSelected ? "text-red-500" : "text-white"
              }`}
            />
            {isSelected ? "Selected" : "Select"}
          </button>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the image ID, selection status, or selection allowed status changes
    return (
      prevProps.image.id === nextProps.image.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isSelectionAllowed === nextProps.isSelectionAllowed
    );
  }
);

LightboxToolbarActions.displayName = "LightboxToolbarActions";

export default LightboxToolbarActions;
