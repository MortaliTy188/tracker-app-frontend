import React, { useState, useCallback } from "react";
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
              Уведомления
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email уведомления"
                  secondary="Получать уведомления на email"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Push уведомления"
                  secondary="Получать push-уведомления в браузере"
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
              Приватность
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Приватный профиль"
                  secondary="Скрыть статистику от других пользователей"
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
                  primary="Показать активность"
                  secondary="Отображать время последней активности"
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
