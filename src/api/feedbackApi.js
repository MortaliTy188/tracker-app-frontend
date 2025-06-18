import axios from "axios";

// API client for feedback operations
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Отправка обратной связи на сервер
 * @param {Object} feedbackData - данные обратной связи
 * @returns {Promise<Object>}
 */
export const sendFeedback = async (feedbackData) => {
  const response = await axios.post(`${API_BASE_URL}/feedback`, {
    user_name: feedbackData.name,
    user_email: feedbackData.email,
    email_theme: feedbackData.subject,
    message: feedbackData.message,
  });
  return response.data;
};

/**
 * Получение всех отзывов
 * @returns {Promise<Array>}
 */
export const getAllFeedback = async () => {
  const response = await axios.get(`${API_BASE_URL}/feedback`);
  return response.data;
};
