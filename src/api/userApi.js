import axios from "axios";

// API client for user operations
const API_BASE_URL = "http://localhost:3000/api";

// Функция для получения токена
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Настройка axios interceptor для автоматического добавления токена
axios.interceptors.request.use(
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
 * Логин пользователя
 * @param {Object} credentials - email и password
 * @returns {Promise<Object>}
 */
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
  return response.data;
};

/**
 * Регистрация пользователя
 * @param {Object} userData - данные для регистрации
 * @returns {Promise<Object>}
 */
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
  return response.data;
};

/**
 * Получение полной информации о пользователе
 * @returns {Promise<Object>}
 */
export const getUserFullInfo = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/full-info`);
  return response.data;
};

/**
 * Обновление профиля пользователя
 * @param {Object} profileData - данные профиля для обновления
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
  const response = await axios.put(
    `${API_BASE_URL}/users/profile`,
    profileData
  );
  return response.data;
};

/**
 * Изменение пароля пользователя
 * @param {Object} passwordData - текущий и новый пароль
 * @returns {Promise<Object>}
 */
export const changePassword = async (passwordData) => {
  const response = await axios.put(
    `${API_BASE_URL}/users/change-password`,
    passwordData
  );
  return response.data;
};

/**
 * Загрузка аватара пользователя
 * @param {File} file - файл изображения
 * @returns {Promise<Object>}
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await axios.post(`${API_BASE_URL}/users/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Получить историю активности пользователя
 * @returns {Promise<Object>} Результат запроса с данными об активности
 */
export const getUserActivity = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/activity/my`);

    if (response.data && response.data.success) {
      // Преобразуем данные для удобного использования
      const activityLogs = response.data.data?.logs || [];
      const transformedLogs = activityLogs.map((log) => ({
        id: log.id,
        action: log.action,
        date: log.created_at,
        details: log.details,
        status: getActivityStatus(log.action),
        description: getActivityDescription(log.action, log.details),
      }));

      return {
        success: true,
        data: transformedLogs,
        message: "История активности успешно загружена",
      };
    } else {
      return {
        success: false,
        message:
          response.data?.message || "Ошибка при загрузке истории активности",
        data: getFallbackActivityData(),
      };
    }
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Не удалось загрузить историю активности",
      data: getFallbackActivityData(),
    };
  }
};

/**
 * Получить статус для типа активности
 * @param {string} action - Тип действия
 * @returns {string} Статус (success, info, warning)
 */
const getActivityStatus = (action) => {
  switch (action) {
    case "ACHIEVEMENT_EARNED":
    case "GOAL_COMPLETED":
    case "EMAIL_VERIFIED":
      return "success";
    case "NOTE_CREATED":
    case "TOPIC_CREATED":
    case "SKILL_CREATED":
    case "GOAL_CREATED":
    case "LOGIN":
    case "REGISTRATION":
      return "info";
    case "PASSWORD_CHANGED":
    case "PASSWORD_CHANGE":
    case "PROFILE_UPDATED":
    case "AVATAR_CHANGE":
    case "FEEDBACK_SENT":
      return "warning";
    case "LOGOUT":
      return "default";
    default:
      return "default";
  }
};

/**
 * Получить описание для типа активности
 * @param {string} action - Тип действия
 * @param {Object} details - Детали действия
 * @returns {string} Описание действия
 */
const getActivityDescription = (action, details) => {
  switch (action) {
    case "ACHIEVEMENT_EARNED":
      return `Получено достижение: ${
        details?.achievementTitle || "Неизвестное достижение"
      }`;
    case "NOTE_CREATED":
      return `Создана заметка: ${details?.noteTitle || "Без названия"}`;
    case "TOPIC_CREATED":
      return `Создана тема: ${details?.topicTitle || "Без названия"}`;
    case "SKILL_CREATED":
      return `Создан навык: ${
        details?.skillTitle || details?.skillName || "Без названия"
      }`;
    case "AVATAR_CHANGE":
      return "Изменен аватар";
    case "PASSWORD_CHANGED":
    case "PASSWORD_CHANGE":
      return "Изменен пароль";
    case "PROFILE_UPDATED":
      return "Обновлен профиль";
    case "LOGIN":
      return "Вход в систему";
    case "LOGOUT":
      return "Выход из системы";
    case "GOAL_CREATED":
      return `Создана цель: ${details?.goalTitle || "Без названия"}`;
    case "GOAL_COMPLETED":
      return `Завершена цель: ${details?.goalTitle || "Неизвестная цель"}`;
    case "EMAIL_VERIFIED":
      return "Подтвержден email";
    case "REGISTRATION":
      return "Регистрация в системе";
    case "FEEDBACK_SENT":
      return "Отправлена обратная связь";
    default:
      return `Неизвестное действие: ${action}`;
  }
};

/**
 * Fallback данные для истории активности
 * @returns {Array} Массив с примерами активности
 */
const getFallbackActivityData = () => [
  {
    id: 1,
    action: "LOGIN",
    date: new Date().toISOString(),
    status: "info",
    description: "Вход в систему",
  },
  {
    id: 2,
    action: "PROFILE_UPDATED",
    date: new Date(Date.now() - 86400000).toISOString(), // вчера
    status: "warning",
    description: "Обновлен профиль",
  },
  {
    id: 3,
    action: "ACHIEVEMENT_EARNED",
    date: new Date(Date.now() - 172800000).toISOString(), // позавчера
    status: "success",
    description: "Получено достижение: Первые шаги",
  },
];

/**
 * Получить статистику по навыкам пользователя
 * @returns {Promise<Object>} Результат запроса со статистикой навыков
 */
export const getSkillsStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/skills/stats`);

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: "Статистика навыков успешно загружена",
      };
    } else {
      return {
        success: false,
        message:
          response.data?.message || "Ошибка при загрузке статистики навыков",
        data: getFallbackSkillsStats(),
      };
    }
  } catch (error) {
    console.error("Error fetching skills stats:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Не удалось загрузить статистику навыков",
      data: getFallbackSkillsStats(),
    };
  }
};

/**
 * Получить список навыков пользователя
 * @returns {Promise<Object>} Результат запроса со списком навыков
 */
export const getUserSkills = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/skills`);

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data.skills || [],
        message: "Навыки успешно загружены",
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Ошибка при загрузке навыков",
        data: getFallbackSkills(),
      };
    }
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Не удалось загрузить навыки",
      data: getFallbackSkills(),
    };
  }
};

/**
 * Fallback данные для статистики навыков
 * @returns {Object} Объект со статистикой навыков
 */
const getFallbackSkillsStats = () => ({
  overview: {
    totalSkills: 3,
    totalTopics: 8,
    averageProgress: 65,
    completedTopics: 5,
    completionRate: 62.5,
  },
  categoryStats: {
    Программирование: {
      skillsCount: 2,
      topicsCount: 5,
      averageProgress: 70,
    },
    Дизайн: {
      skillsCount: 1,
      topicsCount: 3,
      averageProgress: 55,
    },
  },
});

/**
 * Fallback данные для навыков
 * @returns {Array} Массив навыков
 */
const getFallbackSkills = () => [
  {
    id: 1,
    name: "JavaScript",
    description: "Изучение основ JavaScript",
    category_id: 1,
    user_id: 1,
    category: {
      id: 1,
      name: "Программирование",
    },
    topics: [
      {
        id: 1,
        name: "Переменные и типы данных",
        progress: 100,
        status: {
          id: 1,
          name: "Завершено",
        },
      },
      {
        id: 2,
        name: "Функции",
        progress: 80,
        status: {
          id: 2,
          name: "В процессе",
        },
      },
    ],
    stats: {
      totalTopics: 2,
      averageProgress: 90,
      completedTopics: 1,
    },
  },
  {
    id: 2,
    name: "React",
    description: "Изучение библиотеки React",
    category_id: 1,
    user_id: 1,
    category: {
      id: 1,
      name: "Программирование",
    },
    topics: [
      {
        id: 3,
        name: "Компоненты",
        progress: 60,
        status: {
          id: 2,
          name: "В процессе",
        },
      },
    ],
    stats: {
      totalTopics: 1,
      averageProgress: 60,
      completedTopics: 0,
    },
  },
];
