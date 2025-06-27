import React from "react";
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
              <Typography variant="h6">Личная информация</Typography>
              <Button
                startIcon={editMode ? <Cancel /> : <Edit />}
                onClick={onEditToggle}
                color={editMode ? "secondary" : "primary"}
              >
                {editMode ? "Отмена" : "Редактировать"}
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Имя"
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
                  label="Email"
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
                Сохранить
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Статистика аккаунта
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Дата регистрации"
                  secondary={new Date(
                    userProfile.user.registrationDate
                  ).toLocaleString("ru-Ru", {
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
                  primary="Последний вход"
                  secondary={(() => {
                    const previousVisit = getPreviousVisit();

                    if (!previousVisit) {
                      return "Первое посещение";
                    }

                    const date = new Date(previousVisit);
                    const now = new Date();
                    const diffMs = now - date;
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(
                      diffMinutes / (1000 * 60 * 60)
                    );
                    const diffDays = Math.floor(diffHours / 24);

                    if (diffMinutes < 1) {
                      return "Только что";
                    } else if (diffHours < 1) {
                      return `${diffMinutes} мин. назад`;
                    } else if (diffDays === 0) {
                      return `Сегодня в ${date.toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`;
                    } else if (diffDays === 1) {
                      return `Вчера в ${date.toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`;
                    } else {
                      return date.toLocaleString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
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
