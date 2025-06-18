/**
 * Функция для получения полного URL аватара
 * @param {string} avatarPath - путь к аватару
 * @returns {string|undefined} - полный URL или undefined
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return undefined;

  // Если путь уже полный URL (base64 или http), возвращаем как есть
  if (avatarPath.startsWith("data:") || avatarPath.startsWith("http")) {
    return avatarPath;
  }

  // Если путь начинается с /uploads, добавляем базовый URL сервера
  if (avatarPath.startsWith("/uploads")) {
    return `http://localhost:3000${avatarPath}`;
  }

  return avatarPath;
};
