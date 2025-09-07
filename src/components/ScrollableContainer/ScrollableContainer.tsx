import { Box, styled } from "@mui/material";

const ScrollContainer = styled(Box)({
  display: "flex",
  overflowX: "auto",
  padding: "8px",
  gap: "8px",
  "&::-webkit-scrollbar": {
    height: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "3px",
  },
});

const ScrollableContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ScrollContainer>{children}</ScrollContainer>;
};

export default ScrollableContainer;
