import React, { ReactNode } from "react";

interface EllipseContainerProps {
  color?: "primary" | "warning" | "secondary" | "success";
  children: ReactNode;
}

const colorMap: Record<string, string> = {
  primary: "#F0F9FF",
  warning: "#FFF8EB",
  secondary: "#FEF4FF",
  success: "#F3FAF3",
};

const EllipseContainer: React.FC<EllipseContainerProps> = ({
  color = "primary",
  children,
}) => {
  return (
    <div
      style={{
        width: "4rem",
        height: "4rem",
        backgroundColor: colorMap[color],
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      {children}
    </div>
  );
};

export default EllipseContainer;
