import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";

/**
 * Компонент вкладки настроек
 * Соответствует оригинальной реализации Settings tab из ProfilePage
 */
export default function SettingsTab({
  userProfile,
  onPrivacyUpdate,
  showSuccess,
  showError,
  getToken,
  isUpdatingPrivacy = false,
}) {
  const { t } = useTranslation();

  // Handle privacy setting change - just call parent callback
  const handlePrivacyChange = useCallback(
    (isPrivate) => {
      if (onPrivacyUpdate) {
        onPrivacyUpdate(isPrivate);
      }
    },
    [onPrivacyUpdate]
  );

  // Early return if userProfile is not loaded yet
  if (!userProfile || !userProfile.user) {
    console.log("SettingsTab: userProfile not ready", { userProfile });
    return null;
  }

  console.log("SettingsTab: userProfile ready", {
    userProfile,
    isPrivate: userProfile?.user?.isPrivate,
  });

  return (
    <Grid
      container
      spacing={3}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("settings.notifications")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={t("settings.emailNotifications")}
                  secondary={t("settings.receiveEmailNotifications")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("settings.pushNotifications")}
                  secondary={t("settings.receivePushNotifications")}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("settings.privacy")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={t("settings.privateProfile")}
                  secondary={t("settings.hideStats")}
                />
                <Switch
                  checked={userProfile?.user?.isPrivate || false}
                  onChange={(e) => handlePrivacyChange(e.target.checked)}
                  disabled={isUpdatingPrivacy}
                  color="primary"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t("settings.showActivity")}
                  secondary={t("settings.displayLastActivity")}
                />
                <Switch disabled color="primary" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
