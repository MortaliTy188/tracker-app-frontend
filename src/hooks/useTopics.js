import { useState, useCallback } from "react";
import { getUserTopics } from "../api/userApi";

/**
 * Хук для работы с топиками пользователя
 * @returns {Object} Объект с данными и методами для работы с топиками
 */
export const useTopics = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Загрузить список топиков пользователя
   */ const loadTopics = useCallback(async () => {
    console.log("Loading topics...");
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserTopics();
      console.log("Topics result:", result);

      if (result.success) {
        console.log("Setting topics:", result.data);
        setTopics(result.data || []);
      } else {
        console.log("Topics loading failed:", result.message);
        setError(result.message);
        setTopics([]);
      }
    } catch (error) {
      console.log("Topics loading error:", error);
      setError("Не удалось загрузить топики");
      setTopics([]);
      console.error("Error loading topics:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Получить топики по навыку
   * @param {number} skillId - ID навыка
   * @returns {Array} Отфильтрованный массив топиков
   */
  const getTopicsBySkill = useCallback(
    (skillId) => {
      if (!Array.isArray(topics)) return [];
      return topics.filter((topic) => topic.skill?.id === skillId);
    },
    [topics]
  );

  /**
   * Найти топик по ID
   * @param {number} topicId - ID топика
   * @returns {Object|null} Найденный топик или null
   */
  const getTopicById = useCallback(
    (topicId) => {
      if (!Array.isArray(topics)) return null;
      return topics.find((topic) => topic.id === topicId) || null;
    },
    [topics]
  );

  return {
    // Данные
    topics: Array.isArray(topics) ? topics : [],
    isLoading,
    error,

    // Методы
    loadTopics,
    getTopicsBySkill,
    getTopicById,
  };
};
