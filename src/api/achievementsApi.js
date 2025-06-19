import axios from "axios";

// API client for achievements operations
const API_BASE_URL = "http://localhost:3000";

// Функция для получения токена
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Создаем экземпляр axios с автоматическим добавлением токена
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Получить прогресс по всем достижениям пользователя
 * @returns {Promise<Object>} Результат запроса с данными о достижениях
 */
export const getAchievementsProgress = async () => {
  try {
    const response = await apiClient.get("/api/achievements/progress");

    if (response.data && response.data.success) {
      // Преобразуем данные сервера в удобный формат
      const progressData = response.data.data?.progress || [];
      const transformedData = progressData.map((item) => ({
        id: item.achievement.id,
        name: item.achievement.name,
        description: item.achievement.description,
        icon: item.achievement.icon,
        category: item.achievement.type,
        isCompleted: item.is_completed,
        progress: {
          current: item.progress,
          target: item.max_progress,
        },
        percentage: item.percentage,
        earnedAt: item.completed_at,
        rarity: item.achievement.rarity,
        points: item.achievement.points,
      }));

      return {
        success: true,
        data: transformedData,
        message: response.data.message || "Достижения успешно загружены",
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Ошибка при загрузке достижений",
        data: getFallbackAchievements(),
      };
    }
  } catch (error) {
    console.error("Error fetching achievements progress:", error);

    // Возвращаем fallback данные при ошибке
    return {
      success: false,
      message:
        error.response?.data?.message || "Не удалось загрузить достижения",
      data: getFallbackAchievements(),
    };
  }
};

/**
 * Получить детальную информацию о конкретном достижении
 * @param {number|string} achievementId - ID достижения
 * @returns {Promise<Object>} Результат запроса с данными о достижении
 */
export const getAchievementDetails = async (achievementId) => {
  try {
    const response = await apiClient.get(`/api/achievements/${achievementId}`);

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Достижение успешно загружено",
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Ошибка при загрузке достижения",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error fetching achievement details:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Не удалось загрузить достижение",
      data: null,
    };
  }
};

/**
 * Fallback данные для достижений (на случай недоступности сервера)
 * @returns {Array} Массив достижений с прогрессом
 */
const getFallbackAchievements = () => [
  {
    id: 1,
    name: "Первые шаги",
    description: "Создали первую цель обучения",
    icon: "🏆",
    category: "beginner",
    isCompleted: true,
    progress: {
      current: 1,
      target: 1,
    },
    earnedAt: "2024-06-15T10:30:00Z",
    rarity: "common",
    points: 10,
  },
  {
    id: 2,
    name: "Марафонец",
    description: "7 дней подряд активности",
    icon: "🏃",
    category: "consistency",
    isCompleted: true,
    progress: {
      current: 7,
      target: 7,
    },
    earnedAt: "2024-06-16T18:45:00Z",
    rarity: "uncommon",
    points: 25,
  },
  {
    id: 3,
    name: "Целеустремленный",
    description: "Завершили 10 целей",
    icon: "🎯",
    category: "goals",
    isCompleted: false,
    progress: {
      current: 5,
      target: 10,
    },
    earnedAt: null,
    rarity: "rare",
    points: 50,
  },
  {
    id: 4,
    name: "Эксперт",
    description: "100 часов обучения",
    icon: "📚",
    category: "learning",
    isCompleted: false,
    progress: {
      current: 42,
      target: 100,
    },
    earnedAt: null,
    rarity: "epic",
    points: 100,
  },
  {
    id: 5,
    name: "Мастер",
    description: "Завершили 50 целей",
    icon: "👑",
    category: "goals",
    isCompleted: false,
    progress: {
      current: 5,
      target: 50,
    },
    earnedAt: null,
    rarity: "legendary",
    points: 250,
  },
  {
    id: 6,
    name: "Легенда",
    description: "30 дней подряд активности",
    icon: "⭐",
    category: "consistency",
    isCompleted: false,
    progress: {
      current: 7,
      target: 30,
    },
    earnedAt: null,
    rarity: "legendary",
    points: 500,
  },
];

/**
 * Получить статистику по достижениям
 * @returns {Promise<Object>} Результат запроса со статистикой
 */
export const getAchievementsStats = async () => {
  try {
    const response = await apiClient.get("/api/achievements/stats");
    if (response.data && response.data.success) {
      // Преобразуем статистику в нужный формат
      const statsData = response.data.data?.stats;
      const transformedStats = {
        totalAchievements: statsData?.total || 0,
        completedAchievements: statsData?.completed || 0,
        completionRate: statsData?.percentage || 0,
        earnedPoints: statsData?.points || 0,
      };

      return {
        success: true,
        data: transformedStats,
        message: response.data.message || "Статистика успешно загружена",
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Ошибка при загрузке статистики",
        data: getFallbackStats(),
      };
    }
  } catch (error) {
    console.error("Error fetching achievements stats:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Не удалось загрузить статистику",
      data: getFallbackStats(),
    };
  }
};

/**
 * Fallback данные для статистики достижений
 * @returns {Object} Объект со статистикой
 */
const getFallbackStats = () => ({
  totalAchievements: 6,
  completedAchievements: 2,
  earnedPoints: 35,
  completionRate: 33.33,
});
