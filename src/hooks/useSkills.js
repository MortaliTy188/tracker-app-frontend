import { useState, useCallback } from "react";
import { getUserSkills, getSkillsStats } from "../api/userApi";

/**
 * Хук для работы с навыками пользователя
 * @returns {Object} Объект с данными и методами для работы с навыками
 */
export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [skillsStats, setSkillsStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Загрузить список навыков пользователя
   */
  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserSkills();

      if (result.success) {
        setSkills(result.data || []);
      } else {
        setError(result.message);
        // При ошибке API все равно устанавливаем fallback данные
        setSkills(result.data || []);
      }
    } catch (error) {
      setError("Не удалось загрузить навыки");
      setSkills([]); // Устанавливаем пустой массив при ошибке
      console.error("Error loading skills:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Загрузить статистику навыков пользователя
   */
  const loadSkillsStats = useCallback(async () => {
    try {
      const result = await getSkillsStats();

      if (result.success) {
        setSkillsStats(result.data);
      } else {
        // При ошибке API все равно устанавливаем fallback данные
        setSkillsStats(result.data);
      }
    } catch (error) {
      console.error("Error loading skills stats:", error);
    }
  }, []);

  /**
   * Получить навыки по категории
   * @param {string} categoryName - Название категории
   * @returns {Array} Отфильтрованный массив навыков
   */
  const getSkillsByCategory = useCallback(
    (categoryName) => {
      return Array.isArray(skills)
        ? skills.filter((skill) => skill.category.name === categoryName)
        : [];
    },
    [skills]
  );

  /**
   * Получить завершенные навыки
   * @returns {Array} Массив завершенных навыков
   */
  const getCompletedSkills = useCallback(() => {
    return Array.isArray(skills)
      ? skills.filter((skill) => skill.stats.averageProgress === 100)
      : [];
  }, [skills]);

  /**
   * Получить навыки в процессе изучения
   * @returns {Array} Массив навыков в процессе
   */
  const getInProgressSkills = useCallback(() => {
    return Array.isArray(skills)
      ? skills.filter(
          (skill) =>
            skill.stats.averageProgress > 0 && skill.stats.averageProgress < 100
        )
      : [];
  }, [skills]);

  /**
   * Получить общий прогресс по всем навыкам
   * @returns {number} Средний прогресс в процентах
   */
  const getOverallProgress = useCallback(() => {
    if (!Array.isArray(skills) || skills.length === 0) return 0;

    const totalProgress = skills.reduce(
      (sum, skill) => sum + skill.stats.averageProgress,
      0
    );
    return Math.round(totalProgress / skills.length);
  }, [skills]);

  return {
    // Данные с защитой типов
    skills: Array.isArray(skills) ? skills : [],
    skillsStats,
    isLoading,
    error,

    // Методы загрузки
    loadSkills,
    loadSkillsStats,

    // Методы фильтрации и анализа
    getSkillsByCategory,
    getCompletedSkills,
    getInProgressSkills,
    getOverallProgress,
  };
};
