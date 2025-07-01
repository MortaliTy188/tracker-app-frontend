import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

// Создаем axios instance для API запросов
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем token в заголовки
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Получить историю сообщений с пользователем
 */
export const getMessages = async (userId, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/api/chat/messages/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * Отправить сообщение через REST API (для fallback)
 */
export const sendMessage = async (
  receiverId,
  content,
  messageType = "text"
) => {
  try {
    const response = await api.post("/api/chat/send", {
      receiverId,
      content,
      messageType,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Отметить сообщения как прочитанные
 */
export const markMessagesAsRead = async (userId) => {
  try {
    const response = await api.post(`/api/chat/mark-read/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

/**
 * Получить список чатов (последние сообщения с каждым пользователем)
 */
export const getChats = async () => {
  try {
    const response = await api.get("/api/chat/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

/**
 * Получить количество непрочитанных сообщений
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get("/api/chat/unread-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

/**
 * Поиск сообщений
 */
export const searchMessages = async (query, userId = null) => {
  try {
    const response = await api.get("/api/chat/search", {
      params: { query, userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching messages:", error);
    throw error;
  }
};
