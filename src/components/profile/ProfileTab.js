import React from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Person, Save, History, Edit, Cancel } from "@mui/icons-material";

/**
 * Компонент вкладки профиля с личной информацией
 */
export default function ProfileTab({
  userProfile,
  editMode,
  formData,
  onEditToggle,
  onInputChange,
  onSubmit,
  isSubmitting,
  errors,
  getPreviousVisit,
}) {
  const { t, i18n } = useTranslation();

  if (!userProfile) return null;

  return (
    <Grid
      container
      spacing={3}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6">{t("profile.personalInfo")}</Typography>
              <Button
                startIcon={editMode ? <Cancel /> : <Edit />}
                onClick={onEditToggle}
                color={editMode ? "secondary" : "primary"}
              >
                {editMode ? t("profile.form.cancel") : t("profile.form.edit")}
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("profile.fields.name")}
                  name="name"
                  value={editMode ? formData.name : userProfile.user.name}
                  onChange={(e) => {
                    if (editMode) {
                      onInputChange(e);
                    }
                  }}
                  disabled={!editMode}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("profile.fields.email")}
                  name="email"
                  type="email"
                  value={editMode ? formData.email : userProfile.user.email}
                  onChange={(e) => {
                    if (editMode) {
                      onInputChange(e);
                    }
                  }}
                  disabled={!editMode}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
            </Grid>
          </CardContent>
          {editMode && (
            <CardActions>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {t("profile.form.save")}
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("profile.accountStats")}
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary={t("profile.registrationDate")}
                  secondary={new Date(
                    userProfile.user.registrationDate
                  ).toLocaleString(i18n.language === "ru" ? "ru-RU" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText
                  primary={t("profile.lastLogin")}
                  secondary={(() => {
                    const previousVisit = getPreviousVisit();

                    if (!previousVisit) {
                      return t("profile.firstVisit");
                    }

                    const date = new Date(previousVisit);
                    const now = new Date();
                    const diffMs = now - date;
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(diffMinutes / 60);
                    const diffDays = Math.floor(diffHours / 24);

                    if (diffMinutes < 1) {
                      return t("profile.justNow");
                    } else if (diffHours < 1) {
                      return t("profile.minutesAgo", { count: diffMinutes });
                    } else if (diffDays === 0) {
                      return t("profile.todayAt", {
                        time: date.toLocaleTimeString(
                          i18n.language === "ru" ? "ru-RU" : "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        ),
                      });
                    } else if (diffDays === 1) {
                      return t("profile.yesterdayAt", {
                        time: date.toLocaleTimeString(
                          i18n.language === "ru" ? "ru-RU" : "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        ),
                      });
                    } else {
                      return date.toLocaleString(
                        i18n.language === "ru" ? "ru-RU" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      );
                    }
                  })()}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
