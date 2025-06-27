import React from "react";
import { Box, Avatar, IconButton, Input } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { getAvatarUrl } from "../../utils/avatarUtils";

const AvatarUpload = ({ userProfile, onAvatarChange, size = 120 }) => {
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file && onAvatarChange) {
      await onAvatarChange(file);
    }
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Avatar
        src={getAvatarUrl(userProfile?.user?.avatar)}
        sx={{
          width: size,
          height: size,
          fontSize: size / 3,
          border: "4px solid #e0e0e0",
        }}
      >
        {userProfile?.user?.name?.charAt(0)?.toUpperCase() || "?"}
      </Avatar>
      <Input
        accept="image/*"
        id="avatar-upload"
        type="file"
        onChange={handleAvatarChange}
        sx={{ display: "none" }}
      />
      <label htmlFor="avatar-upload">
        <IconButton
          color="primary"
          aria-label="upload avatar"
          component="span"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "background.paper",
            border: "2px solid #e0e0e0",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </Box>
  );
};

export default AvatarUpload;
