import React, { useState, useEffect, useCallback } from "react";
import {
  useAuth,
  useProfile,
  useSnackbar,
  useForm,
  useLastVisit,
  useAchievements,
  useActivity,
  useSkills,
  useNotes,
  useTopics,
  useFriendship,
} from "../hooks";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  LinearProgress,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Chip,
  TextField,
  Pagination,
} from "@mui/material";
import {
  Person,
  TrendingUp,
  Notes,
  EmojiEvents,
  People,
  Security,
  History,
  Settings,
  Dashboard,
  Send,
  PersonAdd,
  Check,
  FilterList,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import {
  ProfileHeader,
  ProfileTab,
  SkillsTab,
  NotesTab,
  AchievementsTab,
  FriendsTab,
  SecurityTab,
  ActivityTab,
  SettingsTab,
  NoteDialog,
  PasswordChangeDialog,
} from "../components/profile";
import { getAvatarUrl } from "../utils/avatarUtils";

// Utility functions
const getStatusLabel = (status) => {
  switch (status) {
    case "success":
      return "Успешно";
    case "info":
      return "Информация";
    case "warning":
      return "Изменение";
    case "friendship":
      return "Дружба";
    case "default":
      return "Событие";
    default:
      return "Неизвестно";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "success":
      return "success";
    case "info":
      return "info";
    case "warning":
      return "warning";
    case "friendship":
      return "secondary";
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

const translateCategory = (category) => {
  const translations = {
    notes_written: "Заметки",
    topics_completed: "Завершение тем",
    first_action: "Первые действия",
    special: "Особые",
    level_reached: "Уровни",
    skills_created: "Создание навыков",
    streak_days: "Серии дней",
    friends_added: "Дружба",
    friend_requests_received: "Популярность",
    friend_requests_sent: "Инициативность",
    friendship_duration: "Длительная дружба",
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
  };
  return translations[category] || category;
};

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
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [achievementFilter, setAchievementFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [activityPage, setActivityPage] = useState(1);
  const [noteDialog, setNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    topic_id: "",
  });
  const [findFriendsModal, setFindFriendsModal] = useState(false);
  const [sentRequestsModal, setSentRequestsModal] = useState(false);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

  // Users state for Find Friends
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const USERS_PER_PAGE = 10;

  // Notes state
  const [notesSearch, setNotesSearch] = useState("");
  const [notesSortBy, setNotesSortBy] = useState("date");
  const [notesSortOrder, setNotesSortOrder] = useState("desc");
  const [notesPage, setNotesPage] = useState(1);
  const notesPerPage = 6;

  // Hooks
  const { getPreviousVisit } = useLastVisit();
  const { logout, isAuthenticated, getToken } = useAuth();
  const {
    getFullInfo,
    updateProfile,
    updatePassword,
    updateAvatar,
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

  const {
    achievements,
    stats,
    isLoading: achievementsLoading,
    error: achievementsError,
    loadAchievements,
    loadStats,
  } = useAchievements();

  const {
    activities,
    isLoading: activityLoading,
    error: activityError,
    loadActivity,
  } = useActivity();

  const {
    skills,
    skillsStats,
    isLoading: skillsLoading,
    error: skillsError,
    loadSkills,
    loadSkillsStats,
  } = useSkills();

  const {
    notes,
    isLoading: notesLoading,
    error: notesError,
    loadNotes,
    createNewNote,
    updateExistingNote,
    deleteExistingNote,
  } = useNotes();

  const { topics, loadTopics } = useTopics();

  const {
    friends,
    pendingRequests,
    sentRequests,
    isLoading: friendsLoading,
    error: friendsError,
    loadFriends,
    loadPendingRequests,
    loadSentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
  } = useFriendship();

  // Form handling
  const profileForm = useForm(
    {
      name: userProfile?.user?.name || "",
      email: userProfile?.user?.email || "",
    },
    async (data) => {
      try {
        const result = await updateProfile(data);
        if (result.success) {
          // Обновляем локальное состояние профиля
          const updatedUser = { ...userProfile.user, ...data };
          setUserProfile((prev) => ({
            ...prev,
            user: updatedUser,
          }));

          // Важно: обновляем данные формы с новыми значениями
          profileForm.setFormData({
            name: updatedUser.name,
            email: updatedUser.email,
          });

          setEditMode(false);
          showSuccess("Профиль успешно обновлен!");
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError(error.message || "Ошибка при обновлении профиля");
      }
    }
  );

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

  // Helper functions
  const formatSafeDate = (dateString) => {
    if (!dateString) return "Неизвестно";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch (error) {
      return "Неизвестно";
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess("Вы успешно вышли из системы");
    window.location.href = "/login";
  };

  const handlePrivacyUpdate = async (isPrivate) => {
    console.log("handlePrivacyUpdate called with:", isPrivate);
    console.log("Current userProfile:", userProfile);
    setIsUpdatingPrivacy(true);
    try {
      // Получаем токен правильным способом через хук useAuth
      const token = getToken();

      if (!token) {
        throw new Error("Токен авторизации не найден");
      }

      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

      const response = await fetch(`${API_BASE_URL}/api/users/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPrivate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Не удалось обновить настройки приватности"
        );
      }

      const data = await response.json();

      // Update the user profile state
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          isPrivate: isPrivate, // Use the parameter directly like in original ProfilePage
        },
      }));

      showSuccess("Настройки приватности успешно обновлены");
    } catch (error) {
      console.error("Ошибка при обновлении настроек приватности:", error);
      showError(
        error.message || "Произошла ошибка при обновлении настроек приватности"
      );
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await updateAvatar(file);

        if (result.success) {
          // Обновляем состояние профиля с новым аватаром
          const updatedUser = {
            ...userProfile.user,
            avatar: result.data.user.avatar,
          };
          setUserProfile((prev) => ({
            ...prev,
            user: updatedUser,
          }));
          showSuccess("Аватар успешно обновлен!");
        } else {
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
        const reader = new FileReader();
        reader.onload = (e) => {
          setUserProfile((prev) => ({
            ...prev,
            user: { ...prev.user, avatar: e.target.result },
          }));
          showError("Произошла ошибка. Аватар показан локально");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // При отмене редактирования сбрасываем форму к исходным данным
      profileForm.setFormData({
        name: userProfile?.user?.name || "",
        email: userProfile?.user?.email || "",
      });
    }
    setEditMode(!editMode);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Achievement filtering
  const getFilteredAchievements = () => {
    if (!Array.isArray(achievements)) return [];

    return achievements.filter((achievement) => {
      const statusMatch =
        achievementFilter === "all" ||
        (achievementFilter === "completed" && achievement.isCompleted) ||
        (achievementFilter === "incomplete" && !achievement.isCompleted);

      const categoryMatch =
        categoryFilter === "all" || achievement.category === categoryFilter;

      const rarityMatch =
        rarityFilter === "all" || achievement.rarity === rarityFilter;

      return statusMatch && categoryMatch && rarityMatch;
    });
  };

  const getUniqueCategories = () => {
    if (!Array.isArray(achievements)) return [];
    const categories = achievements.map((a) => a.category).filter(Boolean);
    return [...new Set(categories)];
  };

  const getUniqueRarities = () => {
    if (!Array.isArray(achievements)) return [];
    const rarities = achievements.map((a) => a.rarity).filter(Boolean);
    return [...new Set(rarities)];
  };

  // Activity pagination
  const activityItemsPerPage = 10;
  const getPaginatedActivities = () => {
    if (!Array.isArray(activities)) return [];
    const startIndex = (activityPage - 1) * activityItemsPerPage;
    const endIndex = startIndex + activityItemsPerPage;
    return activities.slice(startIndex, endIndex);
  };

  const getTotalActivityPages = () => {
    if (!Array.isArray(activities)) return 1;
    return Math.ceil(activities.length / activityItemsPerPage);
  };

  const handleActivityPageChange = (event, newPage) => {
    setActivityPage(newPage);
  };

  // Notes handling
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(notesSearch.toLowerCase()) ||
      note.content.toLowerCase().includes(notesSearch.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let compareValue = 0;
    switch (notesSortBy) {
      case "title":
        compareValue = a.title.localeCompare(b.title);
        break;
      case "length":
        compareValue = (a.content?.length || 0) - (b.content?.length || 0);
        break;
      case "date":
      default:
        compareValue =
          new Date(a.created_at || a.createdAt) -
          new Date(b.created_at || b.createdAt);
        break;
    }
    return notesSortOrder === "desc" ? -compareValue : compareValue;
  });

  const paginatedNotes = sortedNotes.slice(
    (notesPage - 1) * notesPerPage,
    notesPage * notesPerPage
  );

  const handleNotesPageChange = (event, newPage) => {
    setNotesPage(newPage);
  };

  const handleOpenNoteDialog = (note = null) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({
        title: note.title,
        content: note.content,
        topic_id: note.topic_id || "",
      });
    } else {
      setEditingNote(null);
      setNoteForm({
        title: "",
        content: "",
        topic_id: "",
      });
    }
    setNoteDialog(true);
  };

  const handleCloseNoteDialog = () => {
    setNoteDialog(false);
    setEditingNote(null);
    setNoteForm({ title: "", content: "", topic_id: "" });
  };

  const handleSaveNote = async () => {
    if (
      !noteForm.title.trim() ||
      !noteForm.content.trim() ||
      !noteForm.topic_id
    ) {
      showError(
        "Заполните все обязательные поля: название, содержание и выберите топик"
      );
      return;
    }

    try {
      if (editingNote) {
        const result = await updateExistingNote(editingNote.id, noteForm);
        if (result.success) {
          showSuccess("Заметка обновлена!");
          handleCloseNoteDialog();
          await loadNotes();
        } else {
          showError(result.message);
        }
      } else {
        const result = await createNewNote(noteForm);
        if (result.success) {
          showSuccess("Заметка создана!");
          handleCloseNoteDialog();
          await loadNotes();
        } else {
          showError(result.message);
        }
      }
    } catch (error) {
      showError("Произошла ошибка при сохранении заметки");
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту заметку?")) {
      try {
        const result = await deleteExistingNote(noteId);
        if (result.success) {
          showSuccess("Заметка удалена");
          await loadNotes();
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError("Ошибка при удалении заметки");
      }
    }
  };

  // User pagination functions for FindFriendsDialog
  const fetchAllUsers = async () => {
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
    setUsersLoading(true);
    setUsersError(null);

    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE_URL}/api/users/all`;

      console.log("Fetching users from:", url);
      console.log("Token available:", !!token);

      const headers = {
        "Content-Type": "application/json",
      };

      // Добавляем токен только если он есть
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);

        // Если ошибка 401 (неавторизован), но мы используем optionalAuth,
        // это может означать проблему с токеном - попробуем без токена
        if (response.status === 401 && token) {
          console.log("Token seems invalid, retrying without token...");
          const retryResponse = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            console.log("Retry successful, received data:", retryData);
            const users = retryData.data?.users || retryData.users || [];
            setAllUsers(users);
            return;
          }
        }

        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Non-JSON response:", responseText);
        throw new Error("Сервер вернул некорректный формат данных");
      }

      const data = await response.json();
      console.log("📦 Received data:", data);
      console.log("📦 Users array:", data.data?.users || data.users || []);

      const users = data.data?.users || data.users || [];
      const currentUserId = userProfile?.user?.id;

      // Проверяем, не включен ли текущий пользователь в ответ
      if (currentUserId && users.some((user) => user.id === currentUserId)) {
        console.warn("⚠️ WARNING: Current user included in API response!");
        console.warn("⚠️ Current user ID:", currentUserId);
        console.warn(
          "⚠️ Found user:",
          users.find((user) => user.id === currentUserId)
        );
      } else {
        console.log("✅ Current user correctly excluded from API response");
      }

      // Логируем статусы дружбы для отладки
      users.forEach((user) => {
        if (user.friendship && user.friendship.status !== "none") {
          console.log(
            `📦 User ${user.name} (ID: ${user.id}) friendship status: ${user.friendship.status}`
          );
        }
      });

      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsersError(error.message || "Не удалось загрузить пользователей");
      showError(error.message || "Не удалось загрузить список пользователей");
    } finally {
      setUsersLoading(false);
    }
  };

  const filteredUsers = () => {
    if (!Array.isArray(allUsers)) return [];

    // Исключаем текущего пользователя из списка на фронтенде (дополнительная защита)
    const currentUserId = userProfile?.user?.id;
    let usersExcludingCurrent = allUsers;

    if (currentUserId) {
      usersExcludingCurrent = allUsers.filter(
        (user) => user.id !== currentUserId
      );

      // Логируем, если нашли текущего пользователя в списке (не должно происходить)
      if (allUsers.some((user) => user.id === currentUserId)) {
        console.warn(
          "⚠️ Current user found in users list, filtering out on frontend"
        );
      }
    }

    if (!userSearch.trim()) return usersExcludingCurrent;

    const searchLower = userSearch.toLowerCase();
    return usersExcludingCurrent.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
    );
  };

  const paginatedUsers = () => {
    const filtered = filteredUsers();
    const startIndex = (usersPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  };

  const totalUsersPages = () => {
    const filtered = filteredUsers();
    return Math.ceil(filtered.length / USERS_PER_PAGE);
  };

  const handleUsersPageChange = (event, newPage) => {
    setUsersPage(newPage);
  };

  // Search users by name - добавляем функцию как в ProfilePage
  const handleUserSearch = useCallback((e) => {
    setUserSearch(e.target.value);
    setUsersPage(1); // Сбросить страницу поиска при новом запросе
  }, []);

  // Calculate notes statistics
  const getNotesStats = () => {
    if (!Array.isArray(notes)) {
      return {
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        averageLength: 0,
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekNotes = notes.filter((note) => {
      const noteDate = new Date(note.created_at || note.createdAt);
      return noteDate >= oneWeekAgo;
    });

    const thisMonthNotes = notes.filter((note) => {
      const noteDate = new Date(note.created_at || note.createdAt);
      return noteDate >= oneMonthAgo;
    });

    const totalLength = notes.reduce(
      (sum, note) => sum + (note.content?.length || 0),
      0
    );
    const averageLength = notes.length > 0 ? totalLength / notes.length : 0;

    const stats = {
      total: notes.length,
      thisWeek: thisWeekNotes.length,
      thisMonth: thisMonthNotes.length,
      averageLength: Math.round(averageLength),
    };

    console.log("Notes stats calculated:", {
      notesCount: notes.length,
      totalLength,
      averageLength,
      stats,
    });

    return stats;
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getFullInfo();
        console.log("ProfilePageModular: loaded profile data", result);
        if (result.success) {
          setUserProfile(result.data);
          console.log("ProfilePageModular: userProfile set to", result.data);
          // Важно: инициализируем данные формы после загрузки профиля
          profileForm.setFormData({
            name: result.data.user.name,
            email: result.data.user.email,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (isAuthenticated()) {
      loadData();
      loadAchievements();
      loadStats();
      loadActivity();
      loadSkills();
      loadSkillsStats();
      loadNotes();
      loadTopics();
      loadFriends();
      loadPendingRequests();
      loadSentRequests();
      fetchAllUsers();
    }
  }, []);

  // Синхронизация данных формы с профилем пользователя
  useEffect(() => {
    if (userProfile?.user) {
      profileForm.setFormData({
        name: userProfile.user.name || "",
        email: userProfile.user.email || "",
      });
    }
  }, [userProfile?.user?.name, userProfile?.user?.email]);

  if (!isAuthenticated()) {
    return (
      <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography>Необходима авторизация</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (isLoading || !userProfile) {
    return (
      <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <LinearProgress sx={{ width: "100%" }} />
            <Typography>Загрузка профиля...</Typography>
          </Box>
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

        {/* Profile Header */}
        <ProfileHeader
          userProfile={userProfile}
          onAvatarChange={handleAvatarChange}
          onLogout={handleLogout}
        />

        {/* Tabs */}
        <Paper sx={{ width: "100%" }}>
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
              <Tab label="Заметки" icon={<Notes />} />
              <Tab label="Достижения" icon={<EmojiEvents />} />
              <Tab label="Друзья" icon={<People />} />
              <Tab label="Безопасность" icon={<Security />} />
              <Tab label="История" icon={<History />} />
              <Tab label="Настройки" icon={<Settings />} />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <ProfileTab
              userProfile={userProfile}
              editMode={editMode}
              formData={profileForm.formData}
              onEditToggle={handleEditToggle}
              onInputChange={profileForm.handleInputChange}
              onSubmit={profileForm.handleSubmit}
              isSubmitting={profileForm.isSubmitting}
              errors={profileForm.errors}
              getPreviousVisit={getPreviousVisit}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SkillsTab
              skills={skills}
              skillsStats={skillsStats}
              skillsLoading={skillsLoading}
              skillsError={skillsError}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <NotesTab
              notes={notes}
              notesLoading={notesLoading}
              notesError={notesError}
              notesStats={getNotesStats()}
              notesSearch={notesSearch}
              onNotesSearchChange={setNotesSearch}
              notesSortBy={notesSortBy}
              onNotesSortByChange={setNotesSortBy}
              notesSortOrder={notesSortOrder}
              onNotesSortOrderChange={setNotesSortOrder}
              filteredNotes={filteredNotes}
              paginatedNotes={paginatedNotes}
              notesPage={notesPage}
              notesPerPage={notesPerPage}
              onNotesPageChange={handleNotesPageChange}
              onOpenNoteDialog={handleOpenNoteDialog}
              onDeleteNote={handleDeleteNote}
              formatSafeDate={formatSafeDate}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <AchievementsTab
              achievements={achievements}
              stats={stats}
              achievementsLoading={achievementsLoading}
              achievementsError={achievementsError}
              achievementFilter={achievementFilter}
              categoryFilter={categoryFilter}
              rarityFilter={rarityFilter}
              onAchievementFilterChange={setAchievementFilter}
              onCategoryFilterChange={setCategoryFilter}
              onRarityFilterChange={setRarityFilter}
              getFilteredAchievements={getFilteredAchievements}
              getUniqueCategories={getUniqueCategories}
              getUniqueRarities={getUniqueRarities}
              translateCategory={translateCategory}
              translateRarity={translateRarity}
              formatSafeDate={formatSafeDate}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <FriendsTab
              friends={friends}
              pendingRequests={pendingRequests}
              sentRequests={sentRequests}
              friendshipLoading={friendsLoading}
              onFindFriendsOpen={() => setFindFriendsModal(true)}
              onSentRequestsOpen={() => setSentRequestsModal(true)}
              onAcceptFriendRequest={acceptFriendRequest}
              onDeclineFriendRequest={declineFriendRequest}
              onRemoveFriend={removeFriend}
              showSuccess={showSuccess}
              showError={showError}
              loadFriends={loadFriends}
              loadPendingRequests={loadPendingRequests}
              loadSentRequests={loadSentRequests}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <SecurityTab
              onChangePasswordOpen={() => setChangePasswordDialog(true)}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={6}>
            <ActivityTab
              activities={activities}
              activityLoading={activityLoading}
              activityError={activityError}
              activityPage={activityPage}
              onActivityPageChange={handleActivityPageChange}
              getPaginatedActivities={getPaginatedActivities}
              getTotalActivityPages={getTotalActivityPages}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={7}>
            <SettingsTab
              userProfile={userProfile}
              onPrivacyUpdate={handlePrivacyUpdate}
              showSuccess={showSuccess}
              showError={showError}
              getToken={getToken}
              isUpdatingPrivacy={isUpdatingPrivacy}
            />
          </TabPanel>
        </Paper>

        {/* Dialogs */}
        <NoteDialog
          open={noteDialog}
          onClose={handleCloseNoteDialog}
          editingNote={editingNote}
          noteForm={noteForm}
          onNoteFormChange={setNoteForm}
          onSave={handleSaveNote}
          topics={topics}
        />

        <PasswordChangeDialog
          open={changePasswordDialog}
          onClose={() => setChangePasswordDialog(false)}
          passwordForm={passwordForm}
          onSubmit={passwordForm.handleSubmit}
        />

        {/* Find Friends Dialog */}
        <Dialog
          open={findFriendsModal}
          onClose={() => setFindFriendsModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Найти друзей</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Поиск пользователей"
                variant="outlined"
                value={userSearch}
                onChange={handleUserSearch}
                placeholder="Введите имя или никнейм"
                InputProps={{
                  startAdornment: (
                    <FilterList sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Box>

            {/* Users List */}
            {usersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </Box>
            ) : usersError ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {usersError}
              </Alert>
            ) : (
              <List>
                {paginatedUsers().map((user) => (
                  <ListItem
                    key={user.id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                      flexDirection: "column",
                      alignItems: "stretch",
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={getAvatarUrl(user.avatar)}
                          sx={{ mr: 2, width: 50, height: 50 }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{user.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Уровень {user.level} •{" "}
                            {new Date(user.registrationDate).toLocaleDateString(
                              "ru-RU"
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      {user.isPrivate && (
                        <Chip
                          label="Приватный профиль"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {/* Stats section */}
                    <Box sx={{ mb: 2 }}>
                      {user.isPrivate ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          {user.stats?.message ||
                            "Статистика скрыта пользователем"}
                        </Typography>
                      ) : (
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          {user.stats?.achievements && (
                            <Chip
                              label={`${user.stats.achievements.completed}/${user.stats.achievements.total} достижений`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {user.stats?.progress && (
                            <Chip
                              label={`${user.stats.progress.completedTopics}/${user.stats.progress.totalTopics} тем`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                          {user.stats?.achievements?.points && (
                            <Chip
                              label={`${user.stats.achievements.points} очков`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Action button */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {user.friendship?.status === "none" && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PersonAdd />}
                          onClick={() => {
                            sendFriendRequest(user.id).then((result) => {
                              if (result.success) {
                                showSuccess("Запрос на дружбу отправлен");
                                fetchAllUsers(); // Обновить список пользователей
                                loadSentRequests(); // Обновить список исходящих запросов
                              } else {
                                showError(result.message);
                              }
                            });
                          }}
                        >
                          Добавить в друзья
                        </Button>
                      )}
                      {user.friendship?.status === "sent_request" && (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled
                          color="warning"
                        >
                          Запрос отправлен
                        </Button>
                      )}
                      {user.friendship?.status === "received_request" && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => {
                              acceptFriendRequest(
                                user.friendship.friendshipId
                              ).then((result) => {
                                if (result.success) {
                                  showSuccess("Запрос принят");
                                  fetchAllUsers(); // Обновить список
                                  loadFriends(); // Обновить список друзей
                                  loadPendingRequests(); // Обновить входящие запросы
                                } else {
                                  showError(result.message);
                                }
                              });
                            }}
                          >
                            Принять
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => {
                              declineFriendRequest(
                                user.friendship.friendshipId
                              ).then((result) => {
                                if (result.success) {
                                  showSuccess("Запрос отклонен");
                                  fetchAllUsers(); // Обновить список
                                  loadPendingRequests(); // Обновить входящие запросы
                                } else {
                                  showError(result.message);
                                }
                              });
                            }}
                          >
                            Отклонить
                          </Button>
                        </Box>
                      )}
                      {user.friendship?.status === "accepted" && (
                        <Chip
                          label="Уже друзья"
                          size="small"
                          color="success"
                          icon={<Check />}
                        />
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}

            {/* Pagination for users */}
            {totalUsersPages() > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Pagination
                  count={totalUsersPages()}
                  page={usersPage}
                  onChange={handleUsersPageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFindFriendsModal(false)}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        {/* Sent Requests Dialog */}
        <Dialog
          open={sentRequestsModal}
          onClose={() => setSentRequestsModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Исходящие запросы на дружбу</DialogTitle>
          <DialogContent>
            {friendsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </Box>
            ) : sentRequests.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  color: "text.secondary",
                }}
              >
                <Send sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  Нет исходящих запросов
                </Typography>
                <Typography variant="body2">
                  Вы не отправляли запросы на дружбу
                </Typography>
              </Box>
            ) : (
              <List>
                {sentRequests.map((request) => (
                  <ListItem
                    key={request.friendshipId}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Avatar
                      src={getAvatarUrl(request.addressee.avatar)}
                      sx={{ mr: 2, bgcolor: "primary.main" }}
                    >
                      {(request.addressee.name || "").charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={request.addressee.name}
                      secondary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={`Уровень ${request.addressee.level}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Отправлено:{" "}
                            {new Date(request.requestDate).toLocaleDateString(
                              "ru-RU"
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Вы уверены, что хотите отменить запрос на дружбу для ${request.addressee.name}?`
                            )
                          ) {
                            removeFriend(request.friendshipId).then(
                              (result) => {
                                if (result.success) {
                                  showSuccess("Запрос отменен");
                                  loadSentRequests(); // Обновить исходящие запросы
                                  loadFriends(); // Обновить список друзей
                                } else {
                                  showError(result.message);
                                }
                              }
                            );
                          }
                        }}
                      >
                        Отменить запрос
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
            {friendsError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {friendsError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSentRequestsModal(false)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
