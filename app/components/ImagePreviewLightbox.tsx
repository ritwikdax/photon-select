"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ImageData } from "../types/image";
import { BASE_API_URL } from "../utils/http";
import { useSelectImage } from "../hooks/mutations/useSelectImage";
import { useUnselectImage } from "../hooks/mutations/useUnselectImage";
import { useMaxSelection } from "../hooks/queries/useMaxSelection";
import LightboxToolbarActions from "./LightboxToolbarActions";

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
  const selectImageMutation = useSelectImage();
  const unselectImageMutation = useUnselectImage();
  const { data: maxSelectionData } = useMaxSelection();
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const isSelectionAllowed = maxSelectionData?.isSelectionAllowed ?? true;

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

  const slides = useMemo(
    () =>
      images.map((image, index) => ({
        src: `${BASE_API_URL}/public/preview/${image.id}`,
        alt: image.name,
        title: image.name,
        imageId: image.id,
        slideIndex: index,
      })),
    [images]
  );
  const currentImage = useMemo(
    () => images[activeIndex],
    [images, activeIndex]
  );

  const isCurrentImageSelected = useMemo(
    () => selectedImages.has(currentImage?.id || ""),
    [selectedImages, currentImage?.id]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        isOpen &&
        isSelectionAllowed &&
        event.code === "Space" &&
        currentImage
      ) {
        event.preventDefault();
        handleSelectionToggle(currentImage, isCurrentImageSelected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isOpen,
    isSelectionAllowed,
    currentImage,
    isCurrentImageSelected,
    handleSelectionToggle,
  ]);

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
          setActiveIndex(index);
        },
      }}
      toolbar={{
        buttons: [
          currentImage ? (
            <span
              key={`filename-${currentImage.id}`}
              className="text-white text-sm font-medium px-4 py-2 mr-auto"
              title={currentImage.name}>
              {currentImage.name}
            </span>
          ) : null,
          currentImage ? (
            <LightboxToolbarActions
              key={`toolbar-${currentImage.id}`}
              image={currentImage}
              isSelected={isCurrentImageSelected}
              isSelectionAllowed={isSelectionAllowed}
              onDownload={handleDownload}
              onToggleSelection={handleSelectionToggle}
            />
          ) : null,
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
