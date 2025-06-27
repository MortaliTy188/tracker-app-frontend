import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  List,
  ListItem,
  Avatar,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { PersonAdd, Check, Close } from "@mui/icons-material";

const FindFriendsDialog = ({
  open,
  onClose,
  allUsers,
  usersLoading,
  usersError,
  userSearch,
  onUserSearchChange,
  paginatedUsers,
  usersPage,
  totalUsersPages,
  onUsersPageChange,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  showSuccess,
  showError,
  loadFriends,
  loadPendingRequests,
  fetchAllUsers,
}) => {
  // Локальное состояние для оптимистичных обновлений
  const [localFriendshipUpdates, setLocalFriendshipUpdates] = useState({});

  // Функция для получения актуального статуса дружбы с учетом локальных обновлений
  const getFriendshipStatus = (user) => {
    const hasLocalUpdate = localFriendshipUpdates[user.id];
    const originalStatus = user.friendship?.status;
    const finalStatus = hasLocalUpdate
      ? localFriendshipUpdates[user.id]
      : originalStatus;

    if (hasLocalUpdate) {
      console.log(
        `🔄 User ${user.id} (${user.name}): Original status: ${originalStatus}, Local update: ${hasLocalUpdate}, Final: ${finalStatus}`
      );
    }

    if (localFriendshipUpdates[user.id]) {
      return {
        ...user.friendship,
        status: localFriendshipUpdates[user.id],
      };
    }
    return user.friendship;
  };

  // Обработчик закрытия диалога с очисткой локальных обновлений
  const handleClose = () => {
    setLocalFriendshipUpdates({});
    onClose();
  };
  const handleSendRequest = async (userId) => {
    console.log("🟡 HandleSendRequest - User ID:", userId);

    // Оптимистичное обновление - сразу меняем статус на "sent_request"
    setLocalFriendshipUpdates((prev) => {
      console.log("🟡 Setting optimistic update for user:", userId);
      return {
        ...prev,
        [userId]: "sent_request",
      };
    });

    const result = await onSendFriendRequest(userId);
    console.log("🟡 Friend request result:", result);

    if (result.success) {
      showSuccess("Запрос на дружбу отправлен");

      // Ждем обновления списка пользователей
      console.log("🟡 Fetching updated users...");
      await fetchAllUsers();
      console.log("🟡 Users updated");

      // Ждем немного и проверяем, обновился ли статус в реальных данных
      setTimeout(() => {
        console.log("🟡 Checking if server data updated for user:", userId);
        // Проверяем текущие данные пользователя
        const currentUser = paginatedUsers.find((u) => u.id === userId);
        if (currentUser && currentUser.friendship?.status === "sent_request") {
          console.log("🟡 Server data updated, clearing local update");
          // Данные обновились на сервере, можно очистить локальное обновление
          setLocalFriendshipUpdates((prev) => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        } else {
          console.log("🟡 Server data not yet updated, keeping local update");
        }
      }, 2000); // Увеличиваем задержку до 2 секунд
    } else {
      // Если ошибка, откатываем оптимистичное обновление
      setLocalFriendshipUpdates((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      showError(result.message);
    }
  };

  const handleAcceptRequest = async (friendshipId, userId) => {
    // Оптимистичное обновление
    setLocalFriendshipUpdates((prev) => ({
      ...prev,
      [userId]: "accepted",
    }));

    const result = await onAcceptFriendRequest(friendshipId);
    if (result.success) {
      showSuccess("Запрос принят");
      // Ждем обновления всех данных
      await Promise.all([
        fetchAllUsers(),
        loadFriends(),
        loadPendingRequests(),
      ]);
      setLocalFriendshipUpdates((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } else {
      // Откатываем при ошибке
      setLocalFriendshipUpdates((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      showError(result.message);
    }
  };

  const handleDeclineRequest = async (friendshipId, userId) => {
    // Оптимистичное обновление
    setLocalFriendshipUpdates((prev) => ({
      ...prev,
      [userId]: "none",
    }));

    const result = await onDeclineFriendRequest(friendshipId);
    if (result.success) {
      showSuccess("Запрос отклонен");
      // Ждем обновления данных
      await Promise.all([fetchAllUsers(), loadPendingRequests()]);
      setLocalFriendshipUpdates((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } else {
      // Откатываем при ошибке
      setLocalFriendshipUpdates((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      showError(result.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Найти друзей</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Поиск пользователей"
            variant="outlined"
            value={userSearch}
            onChange={onUserSearchChange}
            placeholder="Введите имя пользователя..."
          />
        </Box>

        {usersLoading && <LinearProgress sx={{ mb: 2 }} />}

        {usersError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {usersError}
          </Alert>
        )}

        {!usersLoading && paginatedUsers.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            {userSearch
              ? "Пользователи не найдены"
              : "Нет доступных пользователей"}
          </Typography>
        )}

        {!usersLoading && paginatedUsers.length > 0 && (
          <List>
            {paginatedUsers.map((user) => {
              const friendshipStatus = getFriendshipStatus(user);

              return (
                <ListItem
                  key={user.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={user.avatar}
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
                        {user.isPrivate && (
                          <Chip
                            label="Приватный профиль"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {friendshipStatus?.status === "none" && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PersonAdd />}
                          onClick={() => handleSendRequest(user.id)}
                        >
                          Добавить в друзья
                        </Button>
                      )}
                      {friendshipStatus?.status === "sent_request" && (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled
                          color="warning"
                        >
                          Запрос отправлен
                        </Button>
                      )}
                      {friendshipStatus?.status === "received_request" && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleAcceptRequest(
                                friendshipStatus.friendshipId,
                                user.id
                              )
                            }
                          >
                            Принять
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeclineRequest(
                                friendshipStatus.friendshipId,
                                user.id
                              )
                            }
                          >
                            Отклонить
                          </Button>
                        </Box>
                      )}
                      {friendshipStatus?.status === "accepted" && (
                        <Chip
                          label="Уже друзья"
                          size="small"
                          color="success"
                          icon={<Check />}
                        />
                      )}
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}

        {/* Pagination */}
        {totalUsersPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Pagination
              count={totalUsersPages}
              page={usersPage}
              onChange={onUsersPageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FindFriendsDialog;
