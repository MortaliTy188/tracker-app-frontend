import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Divider,
  Badge,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Send,
  Close,
  Circle,
  EmojiEmotions,
  AttachFile,
} from "@mui/icons-material";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { useSocket } from "../../hooks/useSocket";
import { getMessages } from "../../api/chatApi";

/**
 * Компонент чата между пользователями
 */
const ChatDialog = ({
  open,
  onClose,
  friend, // объект друга с которым ведется переписка
  currentUser,
}) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const messagesEndRef = useRef(null);
  const textFieldRef = useRef(null);

  const {
    isConnected,
    onlineUsers,
    connect,
    joinChat,
    sendMessage: socketSendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    on,
    off,
    socket,
  } = useSocket();

  // Функция для очистки временных сообщений
  const clearTemporaryMessages = useCallback(() => {
    setMessages((prev) => prev.filter((msg) => !msg.isTemporary));
  }, []);

  // Очистка временных сообщений при отключении сокета
  useEffect(() => {
    if (!isConnected) {
      // Задержка для очистки временных сообщений если сокет отключился
      const timeoutId = setTimeout(() => {
        console.log("🧹 Clearing temporary messages due to disconnection");
        clearTemporaryMessages();
      }, 5000); // 5 секунд ожидания

      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, clearTemporaryMessages]);

  // Загрузка истории сообщений
  const loadMessages = useCallback(async () => {
    if (!friend?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getMessages(friend.id);
      if (response.success) {
        setMessages(response.data.messages || []);
      } else {
        setError(response.message || "Ошибка загрузки сообщений");
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Не удалось загрузить сообщения");
    } finally {
      setLoading(false);
    }
  }, [friend?.id]);

  // Прокрутка к последнему сообщению
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Отправка сообщения
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !friend?.id || !currentUser?.id) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    console.log("📤 Sending message:", messageContent);
    console.log("📤 To friend ID:", friend.id);
    console.log("📤 Socket connected:", isConnected);

    // Отправляем через Socket.IO если подключен
    if (isConnected) {
      console.log("📤 Using socket to send message");
      socketSendMessage(friend.id, messageContent);
    } else {
      console.log("❌ Socket not connected, cannot send message");
      // Если сокет не подключен, не добавляем временное сообщение
      return;
    }

    // Добавляем сообщение локально для мгновенного отображения
    const tempMessage = {
      id: `temp_${Date.now()}`, // временный ID с префиксом
      sender_id: currentUser.id,
      receiver_id: friend.id,
      content: messageContent,
      message_type: "text",
      is_read: false,
      created_at: new Date().toISOString(),
      sender: currentUser,
      isTemporary: true, // флаг временного сообщения
    };

    console.log("📤 Adding temp message locally:", tempMessage);
    setMessages((prev) => [...prev, tempMessage]);

    // Устанавливаем таймаут для удаления временного сообщения если оно не заменено
    const tempMessageTimeout = setTimeout(() => {
      console.log("⏰ Timeout: removing temp message that wasn't replaced");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }, 10000); // 10 секунд

    // Сохраняем ссылку на таймаут для возможной очистки
    tempMessage.timeoutId = tempMessageTimeout;

    // Останавливаем индикатор печатания
    if (isConnected) {
      stopTyping(friend.id);
    }
  }, [
    newMessage,
    friend?.id,
    currentUser?.id,
    isConnected,
    socketSendMessage,
    stopTyping,
  ]);

  // Обработка нажатия Enter
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Обработка изменения текста (индикатор печатания)
  const handleMessageChange = useCallback(
    (event) => {
      const value = event.target.value;
      setNewMessage(value);

      if (isConnected && friend?.id) {
        // Начинаем печатание
        startTyping(friend.id);

        // Сбрасываем предыдущий таймер
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        // Останавливаем печатание через 2 секунды
        const timeout = setTimeout(() => {
          stopTyping(friend.id);
        }, 2000);

        setTypingTimeout(timeout);
      }
    },
    [friend?.id, isConnected, startTyping, stopTyping, typingTimeout]
  );

  // Подключение к Socket.IO при открытии диалога
  useEffect(() => {
    if (open && friend?.id) {
      if (!isConnected) {
        connect();
      }
    }
  }, [open, friend?.id, isConnected, connect]);

  // Присоединение к чату при подключении
  useEffect(() => {
    if (isConnected && friend?.id) {
      joinChat(friend.id);
      loadMessages();
    }
  }, [isConnected, friend?.id, joinChat, loadMessages]);

  // Подписка на события сообщений
  useEffect(() => {
    if (!isConnected || !socket) {
      console.log("❌ Cannot subscribe to events: not connected or no socket");
      return;
    }

    console.log("📡 Setting up message event handlers");

    const handleNewMessage = (message) => {
      console.log("📨 New message received:", message);
      console.log(
        "👤 Current friend ID:",
        friend?.id,
        "type:",
        typeof friend?.id
      );
      console.log(
        "👤 Current user ID:",
        currentUser?.id,
        "type:",
        typeof currentUser?.id
      );
      console.log(
        "👤 Message sender ID:",
        message.sender_id,
        "type:",
        typeof message.sender_id
      );
      console.log(
        "👤 Message receiver ID:",
        message.receiver_id,
        "type:",
        typeof message.receiver_id
      );

      // Приводим все ID к числам для корректного сравнения
      const friendId = Number(friend?.id);
      const currentUserId = Number(currentUser?.id);
      const senderId = Number(message.sender_id);
      const receiverId = Number(message.receiver_id);

      console.log("🔢 Converted IDs:", {
        friendId,
        currentUserId,
        senderId,
        receiverId,
      });

      const isFromFriend =
        senderId === friendId && receiverId === currentUserId;
      const isFromMe = senderId === currentUserId && receiverId === friendId;

      console.log("🔍 Comparison results:", {
        isFromFriend,
        isFromMe,
        match: isFromFriend || isFromMe,
      });

      if (isFromFriend || isFromMe) {
        console.log(
          "✅ Message matches current conversation, adding to messages"
        );
        setMessages((prev) => {
          // Проверяем, нет ли уже такого сообщения
          const exists = prev.find((msg) => msg.id === message.id);
          if (exists) {
            console.log("⚠️ Message already exists, skipping");
            return prev;
          }

          // Если это сообщение от нас, ищем и заменяем временное сообщение
          if (isFromMe) {
            const tempIndex = prev.findIndex(
              (msg) =>
                msg.isTemporary &&
                msg.content === message.content &&
                Number(msg.sender_id) === senderId &&
                Number(msg.receiver_id) === receiverId
            );

            if (tempIndex !== -1) {
              console.log("🔄 Replacing temporary message with real one");
              const tempMessage = prev[tempIndex];

              // Очищаем таймаут временного сообщения если он есть
              if (tempMessage.timeoutId) {
                clearTimeout(tempMessage.timeoutId);
              }

              const newMessages = [...prev];
              newMessages[tempIndex] = message;
              return newMessages;
            }
          }

          console.log("➕ Adding new message to state");
          return [...prev, message];
        });

        // Отмечаем как прочитанное если получили от друга
        if (senderId === friendId) {
          markAsRead(friend.id);
        }
      } else {
        console.log("❌ Message doesn't match current conversation, ignoring");
      }
    };

    const handleTypingStart = (data) => {
      if (data.userId === friend?.id) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = (data) => {
      if (data.userId === friend?.id) {
        setIsTyping(false);
      }
    };

    const handleMessageRead = (data) => {
      if (currentUser?.id && data.senderId === currentUser.id) {
        // Обновляем статус прочтения наших сообщений
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender_id === currentUser.id && msg.receiver_id === friend?.id
              ? { ...msg, is_read: true }
              : msg
          )
        );
      }
    };

    console.log("📡 Subscribing to socket events...");
    on("new_message", handleNewMessage);
    on("typing_start", handleTypingStart);
    on("typing_stop", handleTypingStop);
    on("message_read", handleMessageRead);
    console.log("✅ Socket events subscribed");

    return () => {
      console.log("📡 Unsubscribing from socket events...");
      off("new_message", handleNewMessage);
      off("typing_start", handleTypingStart);
      off("typing_stop", handleTypingStop);
      off("message_read", handleMessageRead);
      console.log("✅ Socket events unsubscribed");
    };
  }, [isConnected, friend?.id, currentUser?.id, markAsRead, on, off, socket]);

  // Прокрутка при новых сообщениях
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Отметка сообщений как прочитанных при открытии
  useEffect(() => {
    if (open && friend?.id && isConnected) {
      markAsRead(friend.id);
    }
  }, [open, friend?.id, isConnected, markAsRead]);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Очищаем таймауты всех временных сообщений
      setMessages((prev) => {
        prev.forEach((msg) => {
          if (msg.timeoutId) {
            clearTimeout(msg.timeoutId);
          }
        });
        return prev.filter((msg) => !msg.isTemporary);
      });
    };
  }, [typingTimeout]);

  if (!friend || !currentUser) return null;

  console.log("ChatDialog render:", {
    currentUser,
    friend,
    messagesCount: messages.length,
    firstMessageSender: messages[0]?.sender_id,
    currentUserId: currentUser?.id,
  });

  const isOnline = onlineUsers.has(friend.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { height: "70vh", display: "flex", flexDirection: "column" },
      }}
    >
      {/* Заголовок чата */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              color={isOnline ? "success" : "default"}
              variant="dot"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                src={getAvatarUrl(friend.avatar)}
                sx={{ mr: 2, width: 40, height: 40 }}
              >
                {(
                  friend.firstName ||
                  friend.username ||
                  friend.name ||
                  ""
                ).charAt(0)}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" component="div">
                {friend.firstName && friend.lastName
                  ? `${friend.firstName} ${friend.lastName}`
                  : friend.username || friend.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Circle
                  sx={{
                    fontSize: 8,
                    color: isOnline ? "success.main" : "grey.400",
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {isOnline ? t("chat.online") : t("chat.offline")}
                </Typography>
                {!isConnected && (
                  <Chip
                    label={t("chat.connecting")}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Область сообщений */}
      <DialogContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}
      >
        {loading && (
          <Box sx={{ p: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Список сообщений */}
        <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
          {messages.length === 0 && !loading ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">{t("chat.noMessages")}</Typography>
              <Typography variant="caption">
                {t("chat.startConversation")}
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => {
              const isOwn =
                currentUser?.id &&
                String(message.sender_id) === String(currentUser.id);
              console.log("Message debug:", {
                messageId: message.id,
                senderId: message.sender_id,
                currentUserId: currentUser?.id,
                isOwn,
                senderIdType: typeof message.sender_id,
                currentUserIdType: typeof currentUser?.id,
              });
              const showAvatar =
                index === 0 ||
                messages[index - 1].sender_id !== message.sender_id;

              return (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: isOwn ? "flex-end" : "flex-start",
                    mb: 1,
                    alignItems: "flex-end",
                  }}
                >
                  {!isOwn && showAvatar && (
                    <Avatar
                      src={getAvatarUrl(friend.avatar)}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {(
                        friend.firstName ||
                        friend.username ||
                        friend.name ||
                        ""
                      ).charAt(0)}
                    </Avatar>
                  )}
                  {!isOwn && !showAvatar && <Box sx={{ width: 32, mr: 1 }} />}

                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: "70%",
                      backgroundColor: isOwn ? "primary.main" : "grey.100",
                      color: isOwn ? "primary.contrastText" : "text.primary",
                      borderRadius: 2,
                      borderBottomRightRadius: isOwn ? 4 : 12,
                      borderBottomLeftRadius: isOwn ? 12 : 4,
                      opacity: message.isTemporary ? 0.6 : 1, // Полупрозрачность для временных сообщений
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          fontSize: "0.7rem",
                        }}
                      >
                        {new Date(message.created_at).toLocaleTimeString(
                          i18n.language === "ru" ? "ru-RU" : "en-US",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </Typography>
                      {isOwn && (
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            fontSize: "0.7rem",
                            ml: 1,
                          }}
                        >
                          {message.is_read ? "✓✓" : "✓"}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Box>
              );
            })
          )}

          {/* Индикатор печатания */}
          {isTyping && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar
                src={getAvatarUrl(friend.avatar)}
                sx={{ width: 32, height: 32, mr: 1 }}
              >
                {(
                  friend.firstName ||
                  friend.username ||
                  friend.name ||
                  ""
                ).charAt(0)}
              </Avatar>
              <Paper
                sx={{ p: 1, backgroundColor: "grey.100", borderRadius: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CircularProgress size={12} />
                  <Typography variant="caption" color="text.secondary">
                    {t("chat.typing")}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Поле ввода сообщения */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            <TextField
              ref={textFieldRef}
              fullWidth
              multiline
              maxRows={4}
              placeholder={t("chat.typeMessage")}
              value={newMessage}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              disabled={!isConnected}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              color="primary"
              sx={{ mb: 0.5 }}
            >
              <Send />
            </IconButton>
          </Box>

          {!isConnected && (
            <Typography
              variant="caption"
              color="warning.main"
              sx={{ mt: 1, display: "block" }}
            >
              {t("chat.disconnected")}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
