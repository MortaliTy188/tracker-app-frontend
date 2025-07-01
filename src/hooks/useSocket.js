import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

/**
 * Хук для управления Socket.IO соединением
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  // Инициализация соединения
  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    console.log("🔌 Attempting to connect to socket...");
    console.log("🔌 Socket URL:", SOCKET_URL);
    console.log("🔌 Token available:", !!token);

    if (!token) {
      console.warn("❌ No token found, cannot connect to socket");
      return;
    }

    if (socketRef.current?.connected) {
      console.log("✅ Socket already connected");
      return;
    }

    console.log("🔌 Creating new socket connection...");
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Обработка статуса пользователей
    newSocket.on("user_status", (data) => {
      const { userId, status } = data;
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (status === "online") {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  }, []);

  // Отключение
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers(new Set());
    }
  }, []);

  // Переподключение
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  // Присоединение к чату
  const joinChat = useCallback(
    (otherUserId) => {
      if (socketRef.current && isConnected) {
        console.log(`Joining chat with user ${otherUserId}`);
        socketRef.current.emit("join_chat", { otherUserId });
      }
    },
    [isConnected]
  );

  // Отправка сообщения
  const sendMessage = useCallback(
    (receiverId, content, messageType = "text") => {
      if (socketRef.current && isConnected) {
        console.log(`Sending message to ${receiverId}:`, content);
        socketRef.current.emit("send_message", {
          receiverId,
          content,
          messageType,
        });
      }
    },
    [isConnected]
  );

  // Уведомление о начале печатания
  const startTyping = useCallback(
    (receiverId) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("typing_start", { receiverId });
      }
    },
    [isConnected]
  );

  // Уведомление об окончании печатания
  const stopTyping = useCallback(
    (receiverId) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("typing_stop", { receiverId });
      }
    },
    [isConnected]
  );

  // Отметить сообщения как прочитанные
  const markAsRead = useCallback(
    (senderId) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("mark_as_read", { senderId });
      }
    },
    [isConnected]
  );

  // Подписка на события
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  // Отписка от событий
  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    reconnect,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    on,
    off,
  };
};
