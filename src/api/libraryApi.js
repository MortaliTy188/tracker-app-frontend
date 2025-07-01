import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

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
 * Получить публичные навыки для библиотеки
 * @param {Object} params - параметры запроса
 * @returns {Promise<Object>} Результат запроса с публичными навыками
 */
export const getPublicSkills = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/library/skills", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching public skills:", error);
    throw error;
  }
};

/**
 * Получить детальную информацию о навыке
 * @param {number} skillId - ID навыка
 * @returns {Promise<Object>} Детальная информация о навыке
 */
export const getSkillDetails = async (skillId) => {
  try {
    const response = await apiClient.get(`/api/library/skills/${skillId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skill details:", error);
    throw error;
  }
};

/**
 * Поставить/убрать лайк навыку
 * @param {number} skillId - ID навыка
 * @param {string} type - тип оценки ('like' или 'dislike')
 * @returns {Promise<Object>} Результат операции
 */
export const toggleSkillLike = async (skillId, type) => {
  try {
    const response = await apiClient.post(
      `/api/library/skills/${skillId}/like`,
      {
        type,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling skill like:", error);
    throw error;
  }
};

/**
 * Добавить комментарий к навыку
 * @param {number} skillId - ID навыка
 * @param {string} content - текст комментария
 * @param {number} parentCommentId - ID родительского комментария (для ответов)
 * @returns {Promise<Object>} Созданный комментарий
 */
export const addSkillComment = async (
  skillId,
  content,
  parentCommentId = null
) => {
  try {
    const response = await apiClient.post(
      `/api/library/skills/${skillId}/comments`,
      {
        content,
        parent_comment_id: parentCommentId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding skill comment:", error);
    throw error;
  }
};

/**
 * Получить комментарии навыка
 * @param {number} skillId - ID навыка
 * @param {Object} params - параметры пагинации
 * @returns {Promise<Object>} Комментарии навыка
 */
export const getSkillComments = async (skillId, params = {}) => {
  try {
    const response = await apiClient.get(
      `/api/library/skills/${skillId}/comments`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching skill comments:", error);
    throw error;
  }
};

/**
 * Обновить статус публичности навыка
 * @param {number} skillId - ID навыка
 * @param {boolean} isPublic - публичный ли навык
 * @returns {Promise<Object>} Обновленный навык
 */
export const updateSkillPublicity = async (skillId, isPublic) => {
  try {
    const response = await apiClient.patch(
      `/api/library/skills/${skillId}/publicity`,
      {
        is_public: isPublic,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating skill publicity:", error);
    throw error;
  }
};

/**
 * Получить категории навыков для фильтрации
 * @returns {Promise<Object>} Список категорий
 */
export const getSkillCategories = async () => {
  try {
    const response = await apiClient.get("/api/skill-categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching skill categories:", error);
    throw error;
  }
};
