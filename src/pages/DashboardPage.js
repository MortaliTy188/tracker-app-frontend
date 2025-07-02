import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useAuth,
  useSnackbar,
  useProfile,
  useActivity,
  useAchievements,
  useSkills,
  useNotes,
  useFriendship,
} from "../hooks";
import { useAchievementNotifications } from "../contexts/AchievementNotificationContext";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Button,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CardActions,
  CircularProgress,
  Badge,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  Person,
  Timeline,
  Add,
  BookmarkBorder,
  Star,
  LocalFireDepartment,
  CalendarToday,
  MoreVert,
  Notifications,
  Settings,
  Search,
  EmojiEvents,
  Notes,
  People,
  School,
  AccessTime,
  Psychology,
  AutoAwesome,
  Groups,
  Lightbulb,
  Refresh,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useSnackbar();

  // Хук для тестирования уведомлений о достижениях
  const { sendTestNotification } = useAchievementNotifications();

  // States for loading
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Form states
  const [skillForm, setSkillForm] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    topic_id: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real data from hooks
  const { profileData, isLoading: profileLoading, getFullInfo } = useProfile();
  const {
    achievements,
    stats: achievementsStats,
    isLoading: achievementsLoading,
    loadAchievements,
    loadStats,
  } = useAchievements();
  const {
    activities,
    isLoading: activityLoading,
    loadActivity,
  } = useActivity();
  const {
    skills,
    skillsStats,
    isLoading: skillsLoading,
    loadSkills,
    loadSkillsStats,
  } = useSkills();
  const {
    notes,
    notesStats,
    isLoading: notesLoading,
    loadNotes,
    loadNotesStats,
  } = useNotes();

  // Derived states for dashboard
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalSkills: 0,
      completedTopics: 0,
      totalNotes: 0,
      achievementPoints: 0,
    },
    activity: {
      streak: 0,
      lastActive: null,
      weeklyStats: [],
    },
    charts: {
      skillsProgress: [],
      activityTrend: [],
      categoryDistribution: [],
    },
    quickStats: {
      todayActivity: 0,
      weeklyGoals: 0,
      monthlyProgress: 0,
    },
  });

  // Chart colors
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  // Load all data
  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      await Promise.all([
        getFullInfo(),
        loadAchievements(),
        loadStats(),
        loadActivity(),
        loadSkills(),
        loadSkillsStats(),
        loadNotes(),
        loadNotesStats(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showError("Ошибка загрузки данных панели управления");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load categories, topics and statuses for forms
  const loadFormData = async () => {
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      // Load categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data?.categories || []);
      }

      // Load topics
      const topicsResponse = await fetch(`${API_BASE_URL}/api/topics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (topicsResponse.ok) {
        const topicsData = await topicsResponse.json();
        setTopics(topicsData.data?.topics || []);
      }

      // Load statuses
      const statusesResponse = await fetch(`${API_BASE_URL}/api/statuses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statusesResponse.ok) {
        const statusesData = await statusesResponse.json();
        setStatuses(statusesData.data?.statuses || []);
      }
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    showSuccess(t("dashboard.dataUpdated"));
  };

  // Process data for dashboard when hooks data changes
  useEffect(() => {
    if (
      !isLoadingData &&
      !profileLoading &&
      !achievementsLoading &&
      !skillsLoading &&
      !notesLoading
    ) {
      processData();
    }
  }, [
    profileData,
    achievements,
    achievementsStats,
    skills,
    skillsStats,
    notes,
    notesStats,
    activities,
  ]);

  // Process and transform data for dashboard
  const processData = () => {
    console.log("Processing dashboard data...", {
      profileData,
      achievements,
      achievementsStats,
      skills,
      skillsStats,
      notes,
      notesStats,
      activities,
    });

    // Overview stats
    const overview = {
      totalSkills: Array.isArray(skills) ? skills.length : 0,
      completedTopics:
        skills?.reduce((total, skill) => {
          return (
            total +
            (skill.topics?.filter((t) => t.status?.name === "Завершено")
              .length || 0)
          );
        }, 0) || 0,
      totalNotes: Array.isArray(notes) ? notes.length : 0,
      achievementPoints: achievementsStats?.earnedPoints || 0,
    };

    // Activity stats
    const activity = {
      streak: calculateStreak(activities),
      lastActive: getLastActiveTime(activities),
      weeklyStats: generateWeeklyStats(activities),
    };

    // Charts data
    const charts = {
      skillsProgress: generateSkillsProgressData(skills),
      activityTrend: generateActivityTrendData(activities),
      categoryDistribution: generateCategoryDistribution(skills),
    };

    // Quick stats
    const quickStats = {
      todayActivity: getTodayActivityCount(activities),
      weeklyGoals: calculateWeeklyGoals(skills),
      monthlyProgress: calculateMonthlyProgress(achievements),
    };

    setDashboardData({
      overview,
      activity,
      charts,
      quickStats,
    });
  };

  // Helper functions for data processing
  const calculateStreak = (activities) => {
    if (!Array.isArray(activities) || activities.length === 0) return 0;
    // Simple streak calculation - count consecutive days with activity
    return Math.floor(Math.random() * 15) + 1; // Mock for now
  };

  const getLastActiveTime = (activities) => {
    if (!Array.isArray(activities) || activities.length === 0) return null;
    const sortedActivities = activities.sort(
      (a, b) =>
        new Date(b.date || b.created_at) - new Date(a.date || a.created_at)
    );
    return sortedActivities[0]?.date || sortedActivities[0]?.created_at;
  };

  const generateWeeklyStats = (activities) => {
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    return days.map((day) => ({
      name: day,
      value: Math.floor(Math.random() * 10) + 1,
    }));
  };

  const generateSkillsProgressData = (skills) => {
    if (!Array.isArray(skills)) return [];
    return skills.slice(0, 5).map((skill) => ({
      name: skill.name || "Неизвестный навык",
      progress: calculateSkillProgress(skill),
      total: skill.topics?.length || 0,
      completed:
        skill.topics?.filter((t) => t.status?.name === "Завершено").length || 0,
    }));
  };

  const calculateSkillProgress = (skill) => {
    if (!skill.topics || skill.topics.length === 0) return 0;
    const completed = skill.topics.filter(
      (t) => t.status?.name === "Завершено"
    ).length;
    return Math.round((completed / skill.topics.length) * 100);
  };

  const generateActivityTrendData = (activities) => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayActivities =
        activities?.filter((activity) => {
          const activityDate = new Date(activity.date || activity.created_at);
          return activityDate.toDateString() === date.toDateString();
        }) || [];

      last7Days.push({
        date: date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        }),
        activities: dayActivities.length,
        notes: dayActivities.filter((a) => a.action?.includes("NOTE")).length,
        skills: dayActivities.filter((a) => a.action?.includes("SKILL")).length,
      });
    }

    return last7Days;
  };

  const generateCategoryDistribution = (skills) => {
    if (!Array.isArray(skills)) return [];
    const categories = {};

    skills.forEach((skill) => {
      const category = skill.category?.name || "Прочее";
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getTodayActivityCount = (activities) => {
    if (!Array.isArray(activities)) return 0;
    const today = new Date().toDateString();
    return activities.filter((activity) => {
      const activityDate = new Date(activity.date || activity.created_at);
      return activityDate.toDateString() === today;
    }).length;
  };

  const calculateWeeklyGoals = (skills) => {
    if (!Array.isArray(skills)) return 0;
    return skills.filter((skill) =>
      skill.topics?.some((t) => t.status?.name !== "Завершено")
    ).length;
  };

  const calculateMonthlyProgress = (achievements) => {
    if (!Array.isArray(achievements)) return 0;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    return achievements.filter((achievement) => {
      if (!achievement.earnedAt && !achievement.completed_at) return false;
      const earnedDate = new Date(
        achievement.earnedAt || achievement.completed_at
      );
      return (
        earnedDate.getMonth() === thisMonth &&
        earnedDate.getFullYear() === thisYear
      );
    }).length;
  };

  // Helper function to translate activity actions
  const translateAction = (action, details = {}) => {
    // Try to translate the action
    const translationKey = `activity.actions.${action}`;
    let translated = t(translationKey);

    // If translation exists and is different from the key, use it
    if (translated !== translationKey) {
      // For complex actions, add details
      switch (action) {
        case "ACHIEVEMENT_EARNED":
          if (details?.achievementTitle || details?.achievementName) {
            return `${translated}: ${
              details.achievementTitle || details.achievementName
            }`;
          }
          break;
        case "NOTE_CREATED":
        case "NOTE_UPDATED":
        case "NOTE_DELETED":
          if (details?.noteTitle || details?.title) {
            return `${translated}: ${details.noteTitle || details.title}`;
          }
          break;
        case "TOPIC_CREATED":
        case "TOPIC_UPDATED":
        case "TOPIC_COMPLETED":
          if (details?.topicTitle || details?.topicName || details?.name) {
            return `${translated}: ${
              details.topicTitle || details.topicName || details.name
            }`;
          }
          break;
        case "SKILL_CREATED":
        case "SKILL_UPDATED":
        case "SKILL_DELETED":
          if (details?.skillTitle || details?.skillName || details?.name) {
            return `${translated}: ${
              details.skillTitle || details.skillName || details.name
            }`;
          }
          break;
        case "EMAIL_CHANGE":
          if (details?.newEmail) {
            return `${translated} ${t("activity.to")} ${details.newEmail}`;
          }
          break;
        case "USERNAME_CHANGE":
          if (details?.newUsername) {
            return `${translated} ${t("activity.to")} ${details.newUsername}`;
          }
          break;
        case "FEEDBACK_SUBMITTED":
          if (details?.subject) {
            return `${translated}: ${details.subject}`;
          }
          break;
        case "FRIEND_REQUEST_SENT":
          if (details?.addresseeName) {
            return `${translated} ${t("activity.to")} ${details.addresseeName}`;
          }
          break;
        case "FRIEND_REQUEST_ACCEPTED":
        case "FRIEND_REQUEST_DECLINED":
          if (details?.requesterName) {
            return `${translated} ${t("activity.from")} ${
              details.requesterName
            }`;
          }
          break;
        case "FRIEND_REMOVED":
          if (details?.friendName) {
            return `${translated}: ${details.friendName}`;
          }
          break;
      }
      return translated;
    }

    // Otherwise use fallback
    return t("activity.actionPerformed");
  };

  // Navigation helpers
  const handleQuickAction = (action) => {
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "newSkill":
        setSkillModalOpen(true);
        break;
      case "newNote":
        setNoteModalOpen(true);
        break;
      case "stats":
        navigate("/profile");
        showSuccess(t("navigation.goToActivity"));
        break;
      default:
        break;
    }
  };

  // Modal handlers
  const handleCloseSkillModal = () => {
    setSkillModalOpen(false);
    setSkillForm({ name: "", description: "", category_id: "" });
    setFormErrors({});
  };

  const handleCloseNoteModal = () => {
    setNoteModalOpen(false);
    setNoteForm({ title: "", content: "", topic_id: "" });
    setFormErrors({});
  };

  const handleSkillFormChange = (e) => {
    setSkillForm({ ...skillForm, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const handleNoteFormChange = (e) => {
    setNoteForm({ ...noteForm, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  // Create skill
  const handleCreateSkill = async () => {
    if (!skillForm.name || !skillForm.category_id) {
      setFormErrors({
        name: !skillForm.name ? t("form.validation.required") : "",
        category_id: !skillForm.category_id
          ? t("form.validation.required")
          : "",
      });
      return;
    }

    setIsSubmitting(true);
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillForm),
      });

      if (response.ok) {
        showSuccess(t("dashboard.quickActions.skillCreated"));
        handleCloseSkillModal();
        await loadSkills();
        await loadSkillsStats();
      } else {
        const errorData = await response.json();
        showError(errorData.message || t("dashboard.quickActions.skillError"));
      }
    } catch (error) {
      showError(t("dashboard.quickActions.skillError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create note
  const handleCreateNote = async () => {
    if (!noteForm.title || !noteForm.content || !noteForm.topic_id) {
      setFormErrors({
        title: !noteForm.title ? t("form.validation.required") : "",
        content: !noteForm.content ? t("form.validation.required") : "",
        topic_id: !noteForm.topic_id ? t("form.validation.required") : "",
      });
      return;
    }

    setIsSubmitting(true);
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteForm),
      });

      if (response.ok) {
        showSuccess(t("dashboard.quickActions.noteCreated"));
        handleCloseNoteModal();
        await loadNotes();
        await loadNotesStats();
      } else {
        const errorData = await response.json();
        showError(errorData.message || t("dashboard.quickActions.noteError"));
      }
    } catch (error) {
      showError(t("dashboard.quickActions.noteError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  useEffect(() => {
    if (isAuthenticated()) {
      loadDashboardData();
      loadFormData();
    }
  }, []);

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {t("auth.loginRequired")}
          </Typography>
          <Button href="/login" variant="contained" sx={{ mt: 2 }}>
            {t("auth.loginButton")}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", pt: 12, mt: 8 }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Main white container with Paper styling */}
        <Paper
          elevation={2}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 4,
            boxShadow: theme.shadows[3],
          }}
        >
          {/* Header with refresh - Centered */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                {t("dashboard.title")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {profileData?.user?.name
                  ? t("dashboard.welcomeWithName", {
                      name: profileData.user.name,
                    })
                  : t("dashboard.welcome")}
                {dashboardData.activity.lastActive &&
                  ` ${t("dashboard.lastActivity", {
                    date: new Date(
                      dashboardData.activity.lastActive
                    ).toLocaleString(
                      i18n.language === "ru" ? "ru-RU" : "en-US"
                    ),
                  })}`}
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", right: 0, display: "flex", gap: 1 }}
            >
              {/* Тестовая кнопка для уведомлений о достижениях */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const testAchievements = [
                    {
                      name: "Первый навык",
                      description: "Создайте свой первый навык",
                      icon: "celebration",
                      points: 50,
                      rarity: "common",
                    },
                    {
                      name: "Мастер заметок",
                      description: "Создайте 10 заметок",
                      icon: "star",
                      points: 100,
                      rarity: "rare",
                    },
                    {
                      name: "Легенда обучения",
                      description: "Завершите 50 тем",
                      icon: "celebration",
                      points: 500,
                      rarity: "legendary",
                    },
                  ];
                  const randomAchievement =
                    testAchievements[
                      Math.floor(Math.random() * testAchievements.length)
                    ];
                  sendTestNotification(randomAchievement);
                }}
                sx={{
                  opacity: 0.7,
                  fontSize: "0.7rem",
                  "&:hover": { opacity: 1 },
                }}
              >
                🎉 Тест
              </Button>
              <LanguageSwitcher variant="select" />
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                  "&:disabled": { bgcolor: "grey.300" },
                }}
              >
                {refreshing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Refresh />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Quick Stats Cards - Centered */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Grid container spacing={3} sx={{ maxWidth: "1000px" }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: "white",
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <School sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                    {isLoadingData ? (
                      <Skeleton
                        variant="text"
                        width={60}
                        height={40}
                        sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                    ) : (
                      <Typography variant="h4">
                        {dashboardData.overview.totalSkills}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t("stats.skillsStudying")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    color: "white",
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                    {isLoadingData ? (
                      <Skeleton
                        variant="text"
                        width={60}
                        height={40}
                        sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                    ) : (
                      <Typography variant="h4">
                        {dashboardData.overview.completedTopics}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t("stats.topicsCompleted")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    color: "white",
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Notes sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                    {isLoadingData ? (
                      <Skeleton
                        variant="text"
                        width={60}
                        height={40}
                        sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                    ) : (
                      <Typography variant="h4">
                        {dashboardData.overview.totalNotes}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t("stats.notesCreated")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    color: "white",
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <LocalFireDepartment
                      sx={{ fontSize: 40, mb: 1, opacity: 0.9 }}
                    />
                    {isLoadingData ? (
                      <Skeleton
                        variant="text"
                        width={60}
                        height={40}
                        sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                    ) : (
                      <Typography variant="h4">
                        {dashboardData.activity.streak}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t("stats.daysInRow")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Activity Trend Chart - Full Width */}
          <Card
            sx={{
              mb: 3,
              boxShadow: theme.shadows[2],
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">{t("activity.title")}</Typography>
                <Chip
                  label={t("stats.todayActions", {
                    count: dashboardData.quickStats.todayActivity,
                  })}
                  color="primary"
                  size="small"
                />
              </Box>
              {isLoadingData ? (
                <Skeleton variant="rectangular" height={350} />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dashboardData.charts.activityTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="activities"
                      stackId="1"
                      stroke={theme.palette.primary.main}
                      fill={alpha(theme.palette.primary.main, 0.6)}
                      name={t("activity.generalActivity")}
                    />
                    <Area
                      type="monotone"
                      dataKey="notes"
                      stackId="2"
                      stroke={theme.palette.warning.main}
                      fill={alpha(theme.palette.warning.main, 0.6)}
                      name={t("activity.notes")}
                    />
                    <Area
                      type="monotone"
                      dataKey="skills"
                      stackId="3"
                      stroke={theme.palette.success.main}
                      fill={alpha(theme.palette.success.main, 0.6)}
                      name={t("activity.skills")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              margin: 0,
              marginTop: 0,
              justifyContent: "space-between",
            }}
          >
            {/* Left Column - Activity Only */}
            <Grid item xs={12} lg={4}>
              {/* Recent Activity - Full Height */}
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                }}
              >
                <CardContent
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Timeline sx={{ mr: 1, color: "info.main" }} />
                    {t("activity.recentActivity")}
                  </Typography>
                  <Box sx={{ flex: 1, overflow: "auto" }}>
                    {activityLoading ? (
                      <Box>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              mb: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                              sx={{ mr: 2 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton variant="text" width="70%" />
                              <Skeleton variant="text" width="40%" />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : activities && activities.length > 0 ? (
                      <List sx={{ p: 0, flex: 1 }}>
                        {activities.slice(0, 10).map((activity, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: "primary.main",
                                }}
                              >
                                {activity.action?.includes("SKILL") ? (
                                  <Psychology fontSize="small" />
                                ) : activity.action?.includes("NOTE") ? (
                                  <Notes fontSize="small" />
                                ) : (
                                  <AccessTime fontSize="small" />
                                )}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight="medium">
                                  {translateAction(
                                    activity.action,
                                    activity.details
                                  )}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    activity.date || activity.created_at
                                  ).toLocaleString(
                                    i18n.language === "ru" ? "ru-RU" : "en-US"
                                  )}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="info" size="small">
                        {t("activity.noActivity")}
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Skills, Achievements, Categories, Actions */}
            <Grid
              item
              xs={12}
              lg={8}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Quick Actions - Full Container Width */}
              <Card
                sx={{
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <AutoAwesome sx={{ mr: 1, color: "secondary.main" }} />
                    {t("quickActions.title")}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Button
                        variant="contained"
                        startIcon={<Psychology />}
                        fullWidth
                        onClick={() => handleQuickAction("newSkill")}
                      >
                        {t("quickActions.newSkill")}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Button
                        variant="outlined"
                        startIcon={<Lightbulb />}
                        fullWidth
                        onClick={() => handleQuickAction("newNote")}
                      >
                        {t("quickActions.addNote")}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Button
                        variant="outlined"
                        startIcon={<Person />}
                        fullWidth
                        onClick={() => handleQuickAction("profile")}
                      >
                        {t("quickActions.myProfile")}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Button
                        variant="outlined"
                        startIcon={<Timeline />}
                        fullWidth
                        onClick={() => handleQuickAction("stats")}
                      >
                        {t("quickActions.detailedStats")}
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Additional Stats */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("quickActions.quickStats")}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="caption">
                            {t("stats.weeklyGoal")}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {dashboardData.quickStats.weeklyGoals}{" "}
                            {t("quickActions.skillsGoal")}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="caption">
                            {t("stats.notesThisWeek")}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {notesStats?.thisWeek || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="caption">
                            {t("stats.level")}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            {profileData?.user?.level
                              ? t(`stats.levels.${profileData.user.level}`, {
                                  defaultValue: profileData.user.level,
                                })
                              : t("stats.beginner")}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* Skills Progress - Full Container Width */}
              <Card
                sx={{
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t("skills.title")}
                  </Typography>
                  {isLoadingData ? (
                    <Box>
                      {[1, 2, 3].map((i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                          <Skeleton variant="text" width="40%" />
                          <Skeleton
                            variant="rectangular"
                            height={10}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : dashboardData.charts.skillsProgress.length > 0 ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {dashboardData.charts.skillsProgress.map(
                        (skill, index) => (
                          <Box key={index} sx={{ width: "100%" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                {skill.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {skill.completed}/{skill.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={skill.progress}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                bgcolor: alpha(theme.palette.grey[300], 0.3),
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 5,
                                  bgcolor:
                                    skill.progress > 75
                                      ? theme.palette.success.main
                                      : skill.progress > 50
                                      ? theme.palette.warning.main
                                      : theme.palette.info.main,
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {skill.progress}% {t("skills.completed")}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  ) : (
                    <Alert severity="info">{t("skills.noSkills")}</Alert>
                  )}
                </CardContent>
              </Card>

              {/* Category Distribution - Full Container Width */}
              {dashboardData.charts.categoryDistribution.length > 0 && (
                <Card
                  sx={{
                    boxShadow: theme.shadows[2],
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t("skill.categoriesTitle")}
                    </Typography>
                    {isLoadingData ? (
                      <Skeleton variant="rectangular" height={200} />
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={dashboardData.charts.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${t(
                                `skills.categories.${name.toLowerCase()}`,
                                t(`skills.categories.${name}`, name)
                              )} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {dashboardData.charts.categoryDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Achievements - Full Container Width */}
              <Card
                sx={{
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <EmojiEvents sx={{ mr: 1, color: "primary.main" }} />
                    {t("achievements.title")}
                  </Typography>
                  {achievementsLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Skeleton variant="circular" width={80} height={80} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                    </Box>
                  ) : achievementsStats ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={achievementsStats.completionRate || 0}
                          size={80}
                          thickness={4}
                          sx={{ color: theme.palette.primary.main }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="div"
                            color="text.secondary"
                            fontWeight="bold"
                          >
                            {Math.round(achievementsStats.completionRate || 0)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          color="text.primary"
                          fontWeight="medium"
                          gutterBottom
                        >
                          {achievementsStats.completedAchievements}
                          {t("achievements.outOf")}
                          {achievementsStats.totalAchievements}{" "}
                          {t("achievements.completed")}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                          {achievementsStats.earnedPoints}{" "}
                          {t("achievements.points")}
                        </Typography>
                        {dashboardData.quickStats.monthlyProgress > 0 && (
                          <Chip
                            label={t("achievements.thisMonth", {
                              count: dashboardData.quickStats.monthlyProgress,
                            })}
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="info" size="small">
                      {t("achievements.notLoaded")}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Create Skill Modal */}
      <Dialog
        open={skillModalOpen}
        onClose={handleCloseSkillModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("dashboard.quickActions.newSkillTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t("form.fields.skillName")}
            fullWidth
            variant="outlined"
            value={skillForm.name}
            onChange={handleSkillFormChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label={t("form.fields.description")}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={skillForm.description}
            onChange={handleSkillFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl
            fullWidth
            variant="outlined"
            error={!!formErrors.category_id}
          >
            <InputLabel>{t("form.fields.category")}</InputLabel>
            <Select
              name="category_id"
              value={skillForm.category_id}
              onChange={handleSkillFormChange}
              label={t("form.fields.category")}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.category_id && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {formErrors.category_id}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillModal} disabled={isSubmitting}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleCreateSkill}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("common.creating") : t("common.create")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Note Modal */}
      <Dialog
        open={noteModalOpen}
        onClose={handleCloseNoteModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("dashboard.quickActions.newNoteTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label={t("form.fields.noteTitle")}
            fullWidth
            variant="outlined"
            value={noteForm.title}
            onChange={handleNoteFormChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="content"
            label={t("form.fields.noteContent")}
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={noteForm.content}
            onChange={handleNoteFormChange}
            error={!!formErrors.content}
            helperText={formErrors.content}
            sx={{ mb: 2 }}
          />
          <FormControl
            fullWidth
            variant="outlined"
            error={!!formErrors.topic_id}
          >
            <InputLabel>{t("form.fields.topic")}</InputLabel>
            <Select
              name="topic_id"
              value={noteForm.topic_id}
              onChange={handleNoteFormChange}
              label={t("form.fields.topic")}
            >
              {topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name} ({topic.skill?.name})
                </MenuItem>
              ))}
            </Select>
            {formErrors.topic_id && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {formErrors.topic_id}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoteModal} disabled={isSubmitting}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleCreateNote}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("common.creating") : t("common.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
