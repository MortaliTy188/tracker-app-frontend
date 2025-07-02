import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSocket } from "../hooks/useSocket";

const AchievementNotificationContext = createContext();

/**
 * Провайдер для управления уведомлениями о достижениях
 */
export const AchievementNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const socketData = useSocket(); // Получаем объект с socket и методами

  // Обработчик получения уведомления о достижении
  const handleAchievementNotification = useCallback((data) => {
    console.log("🎉 Получено уведомление о достижении:", data);

    // Добавляем уведомление в очередь
    const notification = {
      id: Date.now() + Math.random(), // Уникальный ID
      ...data,
      timestamp: new Date(),
    };

    setNotifications((prev) => [...prev, notification]);
  }, []);

  // Подписка на события Socket.IO
  useEffect(() => {
    const socket = socketData?.socket; // Извлекаем socket объект

    if (socket && socketData.isConnected) {
      console.log(
        "🔌 Socket подключен, подписываемся на achievement_notification"
      );
      console.log("🔌 Socket object:", socket);
      console.log("🔌 Socket connected:", socket.connected);
      console.log("🔌 Socket id:", socket.id);

      socket.on("achievement_notification", handleAchievementNotification);

      return () => {
        console.log("🔌 Отписываемся от achievement_notification");
        socket.off("achievement_notification", handleAchievementNotification);
      };
    } else {
      console.log("❌ Socket не подключен или не готов");
      console.log("🔌 Socket data:", socketData);
    }
  }, [
    socketData?.socket,
    socketData?.isConnected,
    handleAchievementNotification,
  ]);

  // Обработка очереди уведомлений
  useEffect(() => {
    console.log(
      "🔄 Notifications queue changed:",
      notifications.length,
      "isOpen:",
      isNotificationOpen
    );
    if (notifications.length > 0 && !isNotificationOpen) {
      const nextNotification = notifications[0];
      console.log("📄 Processing notification:", nextNotification);
      setCurrentNotification(nextNotification);
      setIsNotificationOpen(true);

      // Удаляем обработанное уведомление из очереди
      setNotifications((prev) => prev.slice(1));
    }
  }, [notifications, isNotificationOpen]);

  // Закрытие текущего уведомления
  const closeNotification = useCallback(() => {
    console.log("❌ Closing notification");
    setIsNotificationOpen(false);
    setCurrentNotification(null);
  }, []);

  // Ручная отправка тестового уведомления (для разработки)
  const sendTestNotification = useCallback(
    (achievementData) => {
      console.log("🧪 Sending test notification:", achievementData);
      const testNotification = {
        type: "achievement_earned",
        achievement: {
          id: Date.now(),
          name: "Тестовое достижение",
          description: "Это тестовое уведомление для проверки анимации",
          icon: "celebration",
          points: 100,
          rarity: "epic",
          earnedAt: new Date(),
          ...achievementData,
        },
        message: "🎉 Поздравляем! Вы получили достижение!",
      };

      handleAchievementNotification(testNotification);
    },
    [handleAchievementNotification]
  );

  const value = {
    currentNotification,
    isNotificationOpen,
    closeNotification,
    sendTestNotification,
    notificationsCount: notifications.length,
  };

  return (
    <AchievementNotificationContext.Provider value={value}>
      {children}
    </AchievementNotificationContext.Provider>
  );
};

/**
 * Хук для использования контекста уведомлений о достижениях
 */
export const useAchievementNotifications = () => {
  const context = useContext(AchievementNotificationContext);
  if (!context) {
    throw new Error(
      "useAchievementNotifications must be used within AchievementNotificationProvider"
    );
  }
  return context;
};

export default AchievementNotificationProvider;
