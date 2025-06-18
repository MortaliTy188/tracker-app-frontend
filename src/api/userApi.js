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
