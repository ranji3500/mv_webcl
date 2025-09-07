import React, { useState, useMemo } from "react";
import { Menu, MenuItem, IconButton, Avatar, Box } from "@mui/material";
import { UserDetailsModel } from "../../interface/common.interface";
import { useNavigate } from "react-router-dom";

// Utility to get initials from full name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

// Generate a pastel HSL color based on the user's name
const getRandomHSLColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  const saturation = 70;
  const lightness = 80; // pastel
  return { h: hue, s: saturation, l: lightness };
};

// Compute contrast text color (black or white) based on background lightness
const getContrastTextColor = (lightness: number): string => {
  return lightness > 70 ? "#000000" : "#FFFFFF";
};

interface UserProfileMenuProps {
  userDetails: UserDetailsModel;
}
const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userDetails }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate('/login')
  };

  const initials = useMemo(
    () => getInitials(userDetails.userName),
    [userDetails.userName]
  );
  const bgHSL = useMemo(
    () => getRandomHSLColor(userDetails.userName),
    [userDetails.userName]
  );
  const bgColor = `hsl(${bgHSL.h}, ${bgHSL.s}%, ${bgHSL.l}%)`;
  const textColor = getContrastTextColor(bgHSL.l);

  return (
    <Box sx={{ position: "absolute", top: 16, right: 16 }}>
      <IconButton onClick={handleClick}>
        {userDetails.profileImageRequestPath ? (
          <Avatar
            alt={userDetails.userName}
            src={userDetails.profileImageRequestPath}
          />
        ) : (
          <Avatar sx={{ bgcolor: bgColor, color: textColor }}>
            {initials}
          </Avatar>
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          sx={{
            fontSize: "1.6rem",
          }}
          onClick={handleClose}
        >
          Profile
        </MenuItem>
        <MenuItem
          sx={{
            fontSize: "1.6rem",
          }}
          onClick={logout}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfileMenu;
