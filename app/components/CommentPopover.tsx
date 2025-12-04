"use client";
import { useState, useRef, useEffect } from "react";
import { CloseIcon } from "./icons";

interface CommentPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  anchorRef: HTMLElement | null;
  note?: string;
}

const CommentPopover = ({
  isOpen,
  onClose,
  onSubmit,
  anchorRef,
  note,
}: CommentPopoverProps) => {
  const [comment, setComment] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_WORDS = 200;

  useEffect(() => {
    if (isOpen) {
      const initialNote = note ?? "";
      setComment(initialNote);
      const words = initialNote
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(initialNote.trim() === "" ? 0 : words.length);
    }
  }, [isOpen, note]);

  useEffect(() => {
    if (isOpen && anchorRef && popoverRef.current) {
      const anchorRect = anchorRef.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const popoverWidth = 400; // maxWidth from the component
      const popoverHeight = popoverRect.height || 250; // estimated height

      // Calculate initial position (below the anchor)
      let top = anchorRect.bottom + 8;
      let left = anchorRect.left;

      // Adjust horizontal position if it goes off-screen
      if (left + popoverWidth > viewportWidth) {
        left = viewportWidth - popoverWidth - 16; // 16px padding from edge
      }
      if (left < 16) {
        left = 16;
      }

      // Adjust vertical position if it goes off-screen
      if (top + popoverHeight > viewportHeight) {
        // Try to position above the anchor
        const topAbove = anchorRect.top - popoverHeight - 8;
        if (topAbove > 16) {
          top = topAbove;
        } else {
          // If it doesn't fit above either, position it in the viewport with padding
          top = viewportHeight - popoverHeight - 16;
        }
      }
      if (top < 16) {
        top = 16;
      }

      setPosition({ top, left });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorRef &&
        !anchorRef.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const count = text.trim() === "" ? 0 : words.length;

    if (count <= MAX_WORDS) {
      setComment(text);
      setWordCount(count);
    }
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
      setWordCount(0);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-[9999] bg-white rounded-lg shadow-2xl border border-gray-200 p-4"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: "320px",
        maxWidth: "400px",
      }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Add Comment</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Close">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={comment}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your comment or note here..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
        rows={4}
      />

      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs ${
            wordCount === MAX_WORDS ? "text-red-500" : "text-gray-500"
          }`}>
          {wordCount}/{MAX_WORDS} words
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          Add
        </button>
      </div>
    </div>
  );
};

export default CommentPopover;
