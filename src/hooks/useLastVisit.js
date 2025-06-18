import { useEffect } from "react";

export const useLastVisit = () => {
  const updateLastVisit = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      const lastVisit = localStorage.getItem("lastVisit");

      if (lastVisit) {
        localStorage.setItem("previousVisit", lastVisit);
      }

      localStorage.setItem("lastVisit", new Date().toISOString());
    }
  };

  const getPreviousVisit = () => {
    return localStorage.getItem("previousVisit");
  };

  const getLastVisit = () => {
    return localStorage.getItem("lastVisit");
  };

  const clearVisitHistory = () => {
    localStorage.removeItem("lastVisit");
    localStorage.removeItem("previousVisit");
  };

  useEffect(() => {
    updateLastVisit();
  }, []);

  return {
    updateLastVisit,
    getPreviousVisit,
    getLastVisit,
    clearVisitHistory,
  };
};
