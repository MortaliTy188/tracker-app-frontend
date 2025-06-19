import { useState, useEffect, useCallback } from "react";
import {
  getAchievementsProgress,
  getAchievementDetails,
  getAchievementsStats,
} from "../api/achievementsApi";

/**
 * Хук для работы с достижениями пользователя
 * @returns {Object} Объект с данными и методами для работы с достижениями
 */
export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  /**
   * Вычислить статистику на основе загруженных достижений
   */
  const calculateStatsFromAchievements = useCallback((achievementsList) => {
    if (!Array.isArray(achievementsList) || achievementsList.length === 0) {
      return null;
    }

    const totalAchievements = achievementsList.length;
    const completedAchievements = achievementsList.filter(
      (a) => a.isCompleted
    ).length;
    const totalPoints = achievementsList.reduce(
      (sum, a) => sum + (a.points || 0),
      0
    );
    const earnedPoints = achievementsList
      .filter((a) => a.isCompleted)
      .reduce((sum, a) => sum + (a.points || 0), 0);
    const completionRate =
      totalAchievements > 0
        ? (completedAchievements / totalAchievements) * 100
        : 0;

    // Группировка по категориям
    const categories = {};
    achievementsList.forEach((achievement) => {
      const category = achievement.category || "other";
      if (!categories[category]) {
        categories[category] = { completed: 0, total: 0 };
      }
      categories[category].total++;
      if (achievement.isCompleted) {
        categories[category].completed++;
      }
    });

    return {
      totalAchievements,
      completedAchievements,
      totalPoints,
      earnedPoints,
      completionRate,
      categories,
    };
  }, []);

  /**
   * Загрузить все достижения с прогрессом
   */
  const loadAchievements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAchievementsProgress();

      if (result.success) {
        const achievementsList = result.data || [];
        setAchievements(achievementsList);
        // Автоматически вычисляем статистику
        const calculatedStats =
          calculateStatsFromAchievements(achievementsList);
        setStats(calculatedStats);
      } else {
        setError(result.message);
        // При ошибке API все равно устанавливаем fallback данные
        const fallbackData = result.data || [];
        setAchievements(fallbackData);
        const calculatedStats = calculateStatsFromAchievements(fallbackData);
        setStats(calculatedStats);
      }
    } catch (error) {
      setError("Не удалось загрузить достижения");
      setAchievements([]); // Устанавливаем пустой массив при ошибке
      setStats(null);
      console.error("Error loading achievements:", error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateStatsFromAchievements]);
  /**
   * Загрузить статистику по достижениям (теперь вычисляется автоматически)
   * Эта функция оставлена для совместимости
   */
  const loadStats = useCallback(async () => {
    // Статистика теперь вычисляется автоматически в loadAchievements
    // Но можно дополнительно загрузить статистику с сервера если нужно
    try {
      const result = await getAchievementsStats();
      if (result.success && result.data) {
        // Если сервер возвращает свою статистику, используем её
        setStats(result.data);
      }
      // Если нет - используем вычисленную в loadAchievements
    } catch (error) {
      console.error("Error loading achievement stats:", error);
      // При ошибке используем уже вычисленную статистику
    }
  }, []);

  /**
   * Получить детали конкретного достижения
   * @param {number|string} achievementId - ID достижения
   * @returns {Promise<Object>} Данные о достижении
   */
  const getAchievement = useCallback(async (achievementId) => {
    try {
      const result = await getAchievementDetails(achievementId);
      return result;
    } catch (error) {
      console.error("Error getting achievement details:", error);
      return { success: false, data: null, message: error.message };
    }
  }, []);

  /**
   * Получить достижения по категории
   * @param {string} category - Категория достижений
   * @returns {Array} Отфильтрованный массив достижений
   */
  const getAchievementsByCategory = useCallback(
    (category) => {
      return achievements.filter(
        (achievement) => achievement.category === category
      );
    },
    [achievements]
  );

  /**
   * Получить завершенные достижения
   * @returns {Array} Массив завершенных достижений
   */
  const getCompletedAchievements = useCallback(() => {
    return achievements.filter((achievement) => achievement.isCompleted);
  }, [achievements]);

  /**
   * Получить незавершенные достижения
   * @returns {Array} Массив незавершенных достижений
   */
  const getIncompleteAchievements = useCallback(() => {
    return achievements.filter((achievement) => !achievement.isCompleted);
  }, [achievements]);

  /**
   * Получить достижения по редкости
   * @param {string} rarity - Редкость (common, uncommon, rare, epic, legendary)
   * @returns {Array} Отфильтрованный массив достижений
   */
  const getAchievementsByRarity = useCallback(
    (rarity) => {
      return achievements.filter(
        (achievement) => achievement.rarity === rarity
      );
    },
    [achievements]
  );

  /**
   * Вычислить процент прогресса для достижения
   * @param {Object} achievement - Объект достижения
   * @returns {number} Процент выполнения (0-100)
   */
  const calculateProgress = useCallback((achievement) => {
    if (!achievement || !achievement.progress) return 0;

    const { current, target } = achievement.progress;
    return Math.min((current / target) * 100, 100);
  }, []);

  /**
   * Получить ближайшие к завершению достижения
   * @param {number} limit - Количество достижений для возврата
   * @returns {Array} Массив ближайших к завершению достижений
   */
  const getNearCompletionAchievements = useCallback(
    (limit = 3) => {
      return achievements
        .filter((achievement) => !achievement.isCompleted)
        .map((achievement) => ({
          ...achievement,
          progressPercent: calculateProgress(achievement),
        }))
        .sort((a, b) => b.progressPercent - a.progressPercent)
        .slice(0, limit);
    },
    [achievements, calculateProgress]
  );

  /**
   * Обновить прогресс для конкретного достижения
   * @param {number|string} achievementId - ID достижения
   * @param {Object} newProgress - Новый прогресс { current, target }
   */
  const updateAchievementProgress = useCallback(
    (achievementId, newProgress) => {
      setAchievements((prev) =>
        prev.map((achievement) =>
          achievement.id === achievementId
            ? {
                ...achievement,
                progress: newProgress,
                isCompleted: newProgress.current >= newProgress.target,
              }
            : achievement
        )
      );
    },
    []
  );

  // Автоматически загружаем достижения при монтировании хука
  useEffect(() => {
    loadAchievements();
    loadStats();
  }, [loadAchievements, loadStats]);
  return {
    // Данные с защитой типов
    achievements: Array.isArray(achievements) ? achievements : [],
    stats,
    isLoading,
    error,

    // Методы загрузки
    loadAchievements,
    loadStats,
    getAchievement,

    // Методы фильтрации
    getAchievementsByCategory,
    getCompletedAchievements,
    getIncompleteAchievements,
    getAchievementsByRarity,
    getNearCompletionAchievements,

    // Утилиты
    calculateProgress,
    updateAchievementProgress,
  };
};
