import React from "react";
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
} from "@mui/material";

/**
 * Компонент вкладки навыков
 */
export default function SkillsTab({
  skills,
  skillsStats,
  skillsLoading,
  skillsError,
}) {
  if (skillsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
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
                      <Typography variant="body2">Общий прогресс</Typography>
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
                  У вас пока нет навыков
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Начните создавать навыки для отслеживания своего прогресса
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
