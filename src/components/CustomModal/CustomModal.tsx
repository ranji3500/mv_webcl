import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./CustomModal.module.css";

interface CustomModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal = ({
  title,
  isOpen,
  onClose,
  children,
}: CustomModalProps) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box className={styles.modalBox}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h6 className="fs18 fontMedium">{title}</h6>
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>
      {children}
    </Box>
  </Modal>
);

// Named children
CustomModal.Body = ({ children }: { children: React.ReactNode }) => (
  <Box my={2}>{children}</Box>
);
CustomModal.Footer = ({ children }: { children: React.ReactNode }) => (
  <Box mt={2}>{children}</Box>
);

export default CustomModal;
