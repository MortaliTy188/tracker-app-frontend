import { useState, useCallback } from "react";
import { getUserActivity } from "../api/userApi";

/**
 * Хук для работы с историей активности пользователя
 * @returns {Object} Объект с данными и методами для работы с активностью
 */
export const useActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Загрузить историю активности пользователя
   */
  const loadActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserActivity();

      if (result.success) {
        setActivities(result.data || []);
      } else {
        setError(result.message);
        // При ошибке API все равно устанавливаем fallback данные
        setActivities(result.data || []);
      }
    } catch (error) {
      setError("Не удалось загрузить историю активности");
      setActivities([]); // Устанавливаем пустой массив при ошибке
      console.error("Error loading activity:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Получить активность по типу
   * @param {string} actionType - Тип действия
   * @returns {Array} Отфильтрованный массив активности
   */
  const getActivitiesByType = useCallback(
    (actionType) => {
      return Array.isArray(activities)
        ? activities.filter((activity) => activity.action === actionType)
        : [];
    },
    [activities]
  );

  /**
   * Получить последние активности
   * @param {number} limit - Лимит записей
   * @returns {Array} Массив последних активностей
   */
  const getRecentActivities = useCallback(
    (limit = 10) => {
      return Array.isArray(activities) ? activities.slice(0, limit) : [];
    },
    [activities]
  );

  /**
   * Получить активности за определенный период
   * @param {number} days - Количество дней назад
   * @returns {Array} Массив активностей за период
   */
  const getActivitiesForPeriod = useCallback(
    (days = 7) => {
      if (!Array.isArray(activities)) return [];

      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - days);

      return activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= periodStart;
      });
    },
    [activities]
  );

  return {
    // Данные с защитой типов
    activities: Array.isArray(activities) ? activities : [],
    isLoading,
    error,

    // Методы загрузки
    loadActivity,

    // Методы фильтрации
    getActivitiesByType,
    getRecentActivities,
    getActivitiesForPeriod,
  };
};
