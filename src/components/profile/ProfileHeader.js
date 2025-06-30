import React from "react";
import { useTranslation } from "react-i18next";
import {
  Paper,
  Grid,
  Typography,
  Chip,
  Box,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import { PhotoCamera, ExitToApp } from "@mui/icons-material";
import { formatNumericDate } from "../../utils/dateUtils";
import { getAvatarUrl } from "../../utils/avatarUtils";

/**
 * Компонент заголовка профиля пользователя
 * Точно соответствует оригинальному ProfilePage заголовку
 */
export default function ProfileHeader({
  userProfile,
  onAvatarChange,
  onLogout,
}) {
  const { t } = useTranslation();

  if (!userProfile) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={getAvatarUrl(userProfile.user.avatar)}
              sx={{ width: 100, height: 100 }}
            >
              {userProfile.user.name.charAt(0)}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              type="file"
              onChange={onAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </label>
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" gutterBottom>
            {userProfile.user.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {userProfile.user.email}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
            <Chip
              label={t("profileHeader.memberSince", {
                date: formatNumericDate(userProfile.user.registrationDate),
              })}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={t("profileHeader.totalSkills", {
                count: userProfile.stats.totalSkills,
              })}
              color="success"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${t("stats.level").replace(":", "")} ${
                userProfile.user.level
                  ? t(`stats.levels.${userProfile.user.level}`, {
                      defaultValue: userProfile.user.level,
                    })
                  : t("stats.beginner")
              }`}
              color="warning"
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ExitToApp />}
            onClick={onLogout}
          >
            {t("navbar.logout")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
