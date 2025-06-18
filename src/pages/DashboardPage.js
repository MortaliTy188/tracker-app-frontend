import React, { useState, useEffect } from "react";
import { useAuth, useSnackbar } from "../hooks";
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
} from "@mui/material";
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  Person,
  Timeline,
  Add,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { showError } = useSnackbar();

  // Mock data for dashboard
  const [dashboardData, setDashboardData] = useState({
    totalGoals: 12,
    completedGoals: 8,
    activeGoals: 3,
    totalTasks: 156,
    completedTasks: 124,
    hoursLearned: 42,
    currentStreak: 7,
    recentActivity: [
      {
        id: 1,
        action: "Завершена задача 'Изучить useState'",
        type: "task",
        time: "2 часа назад",
      },
      {
        id: 2,
        action: "Добавлена новая цель 'Node.js'",
        type: "goal",
        time: "5 часов назад",
      },
      {
        id: 3,
        action: "Завершена цель 'CSS Flexbox'",
        type: "goal",
        time: "1 день назад",
      },
      {
        id: 4,
        action: "Завершена задача 'Практика с Grid'",
        type: "task",
        time: "2 дня назад",
      },
    ],
    upcomingTasks: [
      {
        id: 1,
        title: "Изучить useEffect",
        dueDate: "Сегодня",
        priority: "high",
      },
      { id: 2, title: "Практика с API", dueDate: "Завтра", priority: "medium" },
      {
        id: 3,
        title: "Создать компонент Modal",
        dueDate: "3 дня",
        priority: "low",
      },
    ],
  });

  const progressPercentage = Math.round(
    (dashboardData.completedGoals / dashboardData.totalGoals) * 100
  );

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Для доступа к панели управления необходимо авторизоваться
          </Typography>
          <Button href="/login" variant="contained" sx={{ mt: 2 }}>
            Войти в систему
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Панель управления
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Добро пожаловать! Вот ваш прогресс обучения.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Assignment
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h4" color="primary.main">
                  {dashboardData.totalGoals}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего целей
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <CheckCircle
                  sx={{ fontSize: 40, color: "success.main", mb: 1 }}
                />
                <Typography variant="h4" color="success.main">
                  {dashboardData.completedGoals}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Завершено
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Schedule sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
                <Typography variant="h4" color="warning.main">
                  {dashboardData.hoursLearned}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Часов обучения
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUp
                  sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
                />
                <Typography variant="h4" color="secondary.main">
                  {dashboardData.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дней подряд
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Progress Overview */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Общий прогресс
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      {progressPercentage}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.completedGoals} из {dashboardData.totalGoals}{" "}
                  целей завершено
                </Typography>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Последняя активность
                </Typography>
                <List>
                  {dashboardData.recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemIcon>
                          {activity.type === "goal" ? (
                            <Assignment color="primary" />
                          ) : (
                            <CheckCircle color="success" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < dashboardData.recentActivity.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Upcoming Tasks */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ближайшие задачи
                </Typography>
                <List>
                  {dashboardData.upcomingTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={task.title}
                          secondary={task.dueDate}
                        />
                        <Chip
                          label={
                            task.priority === "high"
                              ? "Высокий"
                              : task.priority === "medium"
                              ? "Средний"
                              : "Низкий"
                          }
                          color={
                            task.priority === "high"
                              ? "error"
                              : task.priority === "medium"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </ListItem>
                      {index < dashboardData.upcomingTasks.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Добавить задачу
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Быстрые действия
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button variant="contained" startIcon={<Add />}>
                    Новая цель
                  </Button>
                  <Button variant="outlined" startIcon={<Assignment />}>
                    Добавить задачу
                  </Button>
                  <Button variant="outlined" startIcon={<Person />}>
                    Мой профиль
                  </Button>
                  <Button variant="outlined" startIcon={<Timeline />}>
                    Статистика
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
