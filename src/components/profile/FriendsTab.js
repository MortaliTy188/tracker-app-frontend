import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  LinearProgress,
  List,
  ListItem,
  Avatar,
  ListItemText,
  IconButton,
  Badge,
  Chip,
} from "@mui/material";
import {
  PersonAdd,
  Notifications,
  Check,
  Close,
  People,
  Message,
  Send,
} from "@mui/icons-material";
import { getAvatarUrl } from "../../utils/avatarUtils";

/**
 * Компонент вкладки друзей
 * Соответствует оригинальной реализации Friends tab из ProfilePage
 */
export default function FriendsTab({
  friends,
  pendingRequests,
  sentRequests,
  friendshipLoading,
  onFindFriendsOpen,
  onSentRequestsOpen,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onRemoveFriend,
  showSuccess,
  showError,
  loadFriends,
  loadPendingRequests,
  loadSentRequests,
}) {
  if (friendshipLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          👥 Мои друзья
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={onFindFriendsOpen}
          >
            Найти друзей
          </Button>
          {sentRequests && sentRequests.length > 0 && (
            <Button
              variant="outlined"
              color="info"
              startIcon={<Send />}
              onClick={onSentRequestsOpen}
            >
              Исходящие запросы ({sentRequests.length})
            </Button>
          )}
          {pendingRequests && pendingRequests.length > 0 && (
            <Badge badgeContent={pendingRequests.length} color="warning">
              <Chip
                icon={<Notifications />}
                label="Новые запросы"
                color="warning"
                variant="outlined"
              />
            </Badge>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Уведомления о входящих запросах */}
        {pendingRequests && pendingRequests.length > 0 && (
          <Grid item xs={12}>
            <Alert
              severity="info"
              sx={{
                mb: 2,
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="body1" component="span">
                  У вас {pendingRequests.length} новых запросов на дружбу
                </Typography>
              </Box>
            </Alert>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Входящие запросы на дружбу
                </Typography>
                <List>
                  {pendingRequests.map((request) => (
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
                        src={getAvatarUrl(request.requester.avatar)}
                        sx={{ mr: 2 }}
                      >
                        {(
                          request.requester.firstName ||
                          request.requester.username ||
                          request.requester.name ||
                          ""
                        ).charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={
                          request.requester.firstName &&
                          request.requester.lastName
                            ? `${request.requester.firstName} ${request.requester.lastName}`
                            : request.requester.username ||
                              request.requester.name
                        }
                        secondary={`Уровень ${
                          request.requester.level
                        } • ${new Date(request.requestDate).toLocaleDateString(
                          "ru-RU"
                        )}`}
                      />
                      <Box>
                        <IconButton
                          color="success"
                          onClick={() =>
                            onAcceptFriendRequest(request.friendshipId).then(
                              (result) => {
                                if (result.success) {
                                  showSuccess("Запрос принят");
                                  loadFriends();
                                  loadPendingRequests();
                                  loadSentRequests(); // Обновить исходящие запросы на случай взаимного запроса
                                } else {
                                  showError(result.message);
                                }
                              }
                            )
                          }
                          title="Принять"
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            onDeclineFriendRequest(request.friendshipId).then(
                              (result) => {
                                if (result.success) {
                                  showSuccess("Запрос отклонен");
                                  loadPendingRequests();
                                } else {
                                  showError(result.message);
                                }
                              }
                            )
                          }
                          title="Отклонить"
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Основной список друзей */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Список друзей</Typography>
                <Chip
                  label={`${friends?.length || 0} друзей`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {!friends || friends.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    color: "text.secondary",
                  }}
                >
                  <People sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" gutterBottom>
                    У вас пока нет друзей
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Найдите пользователей и отправьте им запросы на дружбу
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={onFindFriendsOpen}
                  >
                    Найти друзей
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {friends.map((friend) => (
                    <Grid item xs={12} sm={6} md={4} key={friend.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: 2,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              src={getAvatarUrl(friend.avatar)}
                              sx={{
                                mr: 2,
                                width: 56,
                                height: 56,
                                border: "2px solid",
                                borderColor: "primary.main",
                              }}
                            >
                              {(
                                friend.firstName ||
                                friend.username ||
                                friend.name ||
                                ""
                              ).charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div">
                                {friend.firstName && friend.lastName
                                  ? `${friend.firstName} ${friend.lastName}`
                                  : friend.username || friend.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={`Уровень ${friend.level}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 2 }}
                          >
                            Друзья с{" "}
                            {new Date(friend.friendsSince).toLocaleDateString(
                              "ru-RU"
                            )}
                          </Typography>
                        </CardContent>

                        <CardActions
                          sx={{
                            justifyContent: "space-between",
                            px: 2,
                            pb: 2,
                          }}
                        >
                          <Button
                            size="small"
                            startIcon={<Message />}
                            variant="outlined"
                            onClick={() => {
                              // Здесь можно добавить функцию отправки сообщения
                              showSuccess("Функция чата будет добавлена позже");
                            }}
                          >
                            Написать
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Вы уверены, что хотите удалить ${
                                    friend.firstName && friend.lastName
                                      ? `${friend.firstName} ${friend.lastName}`
                                      : friend.username || friend.name
                                  } из друзей?`
                                )
                              ) {
                                onRemoveFriend(friend.friendshipId).then(
                                  (result) => {
                                    if (result.success) {
                                      showSuccess("Друг удален");
                                      loadFriends();
                                    } else {
                                      showError(result.message);
                                    }
                                  }
                                );
                              }
                            }}
                          >
                            Удалить
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
