import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  LinearProgress,
  Chip,
  Paper,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { updateSkillPublicity } from "../../api/libraryApi";

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Компонент вкладки навыков
 */
export default function SkillsTab({
  skills,
  skillsStats,
  skillsLoading,
  skillsError,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: "",
    description: "",
    status_id: "",
    progress: 0,
    estimated_hours: 0,
  });
  const [topicFormError, setTopicFormError] = useState("");
  const [topicCreating, setTopicCreating] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [updatingPublicity, setUpdatingPublicity] = useState({});

  useEffect(() => {
    // Fetch categories on mount
    fetchCategories();
    fetchStatuses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      if (data && data.success && data.data.categories) {
        setCategories(data.data.categories);
      }
    } catch (e) {
      setCategories([]);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statuses`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data && data.success && data.data.statuses) {
        setStatuses(data.data.statuses);
      }
    } catch (e) {
      setStatuses([]);
    }
  };

  const handleOpenCreate = () => {
    setForm({ name: "", description: "", category_id: "" });
    setFormError("");
    setCreateOpen(true);
  };
  const handleCloseCreate = () => {
    setCreateOpen(false);
    setFormError("");
  };
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCreateSkill = async () => {
    if (!form.name || !form.category_id) {
      setFormError(
        t("skills.createRequiredFields", "Заполните все обязательные поля")
      );
      return;
    }
    setCreating(true);
    setFormError("");
    try {
      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category_id: Number(form.category_id),
        }),
      });
      if (!response.ok) throw new Error("Failed to create skill");
      setCreateOpen(false);
      setForm({ name: "", description: "", category_id: "" });
      window.location.reload();
    } catch (e) {
      setFormError(
        e?.message || t("skills.createError", "Ошибка при создании навыка")
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCardClick = (skill) => {
    setSelectedSkill(skill);
    setTopicForm({
      name: "",
      description: "",
      status_id: "",
      progress: 0,
      estimated_hours: 0,
    });
    setTopicFormError("");
    setTopicModalOpen(true);
  };
  const handleCloseTopicModal = () => {
    setTopicModalOpen(false);
    setSelectedSkill(null);
    setTopicFormError("");
  };
  const handleTopicFormChange = (e) => {
    setTopicForm({ ...topicForm, [e.target.name]: e.target.value });
  };
  const handleCreateTopic = async () => {
    if (!topicForm.name || !topicForm.status_id) {
      setTopicFormError(
        t("skills.createRequiredFields", "Заполните все обязательные поля")
      );
      return;
    }
    setTopicCreating(true);
    setTopicFormError("");
    try {
      const response = await fetch(`${API_BASE_URL}/topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: topicForm.name,
          description: topicForm.description,
          skill_id: selectedSkill.id,
          status_id: Number(topicForm.status_id),
          progress: Number(topicForm.progress),
          estimated_hours: Number(topicForm.estimated_hours),
        }),
      });
      if (!response.ok) throw new Error("Failed to create topic");
      setTopicModalOpen(false);
      setTopicForm({
        name: "",
        description: "",
        status_id: "",
        progress: 0,
        estimated_hours: 0,
      });
      setSelectedSkill(null);
      window.location.reload();
    } catch (e) {
      setTopicFormError(
        e?.message || t("skills.createError", "Ошибка при создании темы")
      );
    } finally {
      setTopicCreating(false);
    }
  };

  // Вспомогательная функция получения токена (локально, как в других местах)
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Обработчик переключения публичности навыка
  const handlePublicityToggle = async (skillId, isPublic) => {
    setUpdatingPublicity((prev) => ({ ...prev, [skillId]: true }));

    try {
      const response = await updateSkillPublicity(skillId, isPublic);
      if (response.success) {
        // Обновляем локальное состояние навыка
        // В реальном приложении лучше обновить состояние через пропсы
        window.location.reload(); // Временное решение для демонстрации
      }
    } catch (error) {
      console.error("Error updating skill publicity:", error);
      // Показать ошибку пользователю
    } finally {
      setUpdatingPublicity((prev) => ({ ...prev, [skillId]: false }));
    }
  };

  if (skillsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          📚 {t("skills.yourSkills")}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          {t("skillBtn.createSkill")}
        </Button>
      </Box>
      {/* Модальное окно создания навыка */}
      <Dialog
        open={createOpen}
        onClose={handleCloseCreate}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("skillBtn.createSkill")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("skillBtn.name")}
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t("skillBtn.description")}
            name="description"
            value={form.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
          <TextField
            select
            label={t("skillBtn.category")}
            name="category_id"
            value={form.category_id}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          {formError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>{t("common.cancel")}</Button>
          <Button
            onClick={handleCreateSkill}
            variant="contained"
            color="primary"
            disabled={creating}
          >
            {t("skillBtn.createSkill")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно создания темы */}
      <Dialog
        open={topicModalOpen}
        onClose={handleCloseTopicModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t("skills.createTopic", "Добавить тему к навыку")}
          {selectedSkill ? `: ${selectedSkill.name}` : ""}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={t("skills.topicName", "Название темы")}
            name="name"
            value={topicForm.name}
            onChange={handleTopicFormChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t("skills.topicDescription", "Описание темы")}
            name="description"
            value={topicForm.description}
            onChange={handleTopicFormChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
          <TextField
            select
            label={t("skills.topicStatus", "Статус")}
            name="status_id"
            value={topicForm.status_id}
            onChange={handleTopicFormChange}
            fullWidth
            margin="normal"
            required
          >
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t("skills.topicProgress", "Прогресс, %")}
            name="progress"
            type="number"
            value={topicForm.progress}
            onChange={handleTopicFormChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            label={t("skills.topicEstimatedHours", "Оценка часов")}
            name="estimated_hours"
            type="number"
            value={topicForm.estimated_hours}
            onChange={handleTopicFormChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
          {topicFormError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {topicFormError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTopicModal}>
            {t("common.cancel", "Отмена")}
          </Button>
          <Button
            onClick={handleCreateTopic}
            variant="contained"
            color="primary"
            disabled={topicCreating}
          >
            {t("skills.create", "Создать")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Skills Statistics Overview */}
      {skillsStats && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("skills.generalStats")}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary">
                  {skillsStats.overview?.totalSkills || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t("skills.totalSkills")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="secondary">
                  {skillsStats.overview?.totalTopics || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t("skills.totalTopics")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main">
                  {skillsStats.overview?.averageProgress || 0}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t("skills.averageProgress")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="info.main">
                  {skillsStats.overview?.completedTopics || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t("skills.completedTopics")}
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
            <Grid
              item
              xs={12}
              md={6}
              key={skill.id}
              sx={{ display: "flex", minWidth: 300 }}
            >
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(skill)}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                  }}
                >
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
                      label={t(
                        `skills.categories.${(
                          skill.category?.name || ""
                        ).toLowerCase()}`,
                        t(
                          `skills.categories.${skill.category?.name}`,
                          skill.category?.name || t("skills.noCategory")
                        )
                      )}
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

                  {/* Publicity Toggle */}
                  <Box sx={{ mb: 2 }}>
                    <Tooltip title={t("skills.publicTooltip")}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={skill.is_public || false}
                            onChange={(e) =>
                              handlePublicityToggle(skill.id, e.target.checked)
                            }
                            disabled={updatingPublicity[skill.id] || false}
                            size="small"
                            onClick={(e) => e.stopPropagation()} // Предотвращаем открытие модального окна
                          />
                        }
                        label={t("skills.publicLabel")}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.875rem",
                            color: "text.secondary",
                          },
                        }}
                        onClick={(e) => e.stopPropagation()} // Предотвращаем открытие модального окна
                      />
                    </Tooltip>
                  </Box>

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
                        {t("skills.overallProgress")}
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
                        {t("skills.topics")} (
                        {skill.stats?.completedTopics || 0} {t("skills.outOf")}{" "}
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
                                label={t(
                                  `status.${(
                                    topic.status?.name || ""
                                  ).toLowerCase()}`,
                                  t(
                                    `status.${topic.status?.name}`,
                                    topic.status?.name || ""
                                  )
                                )}
                                size="small"
                                color={
                                  topic.progress === 100 ? "success" : "default"
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
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t("skills.noSkillsYet")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("skills.startCreating")}
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
  );
}
