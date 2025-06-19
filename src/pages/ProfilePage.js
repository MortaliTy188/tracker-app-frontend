import React, { useState, useEffect } from "react";
import {
  useAuth,
  useProfile,
  useSnackbar,
  useForm,
  useLastVisit,
  useAchievements,
  useActivity,
  useSkills,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
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
  FilterList,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { getAvatarUrl } from "../utils/avatarUtils";

/**
 * Получить текстовую метку для статуса активности
 * @param {string} status - Статус активности
 * @returns {string} Текстовая метка
 */
const getStatusLabel = (status) => {
  switch (status) {
    case "success":
      return "Успешно";
    case "info":
      return "Информация";
    case "warning":
      return "Изменение";
    case "default":
      return "Событие";
    default:
      return "Неизвестно";
  }
};

/**
 * Получить цвет для статуса активности
 * @param {string} status - Статус активности
 * @returns {string} Цвет для Chip компонента
 */
const getStatusColor = (status) => {
  switch (status) {
    case "success":
      return "success";
    case "info":
      return "info";
    case "warning":
      return "warning";
    case "default":
      return "default";
    default:
      return "default";
  }
};

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

/**
 * Перевести категорию достижения на русский язык
 * @param {string} category - Английское название категории
 * @returns {string} Русское название категории
 */
const translateCategory = (category) => {
  const translations = {
    notes_written: "Заметки",
    topics_completed: "Завершение тем",
    first_action: "Первые действия",
    special: "Особые",
    level_reached: "Уровни",
    skills_created: "Создание навыков",
    streak_days: "Серии дней",
    // Дополнительные возможные категории
    learning: "Обучение",
    progress: "Прогресс",
    activity: "Активность",
    skills: "Навыки",
    social: "Социальное",
    time: "Время",
    completion: "Завершение",
    streak: "Серии",
    milestones: "Вехи",
    achievements: "Достижения",
    notes: "Заметки",
    topics: "Темы",
    practice: "Практика",
    consistency: "Постоянство",
    dedication: "Преданность",
    mastery: "Мастерство",
    exploration: "Исследование",
    challenge: "Вызов",
  };

  return translations[category] || category;
};

/**
 * Перевести редкость достижения на русский язык
 * @param {string} rarity - Английское название редкости
 * @returns {string} Русское название редкости
 */
const translateRarity = (rarity) => {
  const translations = {
    common: "Обычное",
    uncommon: "Необычное",
    rare: "Редкое",
    epic: "Эпическое",
    legendary: "Легендарное",
  };

  return translations[rarity] || rarity;
};

export default function ProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  // States for achievements filtering
  const [achievementFilter, setAchievementFilter] = useState("all"); // all, completed, incomplete
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, specific category
  const [rarityFilter, setRarityFilter] = useState("all"); // all, common, uncommon, rare, epic, legendary

  // States for activity history pagination
  const [activityPage, setActivityPage] = useState(1);
  const activityItemsPerPage = 10;

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
  } = useSnackbar();
  // Achievements hook
  const {
    achievements,
    stats,
    isLoading: achievementsLoading,
    error: achievementsError,
    loadAchievements,
    loadStats,
    getAchievementsByCategory,
    getCompletedAchievements,
    getIncompleteAchievements,
    getAchievementsByRarity,
  } = useAchievements();

  // Activity hook
  const {
    activities,
    isLoading: activityLoading,
    error: activityError,
    loadActivity,
    getRecentActivities,
  } = useActivity();

  // Skills hook
  const {
    skills,
    skillsStats,
    isLoading: skillsLoading,
    error: skillsError,
    loadSkills,
    loadSkillsStats,
    getSkillsByCategory,
    getCompletedSkills,
    getInProgressSkills,
    getOverallProgress,
  } = useSkills();

  // Form for profile editing
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

  // Function to get filtered achievements
  const getFilteredAchievements = () => {
    let filtered = achievements;

    // Apply completion filter
    if (achievementFilter === "completed") {
      filtered = getCompletedAchievements();
    } else if (achievementFilter === "incomplete") {
      filtered = getIncompleteAchievements();
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (achievement) => achievement.category === categoryFilter
      );
    }

    // Apply rarity filter
    if (rarityFilter !== "all") {
      filtered = filtered.filter(
        (achievement) => achievement.rarity === rarityFilter
      );
    }

    return filtered;
  };

  // Get unique categories from achievements
  const getUniqueCategories = () => {
    const categories = achievements.map((a) => a.category).filter(Boolean);
    return [...new Set(categories)];
  };

  // Get unique rarities from achievements
  const getUniqueRarities = () => {
    const rarities = achievements.map((a) => a.rarity).filter(Boolean);
    return [...new Set(rarities)];
  };

  // Get paginated activities
  const getPaginatedActivities = () => {
    if (!Array.isArray(activities) || activities.length === 0) {
      return [];
    }

    const startIndex = (activityPage - 1) * activityItemsPerPage;
    const endIndex = startIndex + activityItemsPerPage;
    return activities.slice(startIndex, endIndex);
  };

  // Get total pages for activities
  const getTotalActivityPages = () => {
    if (!Array.isArray(activities) || activities.length === 0) {
      return 1;
    }
    return Math.ceil(activities.length / activityItemsPerPage);
  };

  // Handle activity page change
  const handleActivityPageChange = (event, newPage) => {
    setActivityPage(newPage);
  };

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
    }; // Load achievements data
    const loadAchievementsData = async () => {
      try {
        await loadAchievements();
        await loadStats();
      } catch (error) {
        console.error("Error loading achievements:", error);
      }
    }; // Load activity data
    const loadActivityData = async () => {
      try {
        await loadActivity();
      } catch (error) {
        console.error("Error loading activity:", error);
      }
    };

    // Load skills data
    const loadSkillsData = async () => {
      try {
        await loadSkills();
        await loadSkillsStats();
      } catch (error) {
        console.error("Error loading skills:", error);
      }
    };

    loadUserProfile();
    loadAchievementsData();
    loadActivityData();
    loadSkillsData();
  }, [loadAchievements, loadStats, loadActivity, loadSkills, loadSkillsStats]);

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
              <Tab label="Навыки" icon={<TrendingUp />} />
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
          </TabPanel>{" "}
          {/* Skills Tab */} {/* Skills Tab - Dynamic */}
          <TabPanel value={tabValue} index={1}>
            {skillsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </Box>
            ) : (
              <>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  📚 Ваши навыки
                </Typography>

                {/* Skills Statistics Overview */}
                {skillsStats && (
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Общая статистика навыков
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" color="primary">
                            {skillsStats.overview?.totalSkills || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Всего навыков
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" color="secondary">
                            {skillsStats.overview?.totalTopics || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Всего тем
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" color="success.main">
                            {skillsStats.overview?.averageProgress || 0}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Средний прогресс
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" color="info.main">
                            {skillsStats.overview?.completedTopics || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Завершенных тем
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                {/* Skills List */}
                <Grid container spacing={3}>
                  {skills && skills.length > 0 ? (
                    skills.map((skill) => (
                      <Grid item xs={12} md={6} key={skill.id}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography variant="h6" component="h3">
                                {skill.name}
                              </Typography>
                              <Chip
                                label={skill.category?.name || "Без категории"}
                                color="primary"
                                size="small"
                              />
                            </Box>

                            {skill.description && (
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mb: 2 }}
                              >
                                {skill.description}
                              </Typography>
                            )}

                            {/* Skill Progress */}
                            <Box sx={{ mb: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="body2">
                                  Общий прогресс
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  {skill.stats?.averageProgress || 0}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={skill.stats?.averageProgress || 0}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>

                            {/* Topics List */}
                            {skill.topics && skill.topics.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                  Темы ({skill.stats?.completedTopics || 0} из{" "}
                                  {skill.stats?.totalTopics || 0})
                                </Typography>
                                <List dense>
                                  {skill.topics.map((topic) => (
                                    <ListItem key={topic.id} sx={{ px: 0 }}>
                                      <ListItemText
                                        primary={topic.name}
                                        secondary={
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <LinearProgress
                                              variant="determinate"
                                              value={topic.progress || 0}
                                              sx={{
                                                flexGrow: 1,
                                                height: 4,
                                                borderRadius: 2,
                                              }}
                                            />
                                            <Typography variant="caption">
                                              {topic.progress || 0}%
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                      {topic.status && (
                                        <Chip
                                          label={topic.status.name}
                                          size="small"
                                          color={
                                            topic.progress === 100
                                              ? "success"
                                              : "default"
                                          }
                                          variant="outlined"
                                        />
                                      )}
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Card>
                        <CardContent sx={{ textAlign: "center", py: 6 }}>
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            gutterBottom
                          >
                            У вас пока нет навыков
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Начните создавать навыки для отслеживания своего
                            прогресса
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>

                {/* Error Display */}
                {skillsError && (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    {skillsError}
                  </Alert>
                )}
              </>
            )}
          </TabPanel>{" "}
          {/* Achievements Tab - Dynamic */}
          <TabPanel value={tabValue} index={2}>
            {achievementsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </Box>
            ) : (
              <>
                {" "}
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  🏆 Ваши достижения
                </Typography>{" "}
                {/* Filters and Statistics Section */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {/* Filters Section - Left Side */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: "fit-content" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <FilterList sx={{ mr: 1 }} />
                        <Typography variant="h6">Фильтры</Typography>
                      </Box>
                      {/* Completion Status Filter */}
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Статус выполнения</InputLabel>
                        <Select
                          value={achievementFilter}
                          label="Статус выполнения"
                          onChange={(e) => setAchievementFilter(e.target.value)}
                        >
                          <MenuItem value="all">Все достижения</MenuItem>
                          <MenuItem value="completed">
                            <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
                            Выполненные
                          </MenuItem>
                          <MenuItem value="incomplete">
                            <RadioButtonUnchecked
                              sx={{ mr: 1, fontSize: 18 }}
                            />
                            В процессе
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {/* Category Filter */}
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Категория</InputLabel>
                        <Select
                          value={categoryFilter}
                          label="Категория"
                          onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                          <MenuItem value="all">Все категории</MenuItem>
                          {getUniqueCategories().map((category) => (
                            <MenuItem key={category} value={category}>
                              {translateCategory(category)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {/* Rarity Filter */}
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Редкость</InputLabel>
                        <Select
                          value={rarityFilter}
                          label="Редкость"
                          onChange={(e) => setRarityFilter(e.target.value)}
                        >
                          <MenuItem value="all">Любая редкость</MenuItem>
                          {getUniqueRarities().map((rarity) => (
                            <MenuItem key={rarity} value={rarity}>
                              {translateRarity(rarity)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>{" "}
                      {/* Filter Summary */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {achievementFilter !== "all" && (
                          <Chip
                            label={`Статус: ${
                              achievementFilter === "completed"
                                ? "Выполненные"
                                : "В процессе"
                            }`}
                            onDelete={() => setAchievementFilter("all")}
                            color="primary"
                            size="small"
                          />
                        )}
                        {categoryFilter !== "all" && (
                          <Chip
                            label={`Категория: ${translateCategory(
                              categoryFilter
                            )}`}
                            onDelete={() => setCategoryFilter("all")}
                            color="secondary"
                            size="small"
                          />
                        )}
                        {rarityFilter !== "all" && (
                          <Chip
                            label={`Редкость: ${translateRarity(rarityFilter)}`}
                            onDelete={() => setRarityFilter("all")}
                            color="info"
                            size="small"
                          />
                        )}
                      </Box>
                      {/* Reset Filters Button */}
                      {(achievementFilter !== "all" ||
                        categoryFilter !== "all" ||
                        rarityFilter !== "all") && (
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={() => {
                            setAchievementFilter("all");
                            setCategoryFilter("all");
                            setRarityFilter("all");
                          }}
                        >
                          Сбросить все фильтры
                        </Button>
                      )}
                    </Paper>
                  </Grid>

                  {/* Statistics Section - Right Side */}
                  {stats && (
                    <Grid item xs={12} md={8}>
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Общая статистика
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: "center" }}>
                              <Typography variant="h4" color="primary">
                                {stats.completedAchievements}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Получено
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: "center" }}>
                              <Typography variant="h4" color="primary">
                                {stats.totalAchievements}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Всего
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: "center" }}>
                              <Typography variant="h4" color="secondary">
                                {stats.earnedPoints}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Очки
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: "center" }}>
                              <Typography variant="h4" color="success.main">
                                {Math.round(stats.completionRate)}%
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Прогресс
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}
                </Grid>{" "}
                {/* Results Summary */}
                {Array.isArray(achievements) && achievements.length > 0 && (
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Показано {getFilteredAchievements().length} из{" "}
                      {achievements.length} достижений
                    </Typography>
                    {(achievementFilter !== "all" ||
                      categoryFilter !== "all" ||
                      rarityFilter !== "all") && (
                      <Button
                        size="small"
                        onClick={() => {
                          setAchievementFilter("all");
                          setCategoryFilter("all");
                          setRarityFilter("all");
                        }}
                      >
                        Сбросить все фильтры
                      </Button>
                    )}
                  </Box>
                )}
                {/* Achievements Grid */}
                <Grid container spacing={3}>
                  {Array.isArray(achievements) &&
                    getFilteredAchievements().map((achievement) => (
                      <Grid item xs={12} md={4} key={achievement.id}>
                        <Card
                          sx={{
                            textAlign: "center",
                            p: 2,
                            position: "relative",
                            height: 312, // Фиксированная высота для всех карточек
                            minWidth: 310, // Минимальная ширина для всех карточек
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: achievement.isCompleted
                              ? "rgba(46, 125, 50, 0.05)"
                              : "rgba(158, 158, 158, 0.05)",
                            borderLeft: achievement.isCompleted
                              ? "4px solid #2e7d32"
                              : "4px solid #9e9e9e",
                          }}
                        >
                          <CardContent
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {/* Иконка достижения - одинакового размера для всех */}
                            <Box
                              sx={{
                                height: 80,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "60px",
                                  filter: achievement.isCompleted
                                    ? "none"
                                    : "grayscale(100%)",
                                  opacity: achievement.isCompleted ? 1 : 0.6,
                                }}
                              >
                                {achievement.icon}
                              </span>
                            </Box>{" "}
                            {/* Название достижения */}
                            <Typography
                              variant="h6"
                              sx={{
                                mb: 1,
                                color: achievement.isCompleted
                                  ? "success.main"
                                  : "text.secondary",
                                fontWeight: achievement.isCompleted ? 600 : 400,
                              }}
                            >
                              {achievement.name}
                            </Typography>
                            {/* Category and Rarity chips */}
                            <Box
                              sx={{
                                mb: 2,
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              {" "}
                              {achievement.category && (
                                <Chip
                                  label={translateCategory(
                                    achievement.category
                                  )}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              )}
                              {achievement.rarity && (
                                <Chip
                                  label={translateRarity(achievement.rarity)}
                                  size="small"
                                  variant="outlined"
                                  color={
                                    achievement.rarity === "legendary"
                                      ? "error"
                                      : achievement.rarity === "epic"
                                      ? "warning"
                                      : achievement.rarity === "rare"
                                      ? "info"
                                      : "default"
                                  }
                                />
                              )}
                            </Box>
                            {/* Описание достижения */}
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 2,
                                flexGrow: 1,
                                color: achievement.isCompleted
                                  ? "text.primary"
                                  : "text.secondary",
                              }}
                            >
                              {achievement.description}
                            </Typography>
                            {/* Статус и прогресс */}
                            <Box sx={{ mt: "auto" }}>
                              {achievement.isCompleted ? (
                                <>
                                  <Chip
                                    label={`Получено! +${achievement.points} очков`}
                                    color="success"
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  {achievement.earnedAt && (
                                    <Typography
                                      variant="caption"
                                      color="success.main"
                                      display="block"
                                    >
                                      {" "}
                                      {new Date(
                                        achievement.earnedAt
                                      ).toLocaleDateString()}
                                    </Typography>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Chip
                                    label={`${achievement.progress.current}/${achievement.progress.target}`}
                                    color="default"
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  <LinearProgress
                                    variant="determinate"
                                    value={achievement.percentage || 0}
                                    sx={{
                                      mt: 1,
                                      borderRadius: 1,
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor:
                                          achievement.percentage > 50
                                            ? "warning.main"
                                            : "info.main",
                                      },
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mt: 0.5, display: "block" }}
                                  >
                                    {achievement.percentage}% завершено
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>{" "}
                {achievementsError && (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    {achievementsError}
                  </Alert>
                )}
                {/* Empty state for no achievements at all */}
                {Array.isArray(achievements) &&
                  achievements.length === 0 &&
                  !achievementsLoading && (
                    <Box sx={{ textAlign: "center", p: 4 }}>
                      <EmojiEvents
                        sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        Достижения пока не загружены
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Начните использовать приложение, чтобы получить свои
                        первые достижения!
                      </Typography>
                    </Box>
                  )}
                {/* Empty state for filtered out achievements */}
                {Array.isArray(achievements) &&
                  achievements.length > 0 &&
                  getFilteredAchievements().length === 0 &&
                  !achievementsLoading && (
                    <Box sx={{ textAlign: "center", p: 4 }}>
                      <FilterList
                        sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        Нет достижений по выбранным фильтрам
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Попробуйте изменить условия фильтрации
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => {
                          setAchievementFilter("all");
                          setCategoryFilter("all");
                          setRarityFilter("all");
                        }}
                      >
                        Сбросить фильтры
                      </Button>
                    </Box>
                  )}
              </>
            )}
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
            {activityLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </Box>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    История активности
                  </Typography>{" "}
                  {Array.isArray(activities) && activities.length > 0 ? (
                    <>
                      {/* Activity Summary */}
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Показано {getPaginatedActivities().length} из{" "}
                          {activities.length} записей
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Страница {activityPage} из {getTotalActivityPages()}
                        </Typography>
                      </Box>

                      <List>
                        {getPaginatedActivities().map((activity, index) => (
                          <React.Fragment key={activity.id}>
                            <ListItem>
                              <ListItemIcon>
                                {activity.status === "success" && (
                                  <EmojiEvents color="success" />
                                )}
                                {activity.status === "info" && (
                                  <Assignment color="info" />
                                )}
                                {activity.status === "warning" && (
                                  <Security color="warning" />
                                )}
                                {activity.status === "default" && (
                                  <History color="action" />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={activity.description}
                                secondary={new Date(
                                  activity.date
                                ).toLocaleString("ru-RU", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              />
                              <Chip
                                label={getStatusLabel(activity.status)}
                                color={getStatusColor(activity.status)}
                                size="small"
                              />
                            </ListItem>
                            {index < getPaginatedActivities().length - 1 && (
                              <Divider />
                            )}
                          </React.Fragment>
                        ))}
                      </List>

                      {/* Pagination */}
                      {getTotalActivityPages() > 1 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3,
                          }}
                        >
                          <Pagination
                            count={getTotalActivityPages()}
                            page={activityPage}
                            onChange={handleActivityPageChange}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                          />
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box sx={{ textAlign: "center", p: 4 }}>
                      <History
                        sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        История активности пуста
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Ваши действия в системе будут отображаться здесь
                      </Typography>
                    </Box>
                  )}
                  {activityError && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {activityError}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
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
