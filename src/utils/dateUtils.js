/**
 * Утилиты для работы с датами
 */

/**
 * Безопасное форматирование даты
 * @param {string|Date} date - Дата для форматирования
 * @returns {string} Отформатированная дата
 */
export const formatSafeDate = (date) => {
  if (!date) return "Не указано";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }

    return dateObj.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Ошибка даты";
  }
};

/**
 * Форматирование даты в числовом формате (ДД.ММ.ГГГГ)
 * @param {string|Date} date - Дата для форматирования
 * @returns {string} Отформатированная дата в числовом формате
 */
export const formatNumericDate = (date) => {
  if (!date) return "Не указано";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }

    return dateObj.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Ошибка даты";
  }
};

/**
 * Форматирование даты и времени
 * @param {string|Date} date - Дата для форматирования
 * @returns {string} Отформатированная дата и время
 */
export const formatDateTime = (date) => {
  if (!date) return "Не указано";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }

    return dateObj.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Ошибка даты";
  }
};

/**
 * Получить относительное время (например, "2 дня назад")
 * @param {string|Date} date - Дата
 * @returns {string} Относительное время
 */
export const getRelativeTime = (date) => {
  if (!date) return "Неизвестно";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }

    const now = new Date();
    const diffInMs = now - dateObj;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1
          ? "Только что"
          : `${diffInMinutes} минут назад`;
      }
      return diffInHours === 1 ? "1 час назад" : `${diffInHours} часов назад`;
    } else if (diffInDays === 1) {
      return "Вчера";
    } else if (diffInDays < 7) {
      return `${diffInDays} дней назад`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "1 неделю назад" : `${weeks} недель назад`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? "1 месяц назад" : `${months} месяцев назад`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? "1 год назад" : `${years} лет назад`;
    }
  } catch (error) {
    console.error("Ошибка получения относительного времени:", error);
    return "Ошибка даты";
  }
};
