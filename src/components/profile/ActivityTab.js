import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Pagination,
  Box,
  LinearProgress,
  Divider,
  Alert,
} from "@mui/material";
import {
  EmojiEvents,
  Assignment,
  Security,
  History,
  GroupAdd,
} from "@mui/icons-material";

/**
 * Получить переведенное описание активности
 */
const getActivityDescription = (activity, t) => {
  const action = activity.action;
  const details = activity.details || {};
  
  // Получаем базовое описание действия
  const baseDescription = t(`activity.actions.${action}`, { defaultValue: action });
  
  // Добавляем детали в зависимости от типа действия
  switch (action) {
    case 'TOPIC_CREATED':
    case 'TOPIC_COMPLETED':
    case 'TOPIC_UPDATED':
      return details.topicName 
        ? `${baseDescription}: "${details.topicName}"` 
        : baseDescription;
        
    case 'NOTE_CREATED':
    case 'NOTE_UPDATED':
    case 'NOTE_DELETED':
      return details.noteTitle 
        ? `${baseDescription}: "${details.noteTitle}"` 
        : baseDescription;
        
    case 'SKILL_CREATED':
    case 'SKILL_UPDATED':
    case 'SKILL_DELETED':
      return details.skillName 
        ? `${baseDescription}: "${details.skillName}"` 
        : baseDescription;
        
    case 'ACHIEVEMENT_EARNED':
      return details.achievementName 
        ? `${baseDescription}: "${details.achievementName}"` 
        : baseDescription;
        
    default:
      return baseDescription;
  }
};

/**
 * Получить иконку для статуса активности
 */
const getActivityIcon = (status) => {
  switch (status) {
    case "success":
      return <EmojiEvents color="success" />;
    case "info":
      return <Assignment color="info" />;
    case "warning":
      return <Security color="warning" />;
    case "friendship":
      return <GroupAdd color="secondary" />;
    case "default":
      return <History color="action" />;
    default:
      return <History color="action" />;
  }
};

/**
 * Компонент вкладки истории активности
 */
export default function ActivityTab({
  activities,
  activityLoading,
  activityError,
  activityPage,
  onActivityPageChange,
  getPaginatedActivities,
  getTotalActivityPages,
  getStatusLabel,
  getStatusColor,
}) {
  const { t, i18n } = useTranslation();

  if (activityLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("activity.historyTitle")}
        </Typography>

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
                {t("activity.showing", {
                  current: getPaginatedActivities().length,
                  total: activities.length,
                })}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("activity.pageInfo", {
                  current: activityPage,
                  total: getTotalActivityPages(),
                })}
              </Typography>
            </Box>

            <List>
              {getPaginatedActivities().map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getActivityIcon(activity.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={getActivityDescription(activity, t)}
                      secondary={new Date(activity.date).toLocaleString(
                        i18n.language === "ru" ? "ru-RU" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    />
                    <Chip
                      label={getStatusLabel(activity.status)}
                      color={getStatusColor(activity.status)}
                      size="small"
                    />
                  </ListItem>
                  {index < getPaginatedActivities().length - 1 && <Divider />}
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
                  onChange={onActivityPageChange}
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
            <History sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              {t("activity.emptyHistory")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("activity.actionsWillShow")}
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
  );
}
