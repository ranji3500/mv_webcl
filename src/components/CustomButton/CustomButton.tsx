import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

/**
 * Extra props we want in addition to the regular MUI ButtonProps
 */
interface ExtraProps {
  rounded?: boolean;
  cancel?: boolean; // <— new flag just for the grey “Cancel” style
}

type Props = ExtraProps & ButtonProps;

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "rounded" && prop !== "cancel",
})<Props>(({ theme, rounded, cancel }) => ({
  ...(rounded && { borderRadius: 32 }),

  ...(cancel && {
    color: "var(--cod-gray-800)",
    backgroundColor: "transparent",
    border: "1px solid var(--cod-gray-600)",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      borderColor: "var(--cod-gray-600)",
    },
  }),
}));

export default CustomButton;
