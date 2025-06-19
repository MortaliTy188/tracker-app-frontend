import { useState, useCallback, useMemo, useEffect } from "react";
import {
  getUserNotes,
  getNotesStats,
  createNote,
  updateNote,
  deleteNote,
} from "../api/userApi";

/**
 * Хук для работы с заметками пользователя
 * @returns {Object} Объект с данными и методами для работы с заметками
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [notesStats, setNotesStats] = useState({});
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI состояние для поиска и фильтрации
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  /**
   * Загрузить список заметок пользователя
   * @param {Object} params - Параметры запроса (limit, offset)
   */
  const loadNotes = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserNotes(params);

      if (result.success) {
        setNotes(result.data?.notes || []);
        setPagination(result.data?.pagination || null);
      } else {
        setError(result.message);
        // При ошибке API все равно устанавливаем fallback данные
        setNotes(result.data?.notes || []);
        setPagination(result.data?.pagination || null);
      }
    } catch (error) {
      setError("Не удалось загрузить заметки");
      setNotes([]);
      setPagination(null);
      console.error("Error loading notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  /**
   * Загрузить статистику заметок пользователя
   */
  const loadNotesStats = useCallback(async () => {
    try {
      const result = await getNotesStats();

      if (result.success) {
        setNotesStats(result.data);
      } else {
        // При ошибке API все равно устанавливаем fallback данные
        setNotesStats(result.data);
      }
    } catch (error) {
      console.error("Error loading notes stats:", error);
    }
  }, []);

  /**
   * Обновить статистику на основе текущих заметок
   */
  const updateLocalStats = useCallback(() => {
    if (!Array.isArray(notes) || notes.length === 0) {
      setNotesStats({
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        averageLength: 0,
      });
      return;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = notes.filter((note) => {
      const noteDate = new Date(note.createdAt || note.created_at);
      return noteDate >= weekAgo;
    }).length;

    const thisMonth = notes.filter((note) => {
      const noteDate = new Date(note.createdAt || note.created_at);
      return noteDate >= monthAgo;
    }).length;

    const totalLength = notes.reduce(
      (sum, note) => sum + (note.content?.length || 0),
      0
    );
    const averageLength = notes.length > 0 ? totalLength / notes.length : 0;

    setNotesStats({
      total: notes.length,
      thisWeek,
      thisMonth,
      averageLength,
    });
  }, [notes]);

  // Автоматическое обновление статистики при изменении заметок
  useEffect(() => {
    updateLocalStats();
  }, [updateLocalStats]);

  /**
   * Отфильтрованные и отсортированные заметки
   */
  const filteredNotes = useMemo(() => {
    let filtered = Array.isArray(notes) ? [...notes] : [];

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.topic?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.topic?.skill?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "length":
          aValue = a.content?.length || 0;
          bValue = b.content?.length || 0;
          break;
        case "date":
        default:
          aValue = new Date(a.createdAt || a.created_at);
          bValue = new Date(b.createdAt || b.created_at);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [notes, searchTerm, sortBy, sortOrder]);

  /**
   * Заметки для текущей страницы
   */
  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNotes.slice(startIndex, endIndex);
  }, [filteredNotes, currentPage, itemsPerPage]);

  /**
   * Получить заметки по поисковому запросу
   * @param {string} searchTerm - Поисковый запрос
   * @returns {Array} Отфильтрованный массив заметок
   */
  const searchNotes = useCallback(
    (searchTerm) => {
      if (!searchTerm || !Array.isArray(notes)) return notes;
      return notes.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.topic?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.topic?.skill?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    },
    [notes]
  );

  /**
   * Получить заметки за определенный период
   * @param {number} days - Количество дней назад
   * @returns {Array} Отфильтрованный массив заметок
   */
  const getNotesByPeriod = useCallback(
    (days) => {
      if (!Array.isArray(notes)) return [];

      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      return notes.filter(
        (note) => new Date(note.created_at || note.createdAt) >= dateThreshold
      );
    },
    [notes]
  );

  /**
   * Получить последние заметки
   * @param {number} limit - Количество заметок
   * @returns {Array} Массив последних заметок
   */
  const getRecentNotes = useCallback(
    (limit = 5) => {
      if (!Array.isArray(notes)) return [];
      return notes
        .sort(
          (a, b) =>
            new Date(b.created_at || b.createdAt) -
            new Date(a.created_at || a.createdAt)
        )
        .slice(0, limit);
    },
    [notes]
  );

  /**
   * Создать новую заметку
   * @param {Object} noteData - Данные заметки (title, content, tags)
   * @returns {Promise<Object>} Результат создания
   */ const createNewNote = useCallback(
    async (noteData) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createNote(noteData);

        if (result.success) {
          // Вместо добавления неполных данных, перезагружаем весь список
          // чтобы получить полную структуру данных с сервера
          await loadNotes();
          return result;
        } else {
          setError(result.message);
          return result;
        }
      } catch (error) {
        setError("Не удалось создать заметку");
        console.error("Error creating note:", error);
        return { success: false, message: "Не удалось создать заметку" };
      } finally {
        setIsLoading(false);
      }
    },
    [loadNotes]
  );

  /**
   * Обновить заметку
   * @param {number} noteId - ID заметки
   * @param {Object} noteData - Новые данные заметки
   * @returns {Promise<Object>} Результат обновления
   */ const updateExistingNote = useCallback(
    async (noteId, noteData) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateNote(noteId, noteData);

        if (result.success) {
          // Вместо локального обновления, перезагружаем весь список
          // чтобы получить полную структуру данных с сервера
          await loadNotes();
          return result;
        } else {
          setError(result.message);
          return result;
        }
      } catch (error) {
        setError("Не удалось обновить заметку");
        console.error("Error updating note:", error);
        return { success: false, message: "Не удалось обновить заметку" };
      } finally {
        setIsLoading(false);
      }
    },
    [loadNotes]
  );

  /**
   * Удалить заметку
   * @param {number} noteId - ID заметки
   * @returns {Promise<Object>} Результат удаления
   */ const deleteExistingNote = useCallback(
    async (noteId) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteNote(noteId);

        if (result.success) {
          // Перезагружаем список заметок после удаления
          await loadNotes();
          return result;
        } else {
          setError(result.message);
          return result;
        }
      } catch (error) {
        setError("Не удалось удалить заметку");
        console.error("Error deleting note:", error);
        return { success: false, message: "Не удалось удалить заметку" };
      } finally {
        setIsLoading(false);
      }
    },
    [loadNotes]
  );
  return {
    // Данные с защитой типов
    notes: Array.isArray(notes) ? notes : [],
    notesStats,
    pagination,
    isLoading,
    error,

    // UI состояние
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,

    // Обработанные данные
    filteredNotes,
    paginatedNotes,

    // Методы загрузки
    loadNotes,
    loadNotesStats,
    updateLocalStats,

    // Методы управления заметками
    createNewNote,
    updateExistingNote,
    deleteExistingNote,

    // Методы фильтрации и анализа
    searchNotes,
    getNotesByPeriod,
    getRecentNotes,
  };
};
