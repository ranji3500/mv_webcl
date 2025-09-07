import React from "react";
import styles from "./ImageGalleryPreview.module.css";

interface ImageGalleryPreviewProps {
  images: string[];
  maxVisible?: number;
}

const ImageGalleryPreview: React.FC<ImageGalleryPreviewProps> = ({
  images,
  maxVisible = 4,
}) => {
  const visibleImages = images.slice(0, maxVisible);
  const remaining = images.length - maxVisible;

  return (
    <div className={styles.stackContainer}>
      {visibleImages.map((src, index) => {
        const isLastVisible = index === visibleImages.length - 1;
        return (
          <div
            key={index}
            className={styles.imageWrapper}
            style={{
              left: `${index * 32}px`,
              zIndex: visibleImages.length - index,
            }}
          >
            <img
              src={src}
              alt={`preview-${index}`}
              className={`${styles.image} ${
                !isLastVisible ? styles.withBorder : ""
              }`}
            />
          </div>
        );
      })}
      {remaining > 0 && (
        <div
          className={styles.imageWrapper}
          style={{
            left: `${visibleImages.length * 32}px`,
            zIndex: 0,
          }}
        >
          <div className={styles.more}>+{remaining}</div>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryPreview;
