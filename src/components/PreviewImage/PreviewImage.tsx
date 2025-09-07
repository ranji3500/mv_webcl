import { Box, styled } from "@mui/material";

const ImagePreview = styled(Box)({
  minWidth: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const PreviewImage: React.FC<{
  src: string;
}> = ({ src }) => {
  return (
    <ImagePreview>
      {src ? (
        <img
          src={src}
          alt="Uploaded"
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <img
          src="/src/assets/image-not-available.jpg"
          alt="Image not available"
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
        />
      )}
    </ImagePreview>
  );
};

export default PreviewImage;
