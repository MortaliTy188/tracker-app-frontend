import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Snackbar,
} from "@mui/material";
import {
  Search,
  FilterList,
  Favorite,
  FavoriteBorder,
  ThumbDown,
  ThumbDownOutlined,
  Comment,
  Visibility,
  Person,
  CalendarToday,
  Category,
  Topic,
  CheckCircle,
  Send,
  ContentCopy,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getAvatarUrl } from "../utils/avatarUtils";
import {
  getPublicSkills,
  getSkillDetails,
  toggleSkillLike,
  addSkillComment,
  getSkillComments,
  getSkillCategories,
  copySkillFromLibrary,
} from "../api/libraryApi";
import Navbar from "../components/Navbar";

const LibraryPage = () => {
  const { t } = useTranslation();

  // Функция перевода категорий навыков
  const translateCategory = (categoryName) => {
    if (!categoryName) return t("skills.noCategory");
    return t(
      `skills.categories.${categoryName.toLowerCase()}`,
      t(`skills.categories.${categoryName}`, categoryName)
    );
  };

  // Состояния для списка навыков
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояния для фильтрации и поиска
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // Состояния для модального окна деталей навыка
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillDetailsOpen, setSkillDetailsOpen] = useState(false);
  const [skillComments, setSkillComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Состояния для уведомлений
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Загрузка категорий при монтировании
  useEffect(() => {
    loadCategories();
  }, []);

  // Загрузка навыков при изменении фильтров
  useEffect(() => {
    loadSkills();
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder]);

  const loadCategories = async () => {
    try {
      const response = await getSkillCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category_id = selectedCategory;

      const response = await getPublicSkills(params);

      if (response.success) {
        console.log(
          "LibraryPage - Received skills data:",
          response.data.skills.slice(0, 2)
        ); // Логируем первые 2 навыка для проверки

        // Логируем userLike для каждого навыка
        response.data.skills.forEach((skill) => {
          console.log(
            `LibraryPage - Skill ${skill.id} userLike:`,
            skill.userLike
          );
        });

        setSkills(response.data.skills);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);

        // Если текущая страница больше общего количества страниц, переходим на первую страницу
        if (
          currentPage > response.data.pagination.totalPages &&
          response.data.pagination.totalPages > 0
        ) {
          setCurrentPage(1);
          return; // Выходим, чтобы избежать повторной загрузки
        }
      } else {
        setError(response.message || t("library.errorLoading"));
      }
    } catch (error) {
      console.error("Error loading skills:", error);
      setError(t("library.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = async (skillId) => {
    try {
      const response = await getSkillDetails(skillId);
      if (response.success) {
        setSelectedSkill(response.data.skill);
        setSkillDetailsOpen(true);
        loadSkillComments(skillId);
      }
    } catch (error) {
      console.error("Error loading skill details:", error);
    }
  };

  const loadSkillComments = async (skillId) => {
    try {
      setCommentsLoading(true);
      const response = await getSkillComments(skillId);
      if (response.success) {
        setSkillComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLikeToggle = async (skillId, type) => {
    try {
      const response = await toggleSkillLike(skillId, type);
      if (response.success) {
        // Обновляем статистику в списке навыков
        setSkills((prevSkills) =>
          prevSkills.map((skill) => {
            if (skill.id === skillId) {
              const newStats = { ...skill.stats };
              let newUserLike = skill.userLike;

              if (response.data.action === "added") {
                if (type === "like") {
                  newStats.likesCount += 1;
                } else {
                  newStats.dislikesCount += 1;
                }
                newUserLike = type;
              } else if (response.data.action === "removed") {
                if (type === "like") {
                  newStats.likesCount -= 1;
                } else {
                  newStats.dislikesCount -= 1;
                }
                newUserLike = null;
              } else if (response.data.action === "updated") {
                if (type === "like") {
                  newStats.likesCount += 1;
                  newStats.dislikesCount -= 1;
                } else {
                  newStats.dislikesCount += 1;
                  newStats.likesCount -= 1;
                }
                newUserLike = type;
              }

              return { ...skill, stats: newStats, userLike: newUserLike };
            }
            return skill;
          })
        );

        // Обновляем в деталях навыка если открыт
        if (selectedSkill && selectedSkill.id === skillId) {
          setSelectedSkill((prev) => {
            const newStats = { ...prev.stats };
            let newUserLike = prev.userLike;

            if (response.data.action === "added") {
              if (type === "like") {
                newStats.likesCount += 1;
              } else {
                newStats.dislikesCount += 1;
              }
              newUserLike = type;
            } else if (response.data.action === "removed") {
              if (type === "like") {
                newStats.likesCount -= 1;
              } else {
                newStats.dislikesCount -= 1;
              }
              newUserLike = null;
            } else if (response.data.action === "updated") {
              if (type === "like") {
                newStats.likesCount += 1;
                newStats.dislikesCount -= 1;
              } else {
                newStats.dislikesCount += 1;
                newStats.likesCount -= 1;
              }
              newUserLike = type;
            }

            return {
              ...prev,
              stats: newStats,
              userLike: newUserLike,
            };
          });
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedSkill) return;

    try {
      const response = await addSkillComment(
        selectedSkill.id,
        newComment.trim()
      );

      if (response.success) {
        setSkillComments((prev) => [response.data.comment, ...prev]);
        setNewComment("");

        // Обновляем счетчик комментариев
        setSelectedSkill((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            commentsCount: prev.stats.commentsCount + 1,
          },
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(newSortBy);
      setSortOrder("DESC");
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  const handleCopySkill = async (skillId, skillName, event) => {
    if (event) {
      event.stopPropagation(); // Предотвращаем открытие модального окна
    }

    try {
      const response = await copySkillFromLibrary(skillId);

      if (response.success) {
        setSnackbar({
          open: true,
          message: t("library.skillCopied", { name: skillName }),
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error copying skill:", error);
      console.error("Error details:", error.response?.data);

      let errorMessage = t("library.copyError");
      if (error.response?.data?.message) {
        const serverMessage = error.response.data.message;
        console.log("Server error message:", serverMessage);
        if (serverMessage.includes("копировать свой собственный навык")) {
          errorMessage = t("library.cannotCopyOwnSkill");
        } else if (serverMessage.includes("уже есть копия")) {
          errorMessage = t("library.skillAlreadyExists");
        } else {
          errorMessage = serverMessage;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        {/* Заголовок страницы */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {t("library.title")}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t("library.subtitle")}
          </Typography>
        </Box>

        {/* Панель поиска и фильтров */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder={t("library.searchPlaceholder")}
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t("library.category")}</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label={t("library.category")}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="">{t("library.allCategories")}</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {translateCategory(category.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant={sortBy === "created_at" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSortChange("created_at")}
                >
                  {t("library.sortByDate")}
                  {sortBy === "created_at" &&
                    (sortOrder === "DESC" ? " ↓" : " ↑")}
                </Button>
                <Button
                  variant={sortBy === "likes" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSortChange("likes")}
                >
                  {t("library.sortByLikes")}
                  {sortBy === "likes" && (sortOrder === "DESC" ? " ↓" : " ↑")}
                </Button>
                <Button
                  variant={sortBy === "dislikes" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSortChange("dislikes")}
                >
                  {t("library.sortByDislikes")}
                  {sortBy === "dislikes" &&
                    (sortOrder === "DESC" ? " ↓" : " ↑")}
                </Button>
                <Button
                  variant={sortBy === "comments" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSortChange("comments")}
                >
                  {t("library.sortByComments")}
                  {sortBy === "comments" &&
                    (sortOrder === "DESC" ? " ↓" : " ↑")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Информация о результатах */}
        {!loading && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t("library.resultsCount", { count: totalItems })}
            </Typography>
          </Box>
        )}

        {/* Список навыков */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : skills.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            {t("library.noSkillsFound")}
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {skills.map((skill) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={skill.id}>
                  <Card
                    sx={{
                      width: 387,
                      height: 313,
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleSkillClick(skill.id)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Владелец навыка */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={
                            skill.owner.avatar
                              ? getAvatarUrl(skill.owner.avatar)
                              : undefined
                          }
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {!skill.owner.avatar && skill.owner.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {skill.owner.name}
                        </Typography>
                      </Box>

                      {/* Название навыка */}
                      <Typography variant="h6" component="h3" gutterBottom>
                        {skill.name}
                      </Typography>

                      {/* Описание */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {skill.description}
                      </Typography>

                      {/* Категория */}
                      {skill.category && (
                        <Chip
                          size="small"
                          label={translateCategory(skill.category.name)}
                          sx={{ mb: 2 }}
                        />
                      )}

                      {/* Статистика топиков */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Topic fontSize="small" color="primary" />
                          <Typography variant="caption">
                            {skill.stats.topicsCount}
                          </Typography>
                        </Box>
                        {skill.stats.completedTopicsCount > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CheckCircle fontSize="small" color="success" />
                            <Typography variant="caption">
                              {skill.stats.completedTopicsCount}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Дата создания */}
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(skill.created_at)}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                      {/* Лайки и дизлайки */}
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(skill.id, "like");
                          }}
                          color={
                            skill.userLike === "like" ? "primary" : "default"
                          }
                        >
                          <Badge
                            badgeContent={skill.stats.likesCount}
                            color="primary"
                          >
                            {skill.userLike === "like" ? (
                              <Favorite fontSize="small" />
                            ) : (
                              <FavoriteBorder fontSize="small" />
                            )}
                          </Badge>
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(skill.id, "dislike");
                          }}
                          color={
                            skill.userLike === "dislike" ? "error" : "default"
                          }
                        >
                          <Badge
                            badgeContent={skill.stats.dislikesCount}
                            color="error"
                          >
                            {skill.userLike === "dislike" ? (
                              <ThumbDown fontSize="small" />
                            ) : (
                              <ThumbDownOutlined fontSize="small" />
                            )}
                          </Badge>
                        </IconButton>
                      </Box>

                      {/* Кнопка копирования */}
                      <Tooltip title={t("library.copySkill")}>
                        <IconButton
                          size="small"
                          onClick={(e) =>
                            handleCopySkill(skill.id, skill.name, e)
                          }
                          color="primary"
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Комментарии */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Comment fontSize="small" color="action" />
                        <Typography variant="caption">
                          {skill.stats.commentsCount}
                        </Typography>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}

        {/* Модальное окно с деталями навыка */}
        <Dialog
          open={skillDetailsOpen}
          onClose={() => setSkillDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedSkill && (
            <>
              <DialogTitle>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {selectedSkill.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={
                        selectedSkill.owner.avatar
                          ? getAvatarUrl(selectedSkill.owner.avatar)
                          : undefined
                      }
                      sx={{ width: 24, height: 24 }}
                    >
                      {!selectedSkill.owner.avatar &&
                        selectedSkill.owner.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.secondary">
                      {selectedSkill.owner.name}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>

              <DialogContent>
                {/* Описание */}
                <Typography variant="body1" paragraph>
                  {selectedSkill.description}
                </Typography>

                {/* Категория */}
                {selectedSkill.category && (
                  <Chip
                    label={translateCategory(selectedSkill.category.name)}
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Статистика */}
                <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleLikeToggle(selectedSkill.id, "like")}
                      color={
                        selectedSkill.userLike === "like"
                          ? "primary"
                          : "default"
                      }
                    >
                      {selectedSkill.userLike === "like" ? (
                        <Favorite color="primary" />
                      ) : (
                        <FavoriteBorder color="primary" />
                      )}
                    </IconButton>
                    <Typography>{selectedSkill.stats.likesCount}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleLikeToggle(selectedSkill.id, "dislike")
                      }
                      color={
                        selectedSkill.userLike === "dislike"
                          ? "error"
                          : "default"
                      }
                    >
                      {selectedSkill.userLike === "dislike" ? (
                        <ThumbDown color="error" />
                      ) : (
                        <ThumbDownOutlined color="error" />
                      )}
                    </IconButton>
                    <Typography>{selectedSkill.stats.dislikesCount}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Comment color="action" />
                    <Typography>{selectedSkill.stats.commentsCount}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Topic color="action" />
                    <Typography>
                      {selectedSkill.stats.completedTopicsCount}/
                      {selectedSkill.stats.topicsCount}{" "}
                      {t("library.topicsCompleted")}
                    </Typography>
                  </Box>
                </Box>

                {/* Топики */}
                {selectedSkill.topics && selectedSkill.topics.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t("library.topics")}
                    </Typography>
                    <List dense>
                      {selectedSkill.topics.map((topic) => (
                        <ListItem key={topic.id}>
                          <ListItemText
                            primary={topic.name}
                            secondary={topic.description}
                          />
                          {topic.status && (
                            <Chip
                              size="small"
                              label={topic.status.name}
                              color={
                                topic.status.name === "Завершено"
                                  ? "success"
                                  : "default"
                              }
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Секция комментариев */}
                <Typography variant="h6" gutterBottom>
                  {t("library.comments")}
                </Typography>

                {/* Форма добавления комментария */}
                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder={t("library.addComment")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    multiline
                    maxRows={3}
                  />
                  <IconButton
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    color="primary"
                  >
                    <Send />
                  </IconButton>
                </Box>

                {/* Список комментариев */}
                {commentsLoading ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : skillComments.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={2}
                  >
                    {t("library.noComments")}
                  </Typography>
                ) : (
                  <List>
                    {skillComments.map((comment) => (
                      <ListItem key={comment.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            src={
                              comment.author.avatar
                                ? getAvatarUrl(comment.author.avatar)
                                : undefined
                            }
                            sx={{ width: 32, height: 32 }}
                          >
                            {!comment.author.avatar &&
                              comment.author.name?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle2">
                                {comment.author.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(comment.created_at)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {comment.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() =>
                    handleCopySkill(selectedSkill.id, selectedSkill.name)
                  }
                  variant="contained"
                  startIcon={<ContentCopy />}
                  sx={{ mr: 1 }}
                >
                  {t("library.copySkill")}
                </Button>
                <Button onClick={() => setSkillDetailsOpen(false)}>
                  {t("common.close")}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Уведомления */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default LibraryPage;
