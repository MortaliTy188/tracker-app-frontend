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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
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
      console.log("✅ Socket object:", newSocket);
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
        console.log(`💬 Joining chat with user ${otherUserId}`);
        console.log(`💬 Socket ID: ${socketRef.current.id}`);
        socketRef.current.emit("join_chat", { otherUserId });
      } else {
        console.log("❌ Cannot join chat: socket not connected");
        console.log(`❌ Socket exists: ${!!socketRef.current}`);
        console.log(`❌ Is connected: ${isConnected}`);
      }
    },
    [isConnected]
  );

  // Отправка сообщения
  const sendMessage = useCallback(
    (receiverId, content, messageType = "text") => {
      if (socketRef.current && isConnected) {
        console.log(`📤 Sending message to ${receiverId}:`, content);
        console.log(`📤 Socket ID: ${socketRef.current.id}`);
        socketRef.current.emit("send_message", {
          receiverId,
          content,
          messageType,
        });
      } else {
        console.log("❌ Cannot send message: socket not connected");
        console.log(`❌ Socket exists: ${!!socketRef.current}`);
        console.log(`❌ Is connected: ${isConnected}`);
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
  const on = useCallback(
    (event, callback) => {
      if (socket) {
        console.log(`📡 Subscribing to event: ${event}`);
        socket.on(event, callback);
      }
    },
    [socket]
  );

  // Отписка от событий
  const off = useCallback(
    (event, callback) => {
      if (socket) {
        console.log(`📡 Unsubscribing from event: ${event}`);
        socket.off(event, callback);
      }
    },
    [socket]
  );

  // Автоматическое подключение при монтировании
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token && !socketRef.current?.connected) {
      console.log("🔌 Автоматическое подключение к socket...");
      connect();
    }
  }, [connect]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket,
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
