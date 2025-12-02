"use client";
import { useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ImageData } from "../types/image";
import { HeartIcon, DownloadIcon } from "./icons";
import { BASE_API_URL } from "../utils/http";
import { useSelectImage } from "../hooks/mutations/useSelectImage";
import { useUnselectImage } from "../hooks/mutations/useUnselectImage";

interface ImagePreviewLightboxProps {
  images: ImageData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
  folderName: string;
  selectedImages: Set<string>;
  onToggleSelection?: (imageId: string, isSelected: boolean) => boolean | void;
}

const ImagePreviewLightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  folderId,
  folderName,
  selectedImages,
}: ImagePreviewLightboxProps) => {
  //   const toggleSelectionOnServer = useImageSelectionHandler({
  //     folderId,
  //     folderName,
  //     onToggleSelection,
  //   });

  const selectImageMutation = useSelectImage();
  const unselectImageMutation = useUnselectImage();
  const handleSelectionToggle = useCallback(
    (image: ImageData, isSelected: boolean) => {
      if (isSelected) {
        unselectImageMutation.mutate(image.id);
      } else {
        selectImageMutation.mutate({
          imageId: image.id,
          imageFileName: image.name,
          folderId,
          folderName,
        });
      }
    },
    [folderId, folderName, selectImageMutation, unselectImageMutation]
  );

  const handleDownload = useCallback((image: ImageData) => {
    const link = document.createElement("a");
    link.href = image.originalLink;
    link.download = image.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const slides = images.map((image, index) => ({
    src: `${BASE_API_URL}/public/preview/${image.id}`,
    alt: image.name,
    title: image.name,
    imageId: image.id,
    slideIndex: index,
  }));

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      index={currentIndex}
      slides={slides}
      plugins={[Zoom]}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      carousel={{
        finite: false,
      }}
      on={{
        view: ({ index }) => {
          // Track current slide index if needed
        },
      }}
      toolbar={{
        buttons: [
          <div
            key={`header-${currentIndex}`}
            className="flex items-center gap-3">
            {(() => {
              const slideData = slides[currentIndex];
              const image = images.find((img) => img.id === slideData?.imageId);
              const isSelected = selectedImages.has(slideData?.imageId || "");
              return (
                image && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDownload(image);
                      }}
                      style={{ cursor: "pointer" }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white/10 text-white hover:bg-white/20"
                      title="Download full-size image">
                      <DownloadIcon className="w-5 h-5" />
                      View Original
                    </button>
                    <button
                      key={`heart-${currentIndex}`}
                      type="button"
                      style={{ cursor: "pointer" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelectionToggle(image, isSelected);
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
                  </>
                )
              );
            })()}
          </div>,
          "close",
        ],
      }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
      }}
    />
  );
};

export default ImagePreviewLightbox;
