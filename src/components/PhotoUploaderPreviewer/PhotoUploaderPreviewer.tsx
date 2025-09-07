// PhotoUploaderPreviewer.tsx
import React from "react";
import { Box, IconButton } from "@mui/material";
import ScrollableContainer from "../ScrollableContainer";
import PreviewImage from "../PreviewImage";
import { DocumentModel } from "../../interface/common.interface";
import axios from "axios";
import { SnackbarSeverity } from "../../enums/common.enums";
import { useLoader } from "../../contexts/LoaderContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { styled } from "@mui/system";
import { Close } from "@mui/icons-material";

interface PhotoUploaderPreviewerProps {
  images: DocumentModel[];
  setImages?: React.Dispatch<React.SetStateAction<DocumentModel[]>>;
  isOnlyPreview?: boolean;
}

const ImageContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
  marginRight: "8px",
});

const PhotoUploaderPreviewer: React.FC<PhotoUploaderPreviewerProps> = ({
  images,
  setImages,
  isOnlyPreview,
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { showLoader, hideLoader } = useLoader();
  const { showSnackbar } = useSnackbar();

  const handleRemoveImage = async (doc: DocumentModel) => {
    if (!setImages) return;

    showLoader();
    if (!doc.documentId) {
      setImages((prev) =>
        prev.filter((img) =>
          img.tempId && doc.tempId
            ? img.tempId !== doc.tempId
            : img.documentName !== doc.documentName
        )
      );
      hideLoader();
    } else {
      try {
        await axios.delete(
          `${API_BASE_URL}/orders/deletedocument/${doc.documentId}`
        );
        setImages((prev) =>
          prev.filter((img) => img.documentId !== doc.documentId)
        );
        showSnackbar("Photo removed successfully!", SnackbarSeverity.SUCCESS);
      } catch (error) {
        console.log(error);
        showSnackbar("Failed to remove photo.", SnackbarSeverity.ERROR);
      } finally {
        hideLoader();
      }
    }
  };

  return (
    <Box>
      {images.length ? (
        <ScrollableContainer>
          {images.map((image) => (
            <ImageContainer key={image.documentId ?? image.tempId}>
              {!isOnlyPreview && setImages && (
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    background: "rgba(255,255,255,0.9)",
                    zIndex: 1,
                  }}
                  onClick={() => handleRemoveImage(image)}
                >
                  <Close fontSize="medium" />
                </IconButton>
              )}
              <PreviewImage
                src={
                  image.tempId && image.tempRequestPath
                    ? image.tempRequestPath
                    : `${API_BASE_URL}/orders/getdocumentfile/${image.documentName}`
                }
              />
            </ImageContainer>
          ))}
        </ScrollableContainer>
      ) : null}
    </Box>
  );
};

export default PhotoUploaderPreviewer;
