import React, { useState, useEffect } from "react";
import {
  useAuth,
  useProfile,
  useSnackbar,
  useForm,
  useLastVisit,
} from "../hooks";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  LinearProgress,
  Badge,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Person,
  Email,
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  History,
  Settings,
  ExitToApp,
  PhotoCamera,
  TrendingUp,
  Assignment,
  Star,
  EmojiEvents,
  Timeline,
  Dashboard,
  Home,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { getAvatarUrl } from "../utils/avatarUtils";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const { getPreviousVisit } = useLastVisit();

  const { logout, isAuthenticated, getToken } = useAuth();
  const {
    getFullInfo,
    updateProfile,
    updatePassword,
    updateAvatar,
    profileData,
    isLoading,
  } = useProfile();
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSuccess,
    showError,
    hideSnackbar,
  } = useSnackbar(); // Form for profile editing
  const {
    formData,
    errors,
    handleInputChange,
    isSubmitting,
    setFormData,
    handleSubmit,
  } = useForm(
    {
      name: userProfile?.user?.name || "",
      email: userProfile?.user?.email || "",
    },
    async (data) => {
      try {
        const result = await updateProfile(data);
        if (result.success) {
          setUserProfile((prev) => ({
            ...prev,
            user: { ...prev.user, ...data },
          }));
          setEditMode(false);
          showSuccess("Профиль успешно обновлен!");
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError(error.message || "Ошибка при обновлении профиля");
      }
    }
  ); // Form for password change
  const passwordForm = useForm(
    {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    async (data) => {
      if (data.newPassword !== data.confirmPassword) {
        showError("Пароли не совпадают");
        return;
      }
      try {
        const result = await updatePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        if (result.success) {
          setChangePasswordDialog(false);
          passwordForm.resetForm();
          showSuccess("Пароль успешно изменен!");
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError(error.message || "Ошибка при изменении пароля");
      }
    }
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleEditToggle = () => {
    if (editMode) {
      setFormData({
        name: userProfile?.user?.name || "",
        email: userProfile?.user?.email || "",
      });
    }
    setEditMode(!editMode);
  };

  const handleLogout = () => {
    logout();
    showSuccess("Вы успешно вышли из системы");
    // Redirect to login page
    window.location.href = "/login";
  };
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Отправляем файл на сервер
        const result = await updateAvatar(file);

        if (result.success) {
          // Обновляем локальные данные с путем к аватару с сервера
          setUserProfile((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              avatar: result.data.user.avatar, // Используем путь с сервера
            },
          }));
          showSuccess("Аватар успешно обновлен!");
        } else {
          // Если сервер недоступен, показываем локальный превью
          const reader = new FileReader();
          reader.onload = (e) => {
            setUserProfile((prev) => ({
              ...prev,
              user: { ...prev.user, avatar: e.target.result },
            }));
            showError("Аватар обновлен локально, но не сохранен на сервере");
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        // Fallback к локальному превью при ошибке
        const reader = new FileReader();
        reader.onload = (e) => {
          setUserProfile((prev) => ({
            ...prev,
            user: { ...prev.user, avatar: e.target.result },
          }));
          showError("Аватар обновлен локально, но не сохранен на сервере");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Mock activity data
  const [activityHistory] = useState([
    {
      id: 1,
      action: "Вход в систему",
      date: "2024-06-17 10:30",
      status: "success",
    },
    {
      id: 2,
      action: "Обновление профиля",
      date: "2024-06-16 15:45",
      status: "success",
    },
    {
      id: 3,
      action: "Смена пароля",
      date: "2024-06-15 09:20",
      status: "success",
    },
  ]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const result = await getFullInfo();
        if (result.success) {
          setUserProfile(result.data);
          setFormData({
            name: result.data.user.name,
            email: result.data.user.email,
          });
        } else {
          showError(result.message);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        showError("Не удалось загрузить данные профиля");
      }
    };
    loadUserProfile();
  }, []);

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Для доступа к личному кабинету необходимо авторизоваться
        </Alert>
      </Container>
    );
  }

  if (isLoading || !userProfile) {
    return (
      <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <Typography>Загрузка профиля...</Typography>
          </Box>{" "}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="/dashboard"
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
            Панель управления
          </Link>
          <Typography color="text.primary">Личный кабинет</Typography>
        </Breadcrumbs>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box sx={{ position: "relative" }}>
                {" "}
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
                  onChange={handleAvatarChange}
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
              </Typography>{" "}
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {userProfile.user.email}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                {" "}
                <Chip
                  label={`В системе с ${new Date(
                    userProfile.user.registrationDate
                  ).toLocaleDateString()}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />{" "}
                <Chip
                  label={`Всего навыков: ${userProfile.stats.totalSkills}`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Уровень: ${userProfile.user.level}`}
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
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {/* Tabs */}
        <Paper sx={{ width: "100%" }}>
          {" "}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Профиль" icon={<Person />} />
              <Tab label="Мой прогресс" icon={<TrendingUp />} />
              <Tab label="Достижения" icon={<EmojiEvents />} />
              <Tab label="Безопасность" icon={<Security />} />
              <Tab label="История" icon={<History />} />
              <Tab label="Настройки" icon={<Settings />} />
            </Tabs>
          </Box>
          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
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
                        onClick={handleEditToggle}
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
                          value={
                            editMode ? formData.name : userProfile.user.name
                          }
                          onChange={(e) => {
                            if (editMode) {
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }));
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
                          value={
                            editMode ? formData.email : userProfile.user.email
                          }
                          onChange={(e) => {
                            if (editMode) {
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }));
                            }
                          }}
                          disabled={!editMode}
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Grid>{" "}
                    </Grid>
                  </CardContent>
                  {editMode && (
                    <CardActions>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSubmit}
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
                        </ListItemIcon>{" "}
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
                            const diffMinutes = Math.floor(
                              diffMs / (1000 * 60)
                            );
                            const diffHours = Math.floor(
                              diffMinutes / (1000 * 60 * 60)
                            );
                            const diffDays = Math.floor(diffHours / 24);

                            if (diffMinutes < 1) {
                              return "Только что";
                            } else if (diffHours < 1) {
                              return `${diffMinutes} мин. назад`;
                            } else if (diffDays === 0) {
                              return `Сегодня в ${date.toLocaleTimeString(
                                "ru-RU",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}`;
                            } else if (diffDays === 1) {
                              return `Вчера в ${date.toLocaleTimeString(
                                "ru-RU",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}`;
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
          </TabPanel>
          {/* Progress Tab - NEW */}
          <TabPanel value={tabValue} index={1}>
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={12} md={8} width={"40%"}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Общий прогресс обучения
                    </Typography>{" "}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        Заметок: {userProfile.stats.totalNotes}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={userProfile.stats.averageProgress}
                        sx={{ mt: 1, mb: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="h4" color="primary">
                        {userProfile.stats.averageProgress}%
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Активные цели
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Изучение JavaScript"
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Прогресс: 85%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={85}
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="React Framework"
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Прогресс: 60%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={60}
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Node.js Backend"
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Прогресс: 30%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={30}
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4} width={"40%"}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Статистика за месяц
                    </Typography>
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="h3" color="primary">
                        24
                      </Typography>
                      <Typography variant="body2">Дня активности</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="h3" color="secondary">
                        156
                      </Typography>
                      <Typography variant="body2">Выполнено задач</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="h3" color="success.main">
                        42
                      </Typography>
                      <Typography variant="body2">Часов обучения</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          {/* Achievements Tab - NEW */}
          <TabPanel value={tabValue} index={2}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                🏆 Ваши достижения
              </Typography>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <Badge badgeContent="Новое!" color="secondary">
                    <EmojiEvents sx={{ fontSize: 60, color: "gold" }} />
                  </Badge>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Первые шаги
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Создали первую цель обучения
                  </Typography>
                  <Chip
                    label="Получено"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <EmojiEvents sx={{ fontSize: 60, color: "silver" }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Марафонец
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    7 дней подряд активности
                  </Typography>
                  <Chip
                    label="Получено"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <Star sx={{ fontSize: 60, color: "bronze" }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Целеустремленный
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Завершили 10 целей
                  </Typography>
                  <Chip
                    label="5/10"
                    color="warning"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: "center", p: 2, opacity: 0.6 }}>
                  <Timeline sx={{ fontSize: 60, color: "grey" }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Эксперт
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    100 часов обучения
                  </Typography>
                  <Chip
                    label="42/100"
                    color="default"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: "center", p: 2, opacity: 0.6 }}>
                  <EmojiEvents sx={{ fontSize: 60, color: "grey" }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Мастер
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Завершили 50 целей
                  </Typography>
                  <Chip
                    label="5/50"
                    color="default"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: "center", p: 2, opacity: 0.6 }}>
                  <Star sx={{ fontSize: 60, color: "grey" }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Легенда
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    30 дней подряд активности
                  </Typography>
                  <Chip
                    label="7/30"
                    color="default"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          {/* Security Tab */}
          <TabPanel value={tabValue} index={3}>
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
                      Смена пароля
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Регулярно меняйте пароль для обеспечения безопасности
                      аккаунта
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setChangePasswordDialog(true)}
                    >
                      Изменить пароль
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Двухфакторная аутентификация
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Дополнительный уровень защиты для вашего аккаунта
                    </Typography>
                    <Button variant="outlined" disabled>
                      Настроить 2FA (скоро)
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>{" "}
          {/* History Tab */}
          <TabPanel value={tabValue} index={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  История активности
                </Typography>
                <List>
                  {activityHistory.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemText
                          primary={activity.action}
                          secondary={activity.date}
                        />
                        <Chip
                          label={
                            activity.status === "success" ? "Успешно" : "Ошибка"
                          }
                          color={
                            activity.status === "success" ? "success" : "error"
                          }
                          size="small"
                        />
                      </ListItem>
                      {index < activityHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </TabPanel>
          {/* Settings Tab */}
          <TabPanel value={tabValue} index={5}>
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
                          secondary="Скрыть профиль от других пользователей"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Показать активность"
                          secondary="Отображать время последней активности"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
        {/* Change Password Dialog */}
        <Dialog
          open={changePasswordDialog}
          onClose={() => setChangePasswordDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Смена пароля</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Текущий пароль"
                name="currentPassword"
                type="password"
                value={passwordForm.formData.currentPassword}
                onChange={passwordForm.handleInputChange}
                margin="normal"
                error={!!passwordForm.errors.currentPassword}
                helperText={passwordForm.errors.currentPassword}
              />
              <TextField
                fullWidth
                label="Новый пароль"
                name="newPassword"
                type="password"
                value={passwordForm.formData.newPassword}
                onChange={passwordForm.handleInputChange}
                margin="normal"
                error={!!passwordForm.errors.newPassword}
                helperText={passwordForm.errors.newPassword}
              />
              <TextField
                fullWidth
                label="Подтвердите новый пароль"
                name="confirmPassword"
                type="password"
                value={passwordForm.formData.confirmPassword}
                onChange={passwordForm.handleInputChange}
                margin="normal"
                error={!!passwordForm.errors.confirmPassword}
                helperText={passwordForm.errors.confirmPassword}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordDialog(false)}>
              Отмена
            </Button>
            <Button
              variant="contained"
              onClick={passwordForm.handleSubmit}
              disabled={passwordForm.isSubmitting}
            >
              Изменить пароль
            </Button>
          </DialogActions>
        </Dialog>
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={hideSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}{" "}
          </Alert>
        </Snackbar>{" "}
      </Container>
    </Box>
  );
}
