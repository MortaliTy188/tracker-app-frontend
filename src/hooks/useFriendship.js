import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

const API_BASE = "http://localhost:3000/api";

/**
 * Хук для работы с системой друзей
 */
export const useFriendship = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getToken } = useAuth();

  // Получить список друзей
  const loadFriends = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const url = `${API_BASE}/friendship/friends?page=${page}&limit=${limit}`;

      console.log("🔍 LoadFriends - URL:", url);
      console.log("🔍 LoadFriends - Token:", token ? "Present" : "Missing");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 LoadFriends - Response Status:", response.status);
      console.log("🔍 LoadFriends - Response OK:", response.ok);

      const data = await response.json();
      console.log("🔍 LoadFriends - Response Data:", data);

      if (data.success) {
        setFriends(data.data.friends || []);
        return {
          success: true,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Ошибка при загрузке друзей");
      }
    } catch (error) {
      const errorMessage = error.message || "Ошибка при загрузке друзей";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Получить входящие запросы на дружбу
  const loadPendingRequests = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/friendship/requests/pending?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setPendingRequests(data.data.pendingRequests || []);
        return {
          success: true,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Ошибка при загрузке запросов");
      }
    } catch (error) {
      const errorMessage = error.message || "Ошибка при загрузке запросов";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Получить исходящие запросы на дружбу
  const loadSentRequests = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/friendship/requests/sent?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSentRequests(data.data.sentRequests || []);
        return {
          success: true,
          data: data.data,
        };
      } else {
        throw new Error(
          data.message || "Ошибка при загрузке отправленных запросов"
        );
      }
    } catch (error) {
      const errorMessage =
        error.message || "Ошибка при загрузке отправленных запросов";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Отправить запрос на дружбу
  const sendFriendRequest = useCallback(async (addresseeId) => {
    console.log("🤝 SendFriendRequest - Addressee ID:", addresseeId);
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const url = `${API_BASE}/friendship/request`;
      console.log("🤝 Request URL:", url);
      console.log("🤝 Request payload:", { addresseeId });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresseeId }),
      });

      const data = await response.json();
      console.log("🤝 Response data:", data);

      if (data.success) {
        console.log("🤝 Friend request sent successfully");
        return {
          success: true,
          message: data.message,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Ошибка при отправке запроса");
      }
    } catch (error) {
      const errorMessage = error.message || "Ошибка при отправке запроса";
      console.error("🤝 Error sending friend request:", errorMessage);
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Принять запрос на дружбу
  const acceptFriendRequest = useCallback(async (friendshipId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/friendship/${friendshipId}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Обновляем локальное состояние
        setPendingRequests((prev) =>
          prev.filter((req) => req.friendshipId !== friendshipId)
        );
        return {
          success: true,
          message: data.message,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Ошибка при принятии запроса");
      }
    } catch (error) {
      const errorMessage = error.message || "Ошибка при принятии запроса";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Отклонить запрос на дружбу
  const declineFriendRequest = useCallback(async (friendshipId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/friendship/${friendshipId}/decline`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Обновляем локальное состояние
        setPendingRequests((prev) =>
          prev.filter((req) => req.friendshipId !== friendshipId)
        );
        return {
          success: true,
          message: data.message,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Ошибка при отклонении запроса");
      }
    } catch (error) {
      const errorMessage = error.message || "Ошибка при отклонении запроса";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Удалить друга или отменить запрос
  const removeFriend = useCallback(async (friendshipId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/friendship/${friendshipId}/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Обновляем локальное состояние
        setFriends((prev) =>
          prev.filter((friend) => friend.friendshipId !== friendshipId)
        );
        setSentRequests((prev) =>
          prev.filter((req) => req.friendshipId !== friendshipId)
        );
        return {
          success: true,
          message: data.message,
        };
      } else {
        throw new Error(data.message || "Ошибка при удалении друга");
      }
    } catch (error) {
      const errorMessage = error.message || "Ошибка при удалении друга";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Получить статус дружбы с пользователем
  const getFriendshipStatus = useCallback(async (targetUserId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/friendship/status/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Ошибка при получении статуса дружбы");
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Ошибка при получении статуса дружбы",
      };
    }
  }, []);

  return {
    // State
    friends,
    pendingRequests,
    sentRequests,
    isLoading,
    error,

    // Actions
    loadFriends,
    loadPendingRequests,
    loadSentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    getFriendshipStatus,
  };
};
