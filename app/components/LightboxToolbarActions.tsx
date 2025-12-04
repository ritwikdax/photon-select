"use client";
import { memo, useState, useRef } from "react";
import { ImageData } from "../types/image";
import { HeartIcon, DownloadIcon, CommentIcon } from "./icons";
import CommentPopover from "./CommentPopover";
import { useAddImageNote } from "../hooks/mutations/useAddImageNote";

interface LightboxToolbarActionsProps {
  image: ImageData;
  isSelected: boolean;
  isSelectionAllowed: boolean;
  onDownload: (image: ImageData) => void;
  onToggleSelection: (image: ImageData, isSelected: boolean) => void;
  onCommentPopoverChange?: (isOpen: boolean) => void;
}

const LightboxToolbarActions = memo(
  ({
    image,
    isSelected,
    isSelectionAllowed,
    onDownload,
    onToggleSelection,
    onCommentPopoverChange,
  }: LightboxToolbarActionsProps) => {
    const [isCommentPopoverOpen, setIsCommentPopoverOpen] = useState(false);
    const commentButtonRef = useRef<HTMLButtonElement>(null);
    const addNoteMutation = useAddImageNote();

    const handleCommentSubmit = (comment: string) => {
      console.log("Comment for image:", image.name);
      console.log("Comment:", comment);
      addNoteMutation.mutate({ imageId: image.id, note: comment });
    };

    const handlePopoverToggle = (newState: boolean) => {
      setIsCommentPopoverOpen(newState);
      onCommentPopoverChange?.(newState);
    };

    return (
      <>
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-full">
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
            <>
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
              {isSelected && (
                <button
                  ref={commentButtonRef}
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePopoverToggle(!isCommentPopoverOpen);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white/10 text-white hover:bg-white/20"
                  title="Add comment">
                  <CommentIcon className="w-5 h-5" />
                  Comment
                </button>
              )}
            </>
          )}
        </div>
        <CommentPopover
          note={image.note}
          isOpen={isCommentPopoverOpen}
          onClose={() => handlePopoverToggle(false)}
          onSubmit={handleCommentSubmit}
          anchorRef={commentButtonRef.current}
        />
      </>
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
