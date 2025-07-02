import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";

/**
 * Хук для управления уведомлениями о достижениях
 */
export const useAchievementNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const socket = useSocket();

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
    if (socket) {
      socket.on("achievement_notification", handleAchievementNotification);

      return () => {
        socket.off("achievement_notification", handleAchievementNotification);
      };
    }
  }, [socket, handleAchievementNotification]);

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
    setIsNotificationOpen(false);
    setCurrentNotification(null);
  }, []);

  // Ручная отправка тестового уведомления (для разработки)
  const sendTestNotification = useCallback(
    (achievementData) => {
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

  return {
    currentNotification,
    isNotificationOpen,
    closeNotification,
    sendTestNotification, // Для тестирования
    notificationsCount: notifications.length,
  };
};

export default useAchievementNotifications;
